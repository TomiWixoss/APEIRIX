# Build và deploy APEIRIX to Minecraft Preview
# Script tổng hợp: Build với Regolith + Deploy sang Preview

Write-Host "=== APEIRIX Build & Deploy ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build với Regolith
Write-Host "[1/2] Building with Regolith..." -ForegroundColor Yellow
regolith run

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nBuild failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`nBuild successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Deploy sang Preview
Write-Host "[2/2] Deploying to Preview..." -ForegroundColor Yellow
& .\deploy-preview.ps1

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nDeployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== All Done! ===" -ForegroundColor Green
