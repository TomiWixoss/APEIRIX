#!/usr/bin/env node
// BƯỚC 1: Tạo version mới với 6 thư mục
// Sau khi chạy xong, copy ảnh vào thư mục reference/

const fs = require('fs');
const path = require('path');

// Lấy tham số từ command line
const versionName = process.argv[2];

if (!versionName) {
    console.error('\x1b[31m✗ Thiếu tên version!\x1b[0m');
    console.log('Cách dùng: node step1-create-version.js <tên_version>');
    console.log('Ví dụ: node step1-create-version.js steel_alloy');
    process.exit(1);
}

// Tạo tên version với timestamp
const timestamp = new Date().toISOString().split('T')[0];
const fullVersionName = `${timestamp}_${versionName}`;
const versionPath = path.join('versions', fullVersionName);

console.log(`\n\x1b[36m==> Tạo version mới: ${fullVersionName}\x1b[0m`);

// Kiểm tra version đã tồn tại chưa
if (fs.existsSync(versionPath)) {
    console.error(`\x1b[31m✗ Version '${fullVersionName}' đã tồn tại!\x1b[0m`);
    process.exit(1);
}

// Đảm bảo chạy từ thư mục AssetCreator
const scriptDir = __dirname;
process.chdir(scriptDir);

// Tạo thư mục versions nếu chưa có
if (!fs.existsSync('versions')) {
    fs.mkdirSync('versions', { recursive: true });
}

// Tạo 6 thư mục theo cấu trúc chuẩn
const folders = [
    'reference',
    'pxvg',
    'pxvg-edited',
    'preview',
    'icons'
];

fs.mkdirSync(versionPath, { recursive: true });
folders.forEach(folder => {
    fs.mkdirSync(path.join(versionPath, folder), { recursive: true });
});

console.log('\x1b[32m✓ Đã tạo cấu trúc thư mục thành công!\x1b[0m\n');
console.log('\x1b[33mCấu trúc:\x1b[0m');
console.log(`  ${versionPath}/`);
console.log('  ├── reference/    (Đặt ảnh gốc vào đây)');
console.log('  ├── pxvg/         (PXVG gốc - không chỉnh sửa)');
console.log('  ├── pxvg-edited/  (Copy PXVG vào đây để chỉnh sửa)');
console.log('  ├── preview/      (Preview x10 - tự động tạo)');
console.log('  └── icons/        (Icon x1 - tự động tạo)\n');
console.log('\x1b[32mBƯỚC TIẾP THEO:\x1b[0m');
console.log(`  1. Copy các file ảnh PNG vào: ${path.join(versionPath, 'reference')}`);
console.log(`  2. Chạy: node step2-encode-to-pxvg.js ${fullVersionName}\n`);
