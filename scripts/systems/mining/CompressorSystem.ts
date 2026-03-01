/**
 * Compressor System - Nén vật phẩm thành plate
 * Hỗ trợ: Player interaction + Hopper automation
 * 
 * REFACTORED: Extends BaseMachineSystem for DRY code
 */

import { BaseMachineSystem } from '../shared/processing/BaseMachineSystem';

export class CompressorSystem extends BaseMachineSystem {
  protected readonly MACHINE_TYPE = 'compressor';
  protected readonly MACHINE_OFF = 'apeirix:compressor';
  protected readonly MACHINE_ON = 'apeirix:compressor_on';
  
  // Use default values from base class:
  // - INPUT_AMOUNT = 1
  // - PROCESSING_INTERVAL = 5
  // - HOPPER_CHECK_INTERVAL = 20
  
  static initialize(): void {
    const instance = new CompressorSystem();
    instance.initialize();
  }
}
