import { FileManager } from '../core/FileManager.js';
import { join } from 'path';
import { Logger } from '../utils/Logger.js';

export interface TestFunctionConfig {
  id: string;
  displayName: string;
  commands?: string[]; // Custom commands từ YAML
}

/**
 * Test Function Generator - Tạo .mcfunction files để test items trong game
 * Commands được define trong YAML config, không hardcode
 */
export class TestFunctionGenerator {
  constructor(private projectRoot: string) {}

  /**
   * Tạo test function với custom commands từ config
   */
  generate(config: TestFunctionConfig, category: string): void {
    const commands: string[] = [];
    
    // Header comment
    commands.push(`# Test Function: ${config.displayName}`);
    commands.push(`# ID: apeirix:${config.id}`);
    commands.push('');
    
    // Nếu có custom commands từ YAML, dùng chúng
    if (config.commands && config.commands.length > 0) {
      // Filter out non-string commands (YAML parsing errors)
      const validCommands = config.commands.filter(cmd => {
        if (typeof cmd !== 'string') {
          Logger.warn(`Skipping non-string command in ${config.id}: ${JSON.stringify(cmd)}`);
          return false;
        }
        return true;
      });
      commands.push(...validCommands);
    } else {
      // Default fallback: chỉ give item
      commands.push('clear @s');
      commands.push(`give @s apeirix:${config.id} 64`);
      commands.push(`tellraw @s {"text":"Test: ${config.displayName}","color":"gold"}`);
      commands.push('playsound random.levelup @s');
    }
    
    const content = commands.join('\n');
    const outputPath = join(this.projectRoot, `functions/tests/${category}/${config.id}.mcfunction`);
    
    FileManager.writeText(outputPath, content);
    Logger.log(`✅ Đã tạo test function: BP/functions/tests/${category}/${config.id}.mcfunction`);
  }

  /**
   * Tạo master test function để chạy tất cả tests
   */
  generateMasterTest(testIds: string[], category: string): void {
    const commands: string[] = [];
    
    commands.push(`# Master Test Function - ${category}`);
    commands.push(`# Chạy tất cả ${testIds.length} tests`);
    commands.push('');
    
    commands.push(`tellraw @a {"text":"=== Running ${testIds.length} ${category} tests ===","color":"gold","bold":true}`);
    commands.push('');
    
    testIds.forEach((id, index) => {
      commands.push(`# Test ${index + 1}: ${id}`);
      commands.push(`function tests/${category}/${id}`);
      commands.push('');
    });
    
    commands.push(`tellraw @a {"text":"=== All ${category} tests completed ===","color":"green","bold":true}`);
    
    const content = commands.join('\n');
    const outputPath = join(this.projectRoot, `functions/tests/run_all_${category}.mcfunction`);
    
    FileManager.writeText(outputPath, content);
    Logger.log(`✅ Đã tạo master test: BP/functions/tests/run_all_${category}.mcfunction`);
  }

  /**
   * Tạo group test function - gộp tất cả test commands vào 1 file
   * Chỉ clear inventory 1 lần đầu tiên
   */
  generateGroupTest(
    entities: Array<{id: string, name: string, commands: string[]}>, 
    category: string
  ): void {
    const commands: string[] = [];
    
    // Header
    commands.push(`# Group Test Function - ${category}`);
    commands.push(`# Test tất cả ${entities.length} ${category} cùng lúc`);
    commands.push('');
    
    // Clear inventory chỉ 1 lần đầu
    commands.push('# Clear inventory once');
    commands.push('clear @s');
    commands.push('');
    
    // Thêm test commands của từng entity
    entities.forEach((entity, index) => {
      commands.push(`# Test ${index + 1}: ${entity.name}`);
      
      // Filter out "clear @s" commands từ entity test
      // ALSO filter out non-string commands (objects from YAML parsing errors)
      const filteredCommands = entity.commands.filter(cmd => {
        // Skip non-string commands (YAML parsing errors)
        if (typeof cmd !== 'string') {
          Logger.warn(`⚠️  Skipping non-string command in ${entity.id}: ${JSON.stringify(cmd)}`);
          return false;
        }
        const trimmed = cmd.trim().toLowerCase();
        return trimmed !== 'clear @s' && !trimmed.startsWith('clear @s');
      });
      
      commands.push(...filteredCommands);
      commands.push(''); // Spacing between tests
    });
    
    // Summary
    commands.push(`# Test completed`);
    commands.push(`tellraw @s {"text":"=== Đã test ${entities.length} ${category} ===","color":"green","bold":true}`);
    
    const content = commands.join('\n');
    const outputPath = join(this.projectRoot, `functions/tests/${category}_all.mcfunction`);
    
    FileManager.writeText(outputPath, content);
    Logger.log(`✅ Đã tạo group test: BP/functions/tests/${category}_all.mcfunction`);
  }
}
