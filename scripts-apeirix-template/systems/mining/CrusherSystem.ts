/**
 * Crusher System - Nghiền quặng thành bụi
 * Hỗ trợ: Player interaction + Hopper automation
 * 
 * REFACTORED: Extends BaseMachineSystem for DRY code
 */

import { BaseMachineSystem } from '../shared/processing/BaseMachineSystem';

export class CrusherSystem extends BaseMachineSystem {
  protected readonly MACHINE_TYPE = 'crusher';
  protected readonly MACHINE_OFF = 'apeirix:crusher';
  protected readonly MACHINE_ON = 'apeirix:crusher_on';
  
  // Use default values from base class:
  // - INPUT_AMOUNT = 1
  // - PROCESSING_INTERVAL = 5
  // - HOPPER_CHECK_INTERVAL = 20
  
  static initialize(): void {
    const instance = new CrusherSystem();
    instance.initialize();
  }
}
