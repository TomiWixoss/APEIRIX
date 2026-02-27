#!/usr/bin/env node
// Script tạo prompt cho AI để chỉnh sửa PXVG
// Gộp docs + danh sách PXVG thành 1 file prompt

const fs = require('fs');
const path = require('path');

// Lấy tham số từ command line
const versionName = process.argv[2];
const docsPath = process.argv[3] || 'docs/llms.txt';

if (!versionName) {
    console.error('\x1b[31m✗ Thiếu tên version!\x1b[0m');
    console.log('Cách dùng: node generate-ai-prompt.js <tên_version> [đường_dẫn_docs]');
    process.exit(1);
}

// Kiểm tra version tồn tại
const versionPath = path.join('versions', versionName);
if (!fs.existsSync(versionPath)) {
    console.error(`\x1b[31m✗ Không tìm thấy version '${versionName}'\x1b[0m`);
    process.exit(1);
}

const pxvgPath = path.join(versionPath, 'pxvg');

// Kiểm tra có file PXVG không
const pxvgFiles = fs.readdirSync(pxvgPath)
    .filter(file => file.endsWith('.pxvg.xml'));

if (pxvgFiles.length === 0) {
    console.error(`\x1b[31m✗ Không tìm thấy file PXVG nào trong '${pxvgPath}'\x1b[0m`);
    process.exit(1);
}

console.log(`\n\x1b[36m==> Tìm thấy ${pxvgFiles.length} file PXVG\x1b[0m`);

// Tạo file prompt
const outputPath = path.join(versionPath, 'ai-prompt.txt');
const promptContent = [];

// Thêm docs
if (fs.existsSync(docsPath)) {
    console.log(`\x1b[36m==> Thêm nội dung từ ${docsPath}\x1b[0m`);
    const docsContent = fs.readFileSync(docsPath, 'utf8');
    promptContent.push('# HƯỚNG DẪN PXVG FORMAT');
    promptContent.push('');
    promptContent.push(docsContent);
    promptContent.push('');
    promptContent.push('='.repeat(80));
    promptContent.push('');
}

// Thêm danh sách PXVG
promptContent.push('# DANH SÁCH FILE PXVG CẦN CHỈNH SỬA');
promptContent.push('');
promptContent.push('Dưới đây là các file PXVG hiện tại. Hãy chỉnh sửa chúng theo yêu cầu.');
promptContent.push('');

pxvgFiles.forEach(pxvgFile => {
    const content = fs.readFileSync(path.join(pxvgPath, pxvgFile), 'utf8');
    
    promptContent.push(`## FILE: ${pxvgFile}`);
    promptContent.push('```xml');
    promptContent.push(content.trim());
    promptContent.push('```');
    promptContent.push('');
});

// Thêm hướng dẫn cho AI
promptContent.push('='.repeat(80));
promptContent.push('');
promptContent.push('# YÊU CẦU CHO AI');
promptContent.push('');
promptContent.push('Hãy chỉnh sửa các file PXVG trên theo yêu cầu của tôi.');
promptContent.push('Khi trả lời, hãy xuất từng file PXVG đã chỉnh sửa theo định dạng:');
promptContent.push('');
promptContent.push('```pxvg:filename.pxvg.xml');
promptContent.push('<pxvg w="32" h="32" xmlns="http://pixci.dev/pxvg">');
promptContent.push('  <!-- Nội dung PXVG đã chỉnh sửa -->');
promptContent.push('</pxvg>');
promptContent.push('```');
promptContent.push('');
promptContent.push('CHÚ Ý: Phải dùng đúng định dạng ```pxvg:ten_file.pxvg.xml để script có thể trích xuất tự động.');
promptContent.push('');

// Lưu file prompt
fs.writeFileSync(outputPath, promptContent.join('\n'), 'utf8');

// Tạo file response placeholder
const responsePlaceholderPath = path.join(versionPath, 'ai-response-placeholder.txt');
const responsePlaceholder = [
    '# Đây là file placeholder cho response của AI',
    '# Copy response của AI vào đây, sau đó chạy:',
    `# node extract-pxvg-from-ai.js ${versionName} ai-response-placeholder.txt`,
    '',
    '# Format mẫu mà AI cần trả về:',
    '# ```pxvg:steel_hammer.pxvg.xml',
    '# <pxvg w="16" h="16" xmlns="http://pixci.dev/pxvg">',
    '#   <palette>',
    '#     <color k="A" hex="#FF0000FF" />',
    '#   </palette>',
    '#   <layer id="main">',
    '#     <rect x="0" y="0" w="16" h="16" c="A" />',
    '#   </layer>',
    '# </pxvg>',
    '# ```',
    '',
    '='.repeat(80),
    '',
    '# PASTE RESPONSE CỦA AI VÀO ĐÂY:',
    ''
].join('\n');

fs.writeFileSync(responsePlaceholderPath, responsePlaceholder, 'utf8');

console.log(`\x1b[32m✓ Đã tạo file prompt: ${outputPath}\x1b[0m`);
console.log(`\x1b[32m✓ Đã tạo file placeholder: ${responsePlaceholderPath}\x1b[0m\n`);
console.log('\x1b[32mBƯỚC TIẾP THEO:\x1b[0m');
console.log(`  1. Mở file: ${outputPath}`);
console.log('  2. Copy nội dung và gửi cho AI');
console.log(`  3. Paste response của AI vào: ${responsePlaceholderPath}`);
console.log(`  4. Chạy: node extract-pxvg-from-ai.js ${versionName} ai-response-placeholder.txt\n`);
