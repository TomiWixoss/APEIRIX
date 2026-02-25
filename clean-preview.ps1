# Clean APEIRIX packs from Minecraft Preview
# Xóa toàn bộ BP và RP của APEIRIX trong Preview (cả development và normal packs)

$PreviewPath = "$env:LOCALAPPDATA\..\Roaming\Minecraft Bedrock Preview\Users\Shared\games\com.mojang"

Write-Host "Cleaning APEIRIX from Minecraft Preview..." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Gray

# Kiểm tra Preview có cài không
if (-not (Test-Path $PreviewPath)) {
    Write-Host "Error: Minecraft Preview not found!" -ForegroundColor Red
    Write-Host "Path: $PreviewPath" -ForegroundColor Yellow
    exit 1
}

$cleaned = $false

# Xóa tất cả Development packs
$devBPPath = "$PreviewPath\development_behavior_packs"
$devRPPath = "$PreviewPath\development_resource_packs"

if (Test-Path $devBPPath) {
    $devBPs = Get-ChildItem -Path $devBPPath -Directory | Where-Object { $_.Name -like "*APEIRIX*" -or $_.Name -like "*apeirix*" }
    foreach ($pack in $devBPs) {
        Write-Host "Removing Development BP: $($pack.Name)..." -ForegroundColor Yellow
        Remove-Item -LiteralPath $pack.FullName -Recurse -Force
        Write-Host "Removed: $($pack.FullName)" -ForegroundColor Green
        $cleaned = $true
    }
}

if (Test-Path $devRPPath) {
    $devRPs = Get-ChildItem -Path $devRPPath -Directory | Where-Object { $_.Name -like "*APEIRIX*" -or $_.Name -like "*apeirix*" }
    foreach ($pack in $devRPs) {
        Write-Host "Removing Development RP: $($pack.Name)..." -ForegroundColor Yellow
        Remove-Item -LiteralPath $pack.FullName -Recurse -Force
        Write-Host "Removed: $($pack.FullName)" -ForegroundColor Green
        $cleaned = $true
    }
}

# Xóa tất cả Normal packs (từ .mcaddon imports)
$normalBPPath = "$PreviewPath\behavior_packs"
$normalRPPath = "$PreviewPath\resource_packs"

if (Test-Path $normalBPPath) {
    $normalBPs = Get-ChildItem -Path $normalBPPath -Directory | Where-Object { $_.Name -like "*APEIRIX*" -or $_.Name -like "*apeirix*" }
    foreach ($pack in $normalBPs) {
        Write-Host "Removing Normal BP: $($pack.Name)..." -ForegroundColor Yellow
        Remove-Item -LiteralPath $pack.FullName -Recurse -Force
        Write-Host "Removed: $($pack.FullName)" -ForegroundColor Green
        $cleaned = $true
    }
}

if (Test-Path $normalRPPath) {
    $normalRPs = Get-ChildItem -Path $normalRPPath -Directory | Where-Object { $_.Name -like "*APEIRIX*" -or $_.Name -like "*apeirix*" }
    foreach ($pack in $normalRPs) {
        Write-Host "Removing Normal RP: $($pack.Name)..." -ForegroundColor Yellow
        Remove-Item -LiteralPath $pack.FullName -Recurse -Force
        Write-Host "Removed: $($pack.FullName)" -ForegroundColor Green
        $cleaned = $true
    }
}

Write-Host "`n============================================================" -ForegroundColor Gray

if ($cleaned) {
    Write-Host "Cleanup complete!" -ForegroundColor Green
    Write-Host "All APEIRIX packs have been removed from Minecraft Preview." -ForegroundColor Cyan
    Write-Host "`nNote: Restart Minecraft Preview to see changes." -ForegroundColor Yellow
} else {
    Write-Host "Already clean!" -ForegroundColor Green
    Write-Host "No APEIRIX packs found in Minecraft Preview." -ForegroundColor Cyan
}
