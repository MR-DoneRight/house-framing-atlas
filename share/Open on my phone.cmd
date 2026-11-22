@echo off
setlocal DisableDelayedExpansion
set "ATLAS_PHONE_LAUNCHER=%~f0"
powershell.exe -NoLogo -NoProfile -Command "$path=$env:ATLAS_PHONE_LAUNCHER; $file=[IO.File]::ReadAllText($path); $marker='### ATLAS '+'POWERSHELL ###'; $body=$file.Substring($file.IndexOf($marker,[StringComparison]::Ordinal)+$marker.Length); & ([ScriptBlock]::Create($body))"
set "ATLAS_PHONE_STATUS=%ERRORLEVEL%"
if not "%ATLAS_PHONE_STATUS%"=="0" pause
exit /b %ATLAS_PHONE_STATUS%

### ATLAS POWERSHELL ###
$ErrorActionPreference = 'Stop'

function Test-AtlasPrivateAddress([Net.IPAddress]$Address) {
    if ($Address.AddressFamily -ne [Net.Sockets.AddressFamily]::InterNetwork) { return $false }
    $octets = $Address.GetAddressBytes()
    return $octets[0] -eq 10 -or
        ($octets[0] -eq 172 -and $octets[1] -ge 16 -and $octets[1] -le 31) -or
        ($octets[0] -eq 192 -and $octets[1] -eq 168)
}

function Get-AtlasLanAdapter {
    # Prefer the active home Wi-Fi. A PC plugged into the same router also works.
    $candidates = foreach ($nic in [Net.NetworkInformation.NetworkInterface]::GetAllNetworkInterfaces()) {
        if ($nic.OperationalStatus -ne 'Up') { continue }
        $kind = $nic.NetworkInterfaceType.ToString()
        $wireless = $kind -eq 'Wireless80211'
        if (-not $wireless -and $kind -notmatch 'Ethernet') { continue }
        if ($nic.Name -match 'Default Switch|WSL|Docker|Loopback' -or
            $nic.Description -match 'Wi-Fi Direct|VirtualBox|VMware|WireGuard|TAP-Windows|Tailscale') { continue }
        $network = $nic.GetIPProperties()
        $gateway = @($network.GatewayAddresses | Where-Object {
            $_.Address.AddressFamily -eq [Net.Sockets.AddressFamily]::InterNetwork -and
            $_.Address.ToString() -ne '0.0.0.0'
        }).Count -gt 0
        if (-not $wireless -and -not $gateway) { continue }
        $rank = 0
        if ($wireless) { $rank += 10 }
        if ($gateway) { $rank += 20 }
        foreach ($unicast in $network.UnicastAddresses) {
            if (-not (Test-AtlasPrivateAddress $unicast.Address)) { continue }
            $mask = $unicast.IPv4Mask
            if ($null -eq $mask -or $mask.ToString() -eq '0.0.0.0') { continue }
            [pscustomobject]@{ Address=$unicast.Address; Mask=$mask; Name=$nic.Name; Rank=$rank }
        }
    }
    return $candidates | Sort-Object Rank -Descending | Select-Object -First 1
}

function Test-AtlasSameSubnet([Net.IPAddress]$Peer, $Adapter) {
    if ($Peer.AddressFamily -ne [Net.Sockets.AddressFamily]::InterNetwork) { return $false }
    $peerBytes = $Peer.GetAddressBytes()
    $hostBytes = $Adapter.Address.GetAddressBytes()
    $maskBytes = $Adapter.Mask.GetAddressBytes()
    for ($i=0; $i -lt 4; $i++) {
        if (($peerBytes[$i] -band $maskBytes[$i]) -ne ($hostBytes[$i] -band $maskBytes[$i])) { return $false }
    }
    return $true
}

function Read-AtlasRequestLine([IO.Stream]$Stream) {
    $buffer = New-Object byte[] 1024
    $headers = [Text.StringBuilder]::new()
    $timer = [Diagnostics.Stopwatch]::StartNew()
    while ($headers.Length -lt 8192 -and $timer.ElapsedMilliseconds -lt 2500) {
        $Stream.ReadTimeout = [Math]::Max(1, [int](2500 - $timer.ElapsedMilliseconds))
        $count = $Stream.Read($buffer, 0, $buffer.Length)
        if ($count -le 0) { return '' }
        $null = $headers.Append([Text.Encoding]::ASCII.GetString($buffer, 0, $count))
        $text = $headers.ToString()
        if ($text.Contains("`r`n`r`n")) { return $text.Substring(0, $text.IndexOf("`r`n")) }
    }
    return ''
}

function Write-AtlasResponse([IO.Stream]$Stream, [string]$Status, [string]$Type, [byte[]]$Bytes, [bool]$HeadOnly) {
    $lines = @(
        "HTTP/1.1 $Status"
        "Content-Type: $Type"
        "Content-Length: $($Bytes.Length)"
        'Connection: close'
        'Allow: GET, HEAD'
        'Cache-Control: no-store'
        'X-Content-Type-Options: nosniff'
        ''
        ''
    )
    $header = [Text.Encoding]::ASCII.GetBytes(($lines -join "`r`n"))
    $Stream.Write($header, 0, $header.Length)
    if (-not $HeadOnly -and $Bytes.Length -gt 0) { $Stream.Write($Bytes, 0, $Bytes.Length) }
}

function Send-AtlasPage($Client, $Adapter, [byte[]]$Page) {
    $stream = $Client.GetStream()
    $stream.WriteTimeout = 3500
    if (-not (Test-AtlasSameSubnet $Client.Client.RemoteEndPoint.Address $Adapter)) { return }
    $request = Read-AtlasRequestLine $stream
    if (-not $request) { return }
    $isParsed = $request -cmatch '^([A-Z]+) ([^ ]+) HTTP/1\.[01]$'
    $plain = 'text/plain; charset=utf-8'
    if (-not $isParsed) {
        Write-AtlasResponse $stream '400 Bad Request' $plain ([Text.Encoding]::UTF8.GetBytes('Invalid request.')) $false
        return
    }
    $method = $Matches[1]
    $target = $Matches[2].Split('?')[0]
    $headOnly = $method -ceq 'HEAD'
    if ($method -cne 'GET' -and -not $headOnly) {
        Write-AtlasResponse $stream '405 Method Not Allowed' $plain ([Text.Encoding]::UTF8.GetBytes('Use GET or HEAD.')) $false
    } elseif ($target -eq '/' -or $target -eq '/House%20Framing%20Atlas.html') {
        # Only return the fixed in-memory document. No request text becomes a file path.
        Write-AtlasResponse $stream '200 OK' 'text/html; charset=utf-8' $Page $headOnly
    } else {
        Write-AtlasResponse $stream '404 Not Found' $plain ([Text.Encoding]::UTF8.GetBytes('Open the address shown on your PC.')) $headOnly
    }
}

$listener = $null
try {
    $folder = [IO.Path]::GetDirectoryName($env:ATLAS_PHONE_LAUNCHER)
    $atlasPath = [IO.Path]::Combine($folder, 'House Framing Atlas.html')
    if (-not [IO.File]::Exists($atlasPath)) {
        throw 'Place this launcher and House Framing Atlas.html together in the same extracted folder, then open the launcher again.'
    }
    $page = [IO.File]::ReadAllBytes($atlasPath)
    $adapter = Get-AtlasLanAdapter
    if ($null -eq $adapter) {
        throw 'No home-network address found. Connect this PC to your home Wi-Fi or router by Ethernet, then open the launcher again.'
    }
    # Port zero asks Windows to pick a free port. No firewall or system settings are changed.
    $listener = [Net.Sockets.TcpListener]::new($adapter.Address, 0)
    $listener.Start(8)
    $port = $listener.LocalEndpoint.Port
    Write-Host ''
    Write-Host 'House Framing Atlas' -ForegroundColor Cyan
    Write-Host '1. Connect your phone to the same private home Wi-Fi as this PC.'
    Write-Host '2. Type this full address in Safari or Chrome on your phone.'
    Write-Host ''
    Write-Host "   http://$($adapter.Address):$port/" -ForegroundColor Green
    Write-Host ''
    Write-Host "3. Keep this window open while you use the atlas. Close it to stop sharing."
    Write-Host "   PC connection: $($adapter.Name)"
    Write-Host ''
    Write-Host 'If the page does not open, check that both devices use your home network.'
    Write-Host 'Guest Wi-Fi, a VPN, or a firewall may block local connections.'
    Write-Host 'If Windows asks for network access, choose Private networks only.'
    while ($true) {
        if (-not $listener.Pending()) { Start-Sleep -Milliseconds 60; continue }
        $client = $listener.AcceptTcpClient()
        try { Send-AtlasPage $client $adapter $page }
        catch [IO.IOException] { } # Browsers may abandon requests while loading or navigating away.
        catch [Net.Sockets.SocketException] { }
        finally { $client.Close() }
    }
} catch {
    Write-Host ''
    Write-Host $_.Exception.Message -ForegroundColor Yellow
    exit 1
} finally {
    if ($null -ne $listener) { $listener.Stop() }
}
