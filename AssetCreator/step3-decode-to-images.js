#!/usr/bin/env node
// BƯỚC 3: Chuyển đổi PXVG thành preview (x10) và icon (x1)
// Chạy sau khi đã chỉnh sửa các file PXVG

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Lấy tham số từ command line
const versionNameOrPath = process.argv[2];
const pixciExe = process.argv[3] || './pixci-cli.exe';

if (!versionNameOrPath) {
    console.error('\x1b[31m✗ Thiếu tên version hoặc đường dẫn!\x1b[0m');
    console.log('Cách dùng: node step3-decode-to-images.js <tên_version|đường_dẫn_tuyệt_đối>');
    console.log('Ví dụ: node step3-decode-to-images.js 2026-02-27_alloy-steel');
    console.log('Hoặc: node step3-decode-to-images.js C:\\Users\\tomis\\Docs\\APEIRIX\\AssetCreator\\versions\\2026-02-27_alloy-steel');
    process.exit(1);
}

// Kiểm tra pixci-cli.exe
if (!fs.existsSync(pixciExe)) {
    console.error(`\x1b[31m✗ Không tìm thấy ${pixciExe}\x1b[0m`);
    process.exit(1);
}

// Xác định đường dẫn version (hỗ trợ cả tên và đường dẫn tuyệt đối)
let versionPath;
let versionName;

if (path.isAbsolute(versionNameOrPath)) {
    // Đường dẫn tuyệt đối
    versionPath = versionNameOrPath;
    versionName = path.basename(versionPath);
} else {
    // Tên version (tương đối)
    versionPath = path.join('versions', versionNameOrPath);
    versionName = versionNameOrPath;
}

// Kiểm tra version tồn tại
if (!fs.existsSync(versionPath)) {
    console.error(`\x1b[31m✗ Không tìm thấy version tại: ${versionPath}\x1b[0m`);
    process.exit(1);
}

const pxvgEditedPath = path.join(versionPath, 'pxvg-edited');
const previewPath = path.join(versionPath, 'preview');
const iconPath = path.join(versionPath, 'icons');

// Kiểm tra có file PXVG đã chỉnh sửa không
if (!fs.existsSync(pxvgEditedPath)) {
    console.error(`\x1b[31m✗ Không tìm thấy thư mục '${pxvgEditedPath}'\x1b[0m`);
    process.exit(1);
}

const pxvgFiles = fs.readdirSync(pxvgEditedPath)
    .filter(file => file.endsWith('.pxvg.xml'));

if (pxvgFiles.length === 0) {
    console.error(`\x1b[31m✗ Không tìm thấy file PXVG nào trong '${pxvgEditedPath}'\x1b[0m`);
    console.log('Copy file PXVG từ pxvg/ sang pxvg-edited/ và chỉnh sửa trước');
    process.exit(1);
}

// Làm sạch thư mục output
console.log('\n\x1b[36m==> Làm sạch thư mục preview và icons...\x1b[0m');
if (fs.existsSync(previewPath)) {
    fs.readdirSync(previewPath).forEach(file => {
        fs.unlinkSync(path.join(previewPath, file));
    });
}
if (fs.existsSync(iconPath)) {
    fs.readdirSync(iconPath).forEach(file => {
        fs.unlinkSync(path.join(iconPath, file));
    });
}

console.log(`\x1b[36m==> Tìm thấy ${pxvgFiles.length} file PXVG\x1b[0m`);

// ===== BƯỚC 1: TẠO TẤT CẢ PREVIEW (x10) =====
console.log('\x1b[36m==> Đang tạo preview (x10)...\x1b[0m\n');

let previewCount = 0;

pxvgFiles.forEach(pxvgFile => {
    const baseName = pxvgFile.replace('.pxvg.xml', '');
    const inputPath = path.join(pxvgEditedPath, pxvgFile);
    const outputPreview = path.join(previewPath, `${baseName}.png`);
    
    process.stdout.write(`  ${baseName}...`);
    
    try {
        execSync(`"${pixciExe}" decode "${inputPath}" -o "${outputPreview}" --scale 10`, {
            stdio: 'pipe'
        });
        previewCount++;
        console.log(' \x1b[32m✓\x1b[0m');
    } catch (error) {
        console.log(' \x1b[31m✗\x1b[0m');
    }
});

console.log(`\n\x1b[32m✓ Đã tạo ${previewCount}/${pxvgFiles.length} preview\x1b[0m`);

// ===== BƯỚC 2: TẠO TẤT CẢ ICON (x1) =====
console.log('\x1b[36m==> Đang tạo icon (x1)...\x1b[0m\n');

let iconCount = 0;

pxvgFiles.forEach(pxvgFile => {
    const baseName = pxvgFile.replace('.pxvg.xml', '');
    const inputPath = path.join(pxvgEditedPath, pxvgFile);
    const outputIcon = path.join(iconPath, `${baseName}.png`);
    
    process.stdout.write(`  ${baseName}...`);
    
    try {
        execSync(`"${pixciExe}" decode "${inputPath}" -o "${outputIcon}" --scale 1`, {
            stdio: 'pipe'
        });
        iconCount++;
        console.log(' \x1b[32m✓\x1b[0m');
    } catch (error) {
        console.log(' \x1b[31m✗\x1b[0m');
    }
});

console.log('\n\x1b[32m✓ Hoàn thành!\x1b[0m\n');
console.log('\x1b[33mKết quả:\x1b[0m');
console.log(`  - Preview (x10): ${previewPath} (${previewCount} files)`);
console.log(`  - Icon (x1): ${iconPath} (${iconCount} files)\n`);
console.log('\x1b[36mKiểm tra thư mục preview/ để xem kết quả!\x1b[0m');
console.log('\x1b[36mFile icon/ có thể copy vào addon-generator/assets/\x1b[0m\n');
