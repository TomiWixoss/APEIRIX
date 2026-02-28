/**
 * Logger utility for controlling output verbosity
 */
export class Logger {
  private static verbose: boolean = false;
  private static warnings: string[] = [];
  private static errors: string[] = [];
  private static fileCount: number = 0;

  static setVerbose(verbose: boolean): void {
    this.verbose = verbose;
  }

  static isVerbose(): boolean {
    return this.verbose;
  }

  static reset(): void {
    this.warnings = [];
    this.errors = [];
    this.fileCount = 0;
  }

  static addWarning(message: string): void {
    this.warnings.push(message);
  }

  static addError(message: string): void {
    this.errors.push(message);
  }

  static incrementFileCount(count: number = 1): void {
    this.fileCount += count;
  }

  static getFileCount(): number {
    return this.fileCount;
  }

  static hasIssues(): boolean {
    return this.warnings.length > 0 || this.errors.length > 0;
  }

  static getWarnings(): string[] {
    return this.warnings;
  }

  static getErrors(): string[] {
    return this.errors;
  }

  /**
   * Log message only in verbose mode
   */
  static log(message: string): void {
    if (this.verbose) {
      console.log(message);
    }
  }

  /**
   * Always log (for important messages)
   */
  static info(message: string): void {
    console.log(message);
  }

  /**
   * Log warning (always shown)
   */
  static warn(message: string): void {
    console.warn(`⚠️  ${message}`);
    this.addWarning(message);
  }

  /**
   * Log error (always shown)
   */
  static error(message: string): void {
    console.error(`❌ ${message}`);
    this.addError(message);
  }

  /**
   * Print final summary
   */
  static printSummary(duration: number): void {
    if (this.hasIssues()) {
      // Show detailed output if there are issues
      console.log('\n' + '='.repeat(50));
      
      if (this.errors.length > 0) {
        console.log('❌ Compilation completed with errors:');
        this.errors.forEach(err => console.log(`   - ${err}`));
      } else {
        console.log('⚠️  Compilation completed with warnings:');
      }
      
      if (this.warnings.length > 0) {
        console.log('\nWarnings:');
        this.warnings.forEach(warn => console.log(`   - ${warn}`));
      }
      
      console.log('='.repeat(50));
      console.log(`\n📊 Files generated: ${this.fileCount}`);
      console.log(`⏱️  Build time: ${duration}s\n`);
    } else if (this.verbose) {
      // Verbose mode: show full summary
      console.log('\n' + '='.repeat(50));
      console.log('✅ Compilation completed successfully!');
      console.log('='.repeat(50));
      console.log(`\n📊 Files generated: ${this.fileCount}`);
      console.log(`⏱️  Build time: ${duration}s`);
      console.log('\n📋 Next steps:');
      console.log('   1. Run: regolith run');
      console.log('   2. Test in game with /reload\n');
    } else {
      // Quiet mode: single line summary
      console.log(`✓ Compiled successfully (${this.fileCount} files, ${duration}s)`);
    }
  }
}
