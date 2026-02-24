# AssetCreator Version Script
# Tạo nhanh thư mục version mới

param(
    [Parameter(Mandatory=$true)]
    [string]$VersionName,
    
    [string]$BasePath = "C:\Users\tomis\Docs\APEIRIX\AssetCreator\versions"
)

$timestamp = Get-Date -Format "yyyy-MM-dd"
$folderName = "${timestamp}_${VersionName}"
$fullPath = Join-Path $BasePath $folderName

if (Test-Path $fullPath) {
    Write-Host "Folder already exists: $fullPath"
    exit 1
}

New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $fullPath "icons") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $fullPath "pxvg") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $fullPath "preview") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $fullPath "reference") -Force | Out-Null

Write-Host "Created: $fullPath"
Write-Host ""
Write-Host "Structure:"
Write-Host "  - icons/"
Write-Host "  - pxvg/"
Write-Host "  - preview/"
Write-Host "  - reference/"
