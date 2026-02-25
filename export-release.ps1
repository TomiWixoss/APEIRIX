# Export APEIRIX to .mcaddon
param([string]$Version = "1.0.0")

Write-Host "=== APEIRIX Release Exporter ===" -ForegroundColor Cyan

# Step 1: Compile
Write-Host "[1/6] Compiling..." -ForegroundColor Yellow
Push-Location addon-generator
bun run dev compile configs/addon.yaml --clean
if ($LASTEXITCODE -ne 0) { exit 1 }
Pop-Location

# Step 2: Build
Write-Host "[2/6] Building..." -ForegroundColor Yellow
regolith run release
if ($LASTEXITCODE -ne 0) { exit 1 }

# Step 3: Setup
Write-Host "[3/6] Setup..." -ForegroundColor Yellow
$ExportDir = ".\exports"
$TempDir = ".\temp_mcaddon"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$FinalFile = "APEIRIX_v${Version}_${Timestamp}.mcaddon"

if (-not (Test-Path $ExportDir)) { 
    New-Item -ItemType Directory -Path $ExportDir | Out-Null 
}
if (Test-Path $TempDir) { 
    Remove-Item -Recurse -Force $TempDir 
}
New-Item -ItemType Directory -Path $TempDir | Out-Null

# Step 4: Create mcpacks using .NET
Write-Host "[4/6] Creating mcpacks..." -ForegroundColor Yellow
Add-Type -AssemblyName System.IO.Compression.FileSystem

# BP mcpack
$BPSourcePath = (Resolve-Path ".\build\APEIRIX_bp").Path
$TempDirPath = (Resolve-Path $TempDir).Path
$BPPackPath = Join-Path $TempDirPath "BP.mcpack"
[System.IO.Compression.ZipFile]::CreateFromDirectory($BPSourcePath, $BPPackPath)
Write-Host "    - Behavior Pack created" -ForegroundColor Gray

# RP mcpack
$RPSourcePath = (Resolve-Path ".\build\APEIRIX_rp").Path
$RPPackPath = Join-Path $TempDirPath "RP.mcpack"
[System.IO.Compression.ZipFile]::CreateFromDirectory($RPSourcePath, $RPPackPath)
Write-Host "    - Resource Pack created" -ForegroundColor Gray

# Step 5: Create mcaddon
Write-Host "[5/6] Creating mcaddon..." -ForegroundColor Yellow
$ExportDirPath = (Resolve-Path $ExportDir).Path
$McaddonPath = Join-Path $ExportDirPath $FinalFile
[System.IO.Compression.ZipFile]::CreateFromDirectory($TempDirPath, $McaddonPath)

# Step 6: Cleanup
Write-Host "[6/6] Cleanup..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $TempDir

$FinalPath = Join-Path $ExportDir $FinalFile
$FileSize = (Get-Item $FinalPath).Length / 1MB
Write-Host ""
Write-Host "Export Complete!" -ForegroundColor Green
Write-Host "Output: $FinalPath" -ForegroundColor Cyan
Write-Host "Size: $([math]::Round($FileSize, 2)) MB" -ForegroundColor Gray
Write-Host ""
Write-Host "Cai dat:" -ForegroundColor Yellow
Write-Host "  1. Double-click file .mcaddon" -ForegroundColor Gray
Write-Host "  2. Minecraft se tu dong import" -ForegroundColor Gray
Write-Host "  3. Tao world moi va enable addon" -ForegroundColor Gray
