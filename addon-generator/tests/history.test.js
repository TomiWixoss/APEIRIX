import { describe, test, before, after } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { setupTestProject, cleanupTestProject, TEST_PROJECT_ROOT } from './setup.js';

describe('History & Undo', () => {
  before(async () => {
    await setupTestProject();
  });

  after(() => {
    cleanupTestProject();
  });

  test('should track history and undo', () => {
    const texturePath = join(TEST_PROJECT_ROOT, 'undo_test.png');
    writeFileSync(texturePath, Buffer.from('fake png'));

    // Tạo item
    execSync(
      `bun run src/index.ts item -i undo_test -n "Undo Test" -t ${texturePath} -p ${TEST_PROJECT_ROOT}`,
      { cwd: process.cwd() }
    );

    const itemPath = join(TEST_PROJECT_ROOT, 'packs/BP/items/undo_test.json');
    assert.ok(existsSync(itemPath), 'Item should exist before undo');

    // Verify history file
    const historyPath = join(TEST_PROJECT_ROOT, '.addon-generator-history.json');
    assert.ok(existsSync(historyPath), 'History file should exist');

    // Undo
    execSync(
      `bun run src/index.ts undo -p ${TEST_PROJECT_ROOT}`,
      { cwd: process.cwd() }
    );

    // Verify item đã bị xóa
    assert.ok(!existsSync(itemPath), 'Item should be removed after undo');
  });

  test('should show history', () => {
    const output = execSync(
      `bun run src/index.ts history -p ${TEST_PROJECT_ROOT}`,
      { cwd: process.cwd(), encoding: 'utf-8' }
    );

    assert.ok(output.includes('Lịch sử') || output.includes('Chưa có lịch sử'), 'Should show history message');
  });
});
