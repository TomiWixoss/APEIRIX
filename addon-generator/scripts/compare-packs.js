#!/usr/bin/env node

/**
 * APEIRIX Pack Comparison Tool
 * So sánh giữa addon-generator/build/ và packs/ để phát hiện sự khác biệt
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Màu sắc cho console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  log('\n' + '='.repeat(80), 'cyan');
  log(message, 'bright');
  log('='.repeat(80), 'cyan');
}

function subheader(message) {
  log('\n' + '-'.repeat(60), 'blue');
  log(message, 'bright');
  log('-'.repeat(60), 'blue');
}

// Đường dẫn
const BUILD_BP = path.join(__dirname, '../build/BP');
const BUILD_RP = path.join(__dirname, '../build/RP');
const PACKS_BP = path.join(__dirname, '../../packs/BP');
const PACKS_RP = path.join(__dirname, '../../packs/RP');

// Kết quả khảo sát
const results = {
  bp: {
    buildOnly: [],
    packsOnly: [],
    different: [],
    identical: [],
  },
  rp: {
    buildOnly: [],
    packsOnly: [],
    different: [],
    identical: [],
  },
  stats: {
    totalFiles: 0,
    identicalFiles: 0,
    differentFiles: 0,
    buildOnlyFiles: 0,
    packsOnlyFiles: 0,
  }
};

/**
 * Đọc tất cả files trong thư mục (recursive)
 */
function getAllFiles(dir, baseDir = dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, baseDir, fileList);
    } else {
      const relativePath = path.relative(baseDir, filePath);
      fileList.push(relativePath);
    }
  });

  return fileList;
}

/**
 * So sánh 2 file JSON
 */
function compareJSON(file1, file2) {
  try {
    const content1 = JSON.parse(fs.readFileSync(file1, 'utf8'));
    const content2 = JSON.parse(fs.readFileSync(file2, 'utf8'));
    
    return {
      identical: JSON.stringify(content1, null, 2) === JSON.stringify(content2, null, 2),
      content1,
      content2,
    };
  } catch (error) {
    return {
      identical: false,
      error: error.message,
    };
  }
}

/**
 * So sánh 2 file text
 */
function compareText(file1, file2) {
  try {
    const content1 = fs.readFileSync(file1, 'utf8');
    const content2 = fs.readFileSync(file2, 'utf8');
    
    return {
      identical: content1 === content2,
      content1,
      content2,
    };
  } catch (error) {
    return {
      identical: false,
      error: error.message,
    };
  }
}

/**
 * So sánh 2 thư mục
 */
function comparePacks(buildDir, packsDir, packType) {
  subheader(`Đang khảo sát ${packType}...`);

  const buildFiles = getAllFiles(buildDir);
  const packsFiles = getAllFiles(packsDir);

  log(`\nBuild: ${buildFiles.length} files`, 'cyan');
  log(`Packs: ${packsFiles.length} files`, 'cyan');

  // Files chỉ có trong build
  const buildOnly = buildFiles.filter(f => !packsFiles.includes(f));
  results[packType].buildOnly = buildOnly;

  // Files chỉ có trong packs
  const packsOnly = packsFiles.filter(f => !buildFiles.includes(f));
  results[packType].packsOnly = packsOnly;

  // Files có trong cả 2
  const commonFiles = buildFiles.filter(f => packsFiles.includes(f));

  log(`\nChung: ${commonFiles.length} files`, 'yellow');
  log(`Build only: ${buildOnly.length} files`, 'red');
  log(`Packs only: ${packsOnly.length} files`, 'magenta');

  // So sánh nội dung files chung
  commonFiles.forEach(file => {
    const buildFile = path.join(buildDir, file);
    const packsFile = path.join(packsDir, file);
    const ext = path.extname(file);

    let comparison;
    if (ext === '.json') {
      comparison = compareJSON(buildFile, packsFile);
    } else {
      comparison = compareText(buildFile, packsFile);
    }

    if (comparison.identical) {
      results[packType].identical.push(file);
    } else {
      results[packType].different.push({
        file,
        ...comparison,
      });
    }
  });

  // Cập nhật stats
  results.stats.totalFiles += buildFiles.length + packsOnly.length;
  results.stats.identicalFiles += results[packType].identical.length;
  results.stats.differentFiles += results[packType].different.length;
  results.stats.buildOnlyFiles += buildOnly.length;
  results.stats.packsOnlyFiles += packsOnly.length;
}

/**
 * Phân tích sự khác biệt JSON
 */
function analyzeJSONDiff(obj1, obj2, path = '') {
  const diffs = [];

  const keys1 = Object.keys(obj1 || {});
  const keys2 = Object.keys(obj2 || {});
  const allKeys = [...new Set([...keys1, ...keys2])];

  allKeys.forEach(key => {
    const currentPath = path ? `${path}.${key}` : key;
    const val1 = obj1?.[key];
    const val2 = obj2?.[key];

    if (val1 === undefined) {
      diffs.push({ path: currentPath, type: 'missing_in_build', value: val2 });
    } else if (val2 === undefined) {
      diffs.push({ path: currentPath, type: 'missing_in_packs', value: val1 });
    } else if (typeof val1 === 'object' && typeof val2 === 'object') {
      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (JSON.stringify(val1) !== JSON.stringify(val2)) {
          diffs.push({ path: currentPath, type: 'array_diff', build: val1, packs: val2 });
        }
      } else {
        diffs.push(...analyzeJSONDiff(val1, val2, currentPath));
      }
    } else if (val1 !== val2) {
      diffs.push({ path: currentPath, type: 'value_diff', build: val1, packs: val2 });
    }
  });

  return diffs;
}

/**
 * In báo cáo chi tiết
 */
function printDetailedReport() {
  header('BÁO CÁO CHI TIẾT');

  // BP Report
  subheader('BEHAVIOR PACK (BP)');
  
  if (results.bp.buildOnly.length > 0) {
    log('\n📦 Files chỉ có trong BUILD:', 'yellow');
    results.bp.buildOnly.forEach(f => log(`  - ${f}`, 'yellow'));
  }

  if (results.bp.packsOnly.length > 0) {
    log('\n📁 Files chỉ có trong PACKS:', 'magenta');
    results.bp.packsOnly.forEach(f => log(`  - ${f}`, 'magenta'));
  }

  if (results.bp.different.length > 0) {
    log('\n⚠️  Files khác nhau:', 'red');
    results.bp.different.forEach(({ file, content1, content2, error }) => {
      log(`\n  📄 ${file}`, 'bright');
      
      if (error) {
        log(`    ❌ Error: ${error}`, 'red');
      } else if (path.extname(file) === '.json') {
        const diffs = analyzeJSONDiff(content1, content2);
        if (diffs.length > 0) {
          diffs.forEach(diff => {
            log(`    • ${diff.path}:`, 'cyan');
            if (diff.type === 'missing_in_build') {
              log(`      - Thiếu trong BUILD, có trong PACKS: ${JSON.stringify(diff.value)}`, 'red');
            } else if (diff.type === 'missing_in_packs') {
              log(`      - Có trong BUILD, thiếu trong PACKS: ${JSON.stringify(diff.value)}`, 'yellow');
            } else if (diff.type === 'value_diff') {
              log(`      - BUILD: ${JSON.stringify(diff.build)}`, 'yellow');
              log(`      - PACKS: ${JSON.stringify(diff.packs)}`, 'magenta');
            } else if (diff.type === 'array_diff') {
              log(`      - Array khác nhau`, 'red');
              log(`        BUILD: ${JSON.stringify(diff.build)}`, 'yellow');
              log(`        PACKS: ${JSON.stringify(diff.packs)}`, 'magenta');
            }
          });
        }
      }
    });
  }

  // RP Report
  subheader('RESOURCE PACK (RP)');
  
  if (results.rp.buildOnly.length > 0) {
    log('\n📦 Files chỉ có trong BUILD:', 'yellow');
    results.rp.buildOnly.forEach(f => log(`  - ${f}`, 'yellow'));
  }

  if (results.rp.packsOnly.length > 0) {
    log('\n📁 Files chỉ có trong PACKS:', 'magenta');
    results.rp.packsOnly.forEach(f => log(`  - ${f}`, 'magenta'));
  }

  if (results.rp.different.length > 0) {
    log('\n⚠️  Files khác nhau:', 'red');
    results.rp.different.forEach(({ file, content1, content2, error }) => {
      log(`\n  📄 ${file}`, 'bright');
      
      if (error) {
        log(`    ❌ Error: ${error}`, 'red');
      } else if (path.extname(file) === '.json') {
        const diffs = analyzeJSONDiff(content1, content2);
        if (diffs.length > 0) {
          diffs.forEach(diff => {
            log(`    • ${diff.path}:`, 'cyan');
            if (diff.type === 'missing_in_build') {
              log(`      - Thiếu trong BUILD, có trong PACKS: ${JSON.stringify(diff.value)}`, 'red');
            } else if (diff.type === 'missing_in_packs') {
              log(`      - Có trong BUILD, thiếu trong PACKS: ${JSON.stringify(diff.value)}`, 'yellow');
            } else if (diff.type === 'value_diff') {
              log(`      - BUILD: ${JSON.stringify(diff.build)}`, 'yellow');
              log(`      - PACKS: ${JSON.stringify(diff.packs)}`, 'magenta');
            } else if (diff.type === 'array_diff') {
              log(`      - Array khác nhau`, 'red');
            }
          });
        }
      }
    });
  }
}

/**
 * In tóm tắt
 */
function printSummary() {
  header('TỔNG KẾT KHẢO SÁT');

  log('\n📊 Thống kê tổng thể:', 'bright');
  log(`  • Tổng files: ${results.stats.totalFiles}`, 'cyan');
  log(`  • Files giống nhau: ${results.stats.identicalFiles} (${((results.stats.identicalFiles / results.stats.totalFiles) * 100).toFixed(1)}%)`, 'green');
  log(`  • Files khác nhau: ${results.stats.differentFiles} (${((results.stats.differentFiles / results.stats.totalFiles) * 100).toFixed(1)}%)`, 'red');
  log(`  • Files chỉ trong BUILD: ${results.stats.buildOnlyFiles}`, 'yellow');
  log(`  • Files chỉ trong PACKS: ${results.stats.packsOnlyFiles}`, 'magenta');

  log('\n📦 Behavior Pack:', 'bright');
  log(`  • Giống nhau: ${results.bp.identical.length}`, 'green');
  log(`  • Khác nhau: ${results.bp.different.length}`, 'red');
  log(`  • Chỉ trong BUILD: ${results.bp.buildOnly.length}`, 'yellow');
  log(`  • Chỉ trong PACKS: ${results.bp.packsOnly.length}`, 'magenta');

  log('\n🎨 Resource Pack:', 'bright');
  log(`  • Giống nhau: ${results.rp.identical.length}`, 'green');
  log(`  • Khác nhau: ${results.rp.different.length}`, 'red');
  log(`  • Chỉ trong BUILD: ${results.rp.buildOnly.length}`, 'yellow');
  log(`  • Chỉ trong PACKS: ${results.rp.packsOnly.length}`, 'magenta');

  // Đánh giá
  log('\n🎯 Đánh giá:', 'bright');
  const syncPercentage = (results.stats.identicalFiles / results.stats.totalFiles) * 100;
  
  if (syncPercentage >= 95) {
    log('  ✅ BUILD và PACKS đồng bộ tốt!', 'green');
  } else if (syncPercentage >= 80) {
    log('  ⚠️  BUILD và PACKS có một số khác biệt nhỏ', 'yellow');
  } else {
    log('  ❌ BUILD và PACKS có nhiều khác biệt, cần đồng bộ!', 'red');
  }

  if (results.bp.packsOnly.length > 0 || results.rp.packsOnly.length > 0) {
    log('  ⚠️  Có files trong PACKS không được generate từ CLI', 'yellow');
    log('     → Cần thêm vào configs hoặc xóa khỏi PACKS', 'yellow');
  }

  if (results.bp.buildOnly.length > 0 || results.rp.buildOnly.length > 0) {
    log('  📦 Có files mới trong BUILD chưa được deploy', 'cyan');
    log('     → Chạy regolith run để đồng bộ', 'cyan');
  }
}

/**
 * Lưu báo cáo ra file
 */
function saveReport() {
  const reportPath = path.join(__dirname, '../build/comparison-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  log(`\n💾 Báo cáo đã được lưu: ${reportPath}`, 'green');
}

/**
 * Main
 */
function main() {
  header('🔍 APEIRIX PACK COMPARISON TOOL');
  log('So sánh giữa addon-generator/build/ và packs/', 'cyan');

  // Kiểm tra thư mục tồn tại
  if (!fs.existsSync(BUILD_BP) || !fs.existsSync(BUILD_RP)) {
    log('\n❌ Thư mục build/ không tồn tại!', 'red');
    log('   Chạy: bun run dev compile configs/addon.yaml', 'yellow');
    process.exit(1);
  }

  if (!fs.existsSync(PACKS_BP) || !fs.existsSync(PACKS_RP)) {
    log('\n❌ Thư mục packs/ không tồn tại!', 'red');
    process.exit(1);
  }

  // So sánh BP
  comparePacks(BUILD_BP, PACKS_BP, 'bp');

  // So sánh RP
  comparePacks(BUILD_RP, PACKS_RP, 'rp');

  // In báo cáo
  printDetailedReport();
  printSummary();

  // Lưu báo cáo
  saveReport();

  log('\n✅ Khảo sát hoàn tất!', 'green');
}

// Run
main();
