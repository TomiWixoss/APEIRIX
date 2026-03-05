/**
 * RawMessage Formatter - Build RawMessage objects
 */

import { RawMessage } from '@minecraft/server';

export class RawMessageFormatter {
  /**
   * Tạo RawMessage từ translate key + optional text
   */
  static createTranslateMessage(
    translateKey: string,
    prefix?: string,
    suffix?: string
  ): RawMessage {
    const parts: any[] = [];
    
    if (prefix) {
      parts.push({ text: prefix });
    }
    
    parts.push({ translate: translateKey });
    
    if (suffix) {
      parts.push({ text: suffix });
    }
    
    return { rawtext: parts };
  }

  /**
   * Tạo RawMessage từ text thuần
   */
  static createTextMessage(text: string): RawMessage {
    return { rawtext: [{ text }] };
  }

  /**
   * Combine nhiều parts thành RawMessage
   */
  static combine(...parts: Array<{ text?: string; translate?: string }>): RawMessage {
    return { rawtext: parts };
  }
}
