/**
 * Storage Display Registry - Registry for custom display handlers
 * 
 * Allows machine systems to register custom display logic for blocks with storage
 * Pattern: Registry + Callback
 */

import { Block } from '@minecraft/server';

export type StorageDisplayHandler = (block: Block, machineName: string) => string | null;

export class StorageDisplayRegistry {
  private static handlers: Map<string, StorageDisplayHandler> = new Map();
  
  /**
   * Register a custom display handler for a block type
   * 
   * @param blockId Full block ID (e.g., 'apeirix:levitator')
   * @param handler Function that returns display string or null
   */
  static register(blockId: string, handler: StorageDisplayHandler): void {
    this.handlers.set(blockId, handler);
  }
  
  /**
   * Get custom display for a block (if registered)
   * 
   * @param block Block to get display for
   * @param machineName Display name of the machine
   * @returns Display string or null if no custom handler
   */
  static getCustomDisplay(block: Block, machineName: string): string | null {
    const handler = this.handlers.get(block.typeId);
    if (!handler) return null;
    
    try {
      return handler(block, machineName);
    } catch (error) {
      console.warn(`[StorageDisplayRegistry] Error in handler for ${block.typeId}:`, error);
      return null;
    }
  }
  
  /**
   * Check if block has custom display handler
   */
  static hasCustomDisplay(blockId: string): boolean {
    return this.handlers.has(blockId);
  }
}
