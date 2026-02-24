# Build TypeScript (chạy ở project root)
Set-Location ../..
npm run build

# Copy compiled scripts vào addon-generator/build/BP/scripts
$sourcePath = "./dist/scripts"
$destPath = "./addon-generator/build/BP/scripts"

if (Test-Path $sourcePath) {
    # Tạo thư mục đích nếu chưa có
    if (-not (Test-Path $destPath)) {
        New-Item -Path $destPath -ItemType Directory -Force | Out-Null
    }
    
    # Copy NỘI DUNG bên trong thư mục scripts (không copy folder scripts itself)
    Copy-Item -Path "$sourcePath\*" -Destination $destPath -Recurse -Force
    Write-Host "Scripts copied successfully from $sourcePath to $destPath"
} else {
    Write-Error "Source path $sourcePath not found!"
    exit 1
}
