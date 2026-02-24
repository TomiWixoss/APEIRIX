import { FileManager } from '../core/FileManager.js';
import { join } from 'path';

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
      commands.push(...config.commands);
    } else {
      // Default fallback: chỉ give item
      commands.push('clear @s');
      commands.push(`give @s apeirix:${config.id} 64`);
      commands.push(`tellraw @s {"text":"Test: ${config.displayName}","color":"gold"}`);
      commands.push('playsound random.levelup @s');
    }
    
    const content = commands.join('\n');
    const outputPath = join(this.projectRoot, `BP/functions/tests/${category}/${config.id}.mcfunction`);
    
    FileManager.writeText(outputPath, content);
    console.log(`✅ Đã tạo test function: BP/functions/tests/${category}/${config.id}.mcfunction`);
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
    const outputPath = join(this.projectRoot, `BP/functions/tests/run_all_${category}.mcfunction`);
    
    FileManager.writeText(outputPath, content);
    console.log(`✅ Đã tạo master test: BP/functions/tests/run_all_${category}.mcfunction`);
  }
}
