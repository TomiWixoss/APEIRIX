# Build TypeScript (chạy ở project root)
Set-Location ../..
npm run build

# Copy compiled scripts vào .regolith/tmp/BP/scripts (Regolith working directory)
$sourcePath = "./dist/scripts"
$destPath = "./.regolith/tmp/BP/scripts"

if (Test-Path $sourcePath) {
    # Tạo thư mục đích nếu chưa có
    if (-not (Test-Path $destPath)) {
        New-Item -Path $destPath -ItemType Directory -Force | Out-Null
    }
    
    # Copy NỘI DUNG bên trong thư mục scripts
    Copy-Item -Path "$sourcePath\*" -Destination $destPath -Recurse -Force
    Write-Host "Scripts copied successfully from $sourcePath to $destPath"
} else {
    Write-Error "Source path $sourcePath not found!"
    exit 1
}

# ALSO copy to addon-generator/build/BP/scripts for CLI tool
$destPath2 = "./addon-generator/build/BP/scripts"
if (Test-Path $destPath2) {
    Copy-Item -Path "$sourcePath\*" -Destination $destPath2 -Recurse -Force
    Write-Host "Scripts also copied to $destPath2"
}
