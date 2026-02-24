#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Build và deploy APEIRIX addon
.DESCRIPTION
    Script này sẽ:
    1. Compile configs thành JSON files (addon-generator)
    2. Build TypeScript thành JavaScript (Regolith)
    3. Deploy sang Minecraft development folders
#>

Write-Host "🚀 APEIRIX Build & Deploy Pipeline" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Step 1: Compile configs
Write-Host "`n📦 Step 1: Compiling configs..." -ForegroundColor Yellow
Set-Location addon-generator
$compileResult = bun run dev compile configs/addon.yaml
Set-Location ..

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Config compilation failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Configs compiled successfully" -ForegroundColor Green

# Step 2: Build & Deploy with Regolith
Write-Host "`n🔨 Step 2: Building with Regolith..." -ForegroundColor Yellow
regolith run

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Regolith build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Build & Deploy completed successfully!" -ForegroundColor Green
Write-Host "🎮 Ready to test in Minecraft with /reload" -ForegroundColor Cyan
