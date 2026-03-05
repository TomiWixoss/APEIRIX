/**
 * Entity Display Provider - Xử lý hiển thị thông tin entities
 */

import { Entity } from '@minecraft/server';
import { IDisplayProvider, DisplayInfo } from './IDisplayProvider';
import { RawMessageFormatter } from '../formatters/RawMessageFormatter';
import { ColorFormatter } from '../formatters/ColorFormatter';
import { LangManager } from '../../../lang/LangManager';

export class EntityDisplayProvider implements IDisplayProvider {
  canHandle(target: any): boolean {
    return target && target.typeId !== undefined && target.id !== undefined;
  }

  getDisplayInfo(player: any, target: any): DisplayInfo | null {
    const entity = target as Entity;
    
    // Skip player's own entity
    if (entity.id === player.id) {
      return null;
    }

    try {
      const healthComponent = entity.getComponent('health');
      
      // Nếu có nameTag, dùng nameTag (custom name)
      if (entity.nameTag) {
        return this.getCustomNameDisplay(entity, healthComponent);
      } else {
        return this.getTranslatedNameDisplay(entity, healthComponent);
      }
    } catch (error) {
      // Fallback
      const entityName = entity.nameTag || this.formatEntityName(entity.typeId);
      return {
        message: RawMessageFormatter.createTextMessage(`§e${entityName}`),
        priority: 20
      };
    }
  }

  /**
   * Hiển thị với custom name (nameTag)
   */
  private getCustomNameDisplay(entity: Entity, healthComponent: any): DisplayInfo {
    if (healthComponent) {
      const currentHealth = Math.ceil(healthComponent.currentValue);
      const maxHealth = Math.ceil(healthComponent.effectiveMax);
      const healthLabel = LangManager.get('ui.display.entity.health');
      const text = `§e${entity.nameTag} §7| §c${healthLabel}: ${currentHealth}/${maxHealth}`;
      
      return {
        message: RawMessageFormatter.createTextMessage(text),
        priority: 20
      };
    } else {
      return {
        message: RawMessageFormatter.createTextMessage(`§e${entity.nameTag}`),
        priority: 20
      };
    }
  }

  /**
   * Hiển thị với translate key (tên tiếng Việt)
   */
  private getTranslatedNameDisplay(entity: Entity, healthComponent: any): DisplayInfo {
    // Entity translate key format: entity.{id}.name (bỏ namespace)
    const entityId = entity.typeId.includes(':') 
      ? entity.typeId.split(':')[1] 
      : entity.typeId;
    const translateKey = `entity.${entityId}.name`;
    
    if (healthComponent) {
      const currentHealth = Math.ceil(healthComponent.currentValue);
      const maxHealth = Math.ceil(healthComponent.effectiveMax);
      const healthLabel = LangManager.get('ui.display.entity.health');
      
      return {
        message: RawMessageFormatter.createTranslateMessage(
          translateKey,
          ColorFormatter.COLORS.YELLOW,
          ` §7| §c${healthLabel}: ${currentHealth}/${maxHealth}`
        ),
        priority: 20
      };
    } else {
      return {
        message: RawMessageFormatter.createTranslateMessage(
          translateKey,
          ColorFormatter.COLORS.YELLOW
        ),
        priority: 20
      };
    }
  }

  /**
   * Format entity type ID thành tên hiển thị (fallback)
   */
  private formatEntityName(entityTypeId: string): string {
    let name = entityTypeId.includes(':') ? entityTypeId.split(':')[1] : entityTypeId;
    name = name.replace(/_/g, ' ');
    name = name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return name;
  }
}
