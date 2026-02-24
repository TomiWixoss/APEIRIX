#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Chỉ compile configs thành JSON files
.DESCRIPTION
    Script này chỉ chạy addon-generator để compile YAML configs thành JSON files
    Không deploy sang Minecraft
#>

Write-Host "📦 Compiling APEIRIX configs..." -ForegroundColor Cyan
Write-Host ("-" * 60) -ForegroundColor DarkGray
Write-Host ""

Set-Location addon-generator
& bun run dev compile configs/addon.yaml --clean
$exitCode = $LASTEXITCODE
Set-Location ..

if ($exitCode -eq 0) {
    Write-Host ""
    Write-Host "✅ Compilation completed!" -ForegroundColor Green
    Write-Host "📁 Output: addon-generator/build/" -ForegroundColor Cyan
    Write-Host "💡 Run 'regolith run' to deploy" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Compilation failed!" -ForegroundColor Red
    exit 1
}
