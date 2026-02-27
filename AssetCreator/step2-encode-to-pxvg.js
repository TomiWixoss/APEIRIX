#!/usr/bin/env node
// BƯỚC 2: Chuyển đổi ảnh từ reference/ sang PXVG
// Đảm bảo đã copy ảnh vào reference/ trước khi chạy

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Lấy tham số từ command line
const versionName = process.argv[2];
const pixciExe = process.argv[3] || './pixci-cli.exe';

if (!versionName) {
    console.error('\x1b[31m✗ Thiếu tên version!\x1b[0m');
    console.log('Cách dùng: node step2-encode-to-pxvg.js <tên_version>');
    process.exit(1);
}

// Kiểm tra pixci-cli.exe
if (!fs.existsSync(pixciExe)) {
    console.error(`\x1b[31m✗ Không tìm thấy ${pixciExe}\x1b[0m`);
    process.exit(1);
}

// Kiểm tra version tồn tại
const versionPath = path.join('versions', versionName);
if (!fs.existsSync(versionPath)) {
    console.error(`\x1b[31m✗ Không tìm thấy version '${versionName}'\x1b[0m`);
    console.log('Chạy step1-create-version.js trước');
    process.exit(1);
}

const referencePath = path.join(versionPath, 'reference');
const pxvgPath = path.join(versionPath, 'pxvg');

// Kiểm tra có ảnh trong reference không
const imageExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];
const imageFiles = fs.readdirSync(referencePath)
    .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()));

if (imageFiles.length === 0) {
    console.error(`\x1b[31m✗ Không tìm thấy file ảnh nào trong '${referencePath}'\x1b[0m`);
    console.log('Vui lòng copy ảnh vào thư mục reference/ trước');
    process.exit(1);
}

console.log(`\n\x1b[36m==> Tìm thấy ${imageFiles.length} file ảnh trong reference/\x1b[0m`);
console.log('\x1b[36m==> Đang chuyển đổi sang PXVG format...\x1b[0m\n');

let convertedCount = 0;
let failedCount = 0;
imageFiles.forEach(imageFile => {
    const baseName = path.parse(imageFile).name;
    const inputPath = path.join(referencePath, imageFile);
    const outputPath = path.join(pxvgPath, `${baseName}.pxvg.xml`);
    
    process.stdout.write(`  ${imageFile}...`);
    
    try {
        execSync(`"${pixciExe}" encode "${inputPath}" -o "${outputPath}" -f pxvg --auto`, {
            stdio: 'pipe'
        });
        console.log(' \x1b[32m✓\x1b[0m');
        convertedCount++;
    } catch (error) {
        console.log(' \x1b[33m⚠\x1b[0m');
        failedCount++;
    }
});

if (failedCount > 0) {
    console.log(`\n\x1b[33m⚠ Đã chuyển đổi ${convertedCount}/${imageFiles.length} file (${failedCount} lỗi)\x1b[0m`);
    console.log('\x1b[33mLưu ý: pixci-cli.exe có thể cần cài đặt thêm. Các file đã convert vẫn dùng được.\x1b[0m\n');
} else {
    console.log(`\n\x1b[32m✓ Đã chuyển đổi ${convertedCount}/${imageFiles.length} file sang PXVG\x1b[0m\n`);
}

if (convertedCount > 0) {
    console.log('\x1b[32mBƯỚC TIẾP THEO:\x1b[0m');
    console.log(`  1. Chạy: node generate-ai-prompt.js ${versionName}`);
    console.log('  2. Paste response AI vào file placeholder');
    console.log(`  3. Chạy: node extract-pxvg-from-ai.js ${versionName} ai-response-placeholder.txt\n`);
}
