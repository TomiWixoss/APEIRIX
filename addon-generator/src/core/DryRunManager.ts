/**
 * Dry Run Manager - Simulate operations without actually creating files
 */
export class DryRunManager {
  private static enabled = false;
  private static operations: string[] = [];

  static enable(): void {
    this.enabled = true;
    this.operations = [];
  }

  static disable(): void {
    this.enabled = false;
  }

  static isEnabled(): boolean {
    return this.enabled;
  }

  static log(operation: string): void {
    if (this.enabled) {
      this.operations.push(operation);
    }
  }

  static getOperations(): string[] {
    return [...this.operations];
  }

  static showSummary(): void {
    if (this.operations.length === 0) {
      console.log('\n🔍 Dry run: Không có thao tác nào\n');
      return;
    }

    console.log('\n🔍 Dry run - Các thao tác sẽ được thực hiện:\n');
    this.operations.forEach((op, index) => {
      console.log(`${index + 1}. ${op}`);
    });
    console.log(`\nTổng cộng: ${this.operations.length} thao tác\n`);
    console.log('💡 Chạy lại không có --dry-run để thực hiện thật\n');
  }

  static clear(): void {
    this.operations = [];
  }
}
