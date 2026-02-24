Write-Host "🚀 APEIRIX Build & Deploy Pipeline" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan

Write-Host ""
Write-Host "📦 Step 1: Compiling configs..." -ForegroundColor Yellow
Write-Host ("-" * 60) -ForegroundColor DarkGray
Write-Host ""

Push-Location addon-generator
bun run dev compile configs/addon.yaml --clean
$compileExitCode = $LASTEXITCODE
Pop-Location

if ($compileExitCode -ne 0) {
    Write-Host ""
    Write-Host "❌ Config compilation failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Configs compiled successfully" -ForegroundColor Green

Write-Host ""
Write-Host "🔨 Step 2: Building with Regolith..." -ForegroundColor Yellow
Write-Host ("-" * 60) -ForegroundColor DarkGray
Write-Host ""

regolith run

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Regolith build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build & Deploy completed!" -ForegroundColor Green
Write-Host "🎮 Ready to test with /reload" -ForegroundColor Cyan