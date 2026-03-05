/**
 * Interface cho Display Providers
 * Mỗi provider xử lý 1 loại target (block, entity, container, etc.)
 */

import { RawMessage } from '@minecraft/server';

export interface DisplayInfo {
  message: RawMessage | string;
  priority: number; // Higher = ưu tiên hiển thị trước
}

export interface IDisplayProvider {
  /**
   * Check xem provider này có xử lý được target không
   */
  canHandle(target: any): boolean;

  /**
   * Lấy thông tin hiển thị cho target
   */
  getDisplayInfo(player: any, target: any): DisplayInfo | null;
}
