import { FileManager } from './FileManager.js';
import { join } from 'path';
import { existsSync } from 'fs';

export interface HistoryEntry {
  timestamp: string;
  command: string;
  files: {
    created: string[];
    modified: string[];
  };
  backups: Record<string, string>; // path -> backup content
}

/**
 * History Manager - Quản lý lịch sử thay đổi và hỗ trợ undo/rollback
 */
export class HistoryManager {
  private historyFile: string;
  private currentEntry: HistoryEntry | null = null;

  constructor(private projectRoot: string) {
    this.historyFile = join(projectRoot, '.addon-generator-history.json');
  }

  /**
   * Bắt đầu tracking một operation mới
   */
  startOperation(command: string): void {
    this.currentEntry = {
      timestamp: new Date().toISOString(),
      command: command,
      files: {
        created: [],
        modified: []
      },
      backups: {}
    };
  }

  /**
   * Track file sẽ được tạo
   */
  trackCreate(filePath: string): void {
    if (!this.currentEntry) return;
    this.currentEntry.files.created.push(filePath);
  }

  /**
   * Track file sẽ được modify (backup nội dung cũ)
   */
  trackModify(filePath: string): void {
    if (!this.currentEntry) return;
    
    // Chỉ backup lần đầu tiên, không backup lại nếu đã có
    if (this.currentEntry.backups[filePath]) {
      return;
    }
    
    const fullPath = join(this.projectRoot, filePath);
    if (existsSync(fullPath)) {
      const content = FileManager.readText(fullPath);
      if (content) {
        this.currentEntry.backups[filePath] = content;
        this.currentEntry.files.modified.push(filePath);
      }
    }
  }

  /**
   * Kết thúc operation và lưu vào history
   */
  commitOperation(): void {
    if (!this.currentEntry) return;

    const history = this.loadHistory();
    history.push(this.currentEntry);

    // Giữ tối đa 50 entries
    if (history.length > 50) {
      history.shift();
    }

    FileManager.writeJSON(this.historyFile, history);
    this.currentEntry = null;
  }

  /**
   * Hủy operation hiện tại
   */
  cancelOperation(): void {
    this.currentEntry = null;
  }

  /**
   * Undo operation cuối cùng
   */
  undo(): boolean {
    const history = this.loadHistory();
    if (history.length === 0) {
      console.log('⚠️  Không có operation nào để undo');
      return false;
    }

    const lastEntry = history.pop()!;
    
    console.log(`\n🔄 Đang undo: ${lastEntry.command}`);
    console.log(`   Timestamp: ${lastEntry.timestamp}\n`);

    // Xóa các file đã tạo
    for (const filePath of lastEntry.files.created) {
      const fullPath = join(this.projectRoot, filePath);
      if (existsSync(fullPath)) {
        FileManager.deleteFile(fullPath);
        console.log(`   ❌ Đã xóa: ${filePath}`);
      }
    }

    // Restore các file đã modify
    for (const filePath of lastEntry.files.modified) {
      const backup = lastEntry.backups[filePath];
      if (backup) {
        FileManager.writeText(join(this.projectRoot, filePath), backup);
        console.log(`   ↩️  Đã restore: ${filePath}`);
      }
    }

    // Lưu history mới
    FileManager.writeJSON(this.historyFile, history);
    
    console.log(`\n✅ Đã undo thành công!\n`);
    return true;
  }

  /**
   * Xem lịch sử
   */
  showHistory(limit: number = 10): void {
    const history = this.loadHistory();
    
    if (history.length === 0) {
      console.log('📜 Chưa có lịch sử nào');
      return;
    }

    console.log(`\n📜 Lịch sử (${Math.min(limit, history.length)} gần nhất):\n`);
    
    const entries = history.slice(-limit).reverse();
    entries.forEach((entry, index) => {
      const date = new Date(entry.timestamp);
      console.log(`${index + 1}. ${entry.command}`);
      console.log(`   Thời gian: ${date.toLocaleString()}`);
      console.log(`   Tạo mới: ${entry.files.created.length} file(s)`);
      console.log(`   Chỉnh sửa: ${entry.files.modified.length} file(s)`);
      console.log('');
    });
  }

  /**
   * Xóa toàn bộ history
   */
  clearHistory(): void {
    FileManager.writeJSON(this.historyFile, []);
    console.log('✅ Đã xóa toàn bộ lịch sử');
  }

  private loadHistory(): HistoryEntry[] {
    const data = FileManager.readJSON<HistoryEntry[]>(this.historyFile);
    return data || [];
  }
}
