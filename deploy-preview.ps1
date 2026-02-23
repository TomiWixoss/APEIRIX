# Deploy APEIRIX to Minecraft Preview
# Chạy sau khi regolith run để copy packs sang Preview

$PreviewPath = "$env:LOCALAPPDATA\..\Roaming\Minecraft Bedrock Preview\Users\Shared\games\com.mojang"
$BPSource = ".\build\APEIRIX_bp"
$RPSource = ".\build\APEIRIX_rp"
$BPDest = "$PreviewPath\development_behavior_packs\APEIRIX_bp"
$RPDest = "$PreviewPath\development_resource_packs\APEIRIX_rp"

Write-Host "Deploying APEIRIX to Minecraft Preview..." -ForegroundColor Cyan

# Kiểm tra Preview có cài không
if (-not (Test-Path $PreviewPath)) {
    Write-Host "Error: Minecraft Preview not found!" -ForegroundColor Red
    Write-Host "Path: $PreviewPath" -ForegroundColor Yellow
    exit 1
}

# Kiểm tra build folder
if (-not (Test-Path $BPSource)) {
    Write-Host "Error: Build folder not found! Run 'regolith run' first." -ForegroundColor Red
    exit 1
}

# Xóa packs cũ nếu có
if (Test-Path $BPDest) {
    Write-Host "Removing old BP..." -ForegroundColor Yellow
    Remove-Item $BPDest -Recurse -Force
}

if (Test-Path $RPDest) {
    Write-Host "Removing old RP..." -ForegroundColor Yellow
    Remove-Item $RPDest -Recurse -Force
}

# Copy packs mới
Write-Host "Copying Behavior Pack..." -ForegroundColor Green
Copy-Item $BPSource $BPDest -Recurse -Force

Write-Host "Copying Resource Pack..." -ForegroundColor Green
Copy-Item $RPSource $RPDest -Recurse -Force

Write-Host "`nDeployment complete!" -ForegroundColor Green
Write-Host "Packs deployed to:" -ForegroundColor Cyan
Write-Host "  BP: $BPDest" -ForegroundColor Gray
Write-Host "  RP: $RPDest" -ForegroundColor Gray
Write-Host "`nOpen Minecraft Preview and use /reload to apply changes." -ForegroundColor Yellow
