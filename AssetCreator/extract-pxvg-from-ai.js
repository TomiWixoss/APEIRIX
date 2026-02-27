#!/usr/bin/env node
// Script trích xuất PXVG từ response của AI
// Đọc file response, tìm các block ```pxvg:filename.pxvg.xml và lưu vào pxvg-edited/

const fs = require('fs');
const path = require('path');

// Lấy tham số từ command line
const versionName = process.argv[2];
const responseFile = process.argv[3];

if (!versionName || !responseFile) {
    console.error('\x1b[31m✗ Thiếu tham số!\x1b[0m');
    console.log('Cách dùng: node extract-pxvg-from-ai.js <tên_version> <file_response>');
    process.exit(1);
}

// Kiểm tra version tồn tại
const versionPath = path.join('versions', versionName);
if (!fs.existsSync(versionPath)) {
    console.error(`\x1b[31m✗ Không tìm thấy version '${versionName}'\x1b[0m`);
    process.exit(1);
}

// Kiểm tra file response
if (!fs.existsSync(responseFile)) {
    console.error(`\x1b[31m✗ Không tìm thấy file response: ${responseFile}\x1b[0m`);
    process.exit(1);
}

const pxvgEditedPath = path.join(versionPath, 'pxvg-edited');

// Tạo thư mục pxvg-edited nếu chưa có
if (!fs.existsSync(pxvgEditedPath)) {
    fs.mkdirSync(pxvgEditedPath, { recursive: true });
}

console.log(`\n\x1b[36m==> Đọc file response: ${responseFile}\x1b[0m`);
const responseContent = fs.readFileSync(responseFile, 'utf8');

// Tìm tất cả các block PXVG
// Pattern: ```pxvg:filename.pxvg.xml ... ```
const pattern = /```pxvg:([^\n]+)\n([\s\S]*?)```/g;
const matches = [...responseContent.matchAll(pattern)];

if (matches.length === 0) {
    console.error('\x1b[31m✗ Không tìm thấy block PXVG nào trong file response\x1b[0m');
    console.log('Đảm bảo AI xuất theo định dạng: ```pxvg:filename.pxvg.xml');
    process.exit(1);
}

console.log(`\x1b[36m==> Tìm thấy ${matches.length} file PXVG trong response\x1b[0m\n`);

let extractedCount = 0;
matches.forEach(match => {
    const fileName = match[1].trim();
    const pxvgContent = match[2].trim();
    
    // Lưu vào pxvg-edited
    const outputFile = path.join(pxvgEditedPath, fileName);
    
    process.stdout.write(`  Trích xuất: ${fileName}...`);
    
    try {
        fs.writeFileSync(outputFile, pxvgContent, 'utf8');
        console.log(' \x1b[32m✓\x1b[0m');
        extractedCount++;
    } catch (error) {
        console.log(' \x1b[31m✗\x1b[0m');
    }
});

console.log(`\n\x1b[32m✓ Đã trích xuất ${extractedCount} file vào: ${pxvgEditedPath}\x1b[0m\n`);
console.log('\x1b[32mBƯỚC TIẾP THEO:\x1b[0m');
console.log(`  Chạy: node step3-decode-to-images.js ${versionName}\n`);
