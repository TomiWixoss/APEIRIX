# Entity Attributes - Complete Implementation Plan

## Current Status

### ✅ COMPLETED - Runtime Layer
1. **EntityAttributeStorage.ts** - Storage layer
2. **EntityAttributeResolver.ts** - Resolution layer  
3. **AttributeAPI.ts** - Transfer methods (bidirectional)
4. **HungerInflictionHandler.ts** - Example handler
5. **AttributeSystem.ts** - Handler initialization
6. **PlaceholderRegistry.ts** - Lore generation (no prefix)
7. **GameManager.ts** - Test initialization
8. **TestEntityAttributeTransfer.ts** - Test commands
9. **Lang files** - hunger_infliction translations
10. **zombie.yaml** - Config example

### ❌ TODO - Generator & Auto-Apply Layer

## Part 1: Generator Layer

### 1.1 Update GameDataGenerator.ts

**Location:** `addon-generator/src/generators/GameDataGenerator.ts`

**Changes needed:**

```typescript
// Add to generate() method parameters:
entities?: EntityAttributeData[]

// Add to generateContent() method:
/**
 * Generated entity attribute data
 * Used by EntitySystem to auto-apply attributes on spawn
 */
export const GENERATED_ENTITIES = [
${this.generateEntityData(entities || [])}
];

// Add new method:
private generateEntityData(entities: EntityAttributeData[]): string {
  if (entities.length === 0) {
    return '  // No entity attributes defined';
  }
  
  return entities.map(entity => {
    const attributesStr = entity.attributes
      .map(attr => `      { id: '${attr.id}', config: ${JSON.stringify(attr.config)} }`)
      .join(',\n');
    
    return `  {
    entityId: '${entity.entityId}',
    attributes: [
${attributesStr}
    ]
  }`;
  }).join(',\n');
}
```

**Type definition needed:**

```typescript
export interface EntityAttributeData {
  entityId: string;
  attributes: Array<{
    id: string;
    config: any;
  }>;
}
```

### 1.2 Update Compiler.ts

**Location:** `addon-generator/src/compiler/Compiler.ts`

**Changes needed:**

```typescript
// In compile() method, after loading other data:

// Load entity configs with attributes
const entityLoader = new EntityLoader(this.configPath);
const entityAttributeData = entityLoader.loadEntityAttributes();

// Pass to GameDataGenerator
gameDataGenerator.generate(
  toolData,
  foodData,
  oreData,
  wikiItems,
  hammerMining,
  brassSifter,
  allItems,
  edibleItems,
  blockInfoData,
  armorData,
  entityAttributeData  // NEW
);
```

### 1.3 Create EntityLoader.ts

**Location:** `addon-generator/src/core/loaders/EntityLoader.ts`

**Full implementation:**

```typescript
import { join } from 'path';
import { FileManager } from '../../utils/FileManager';
import { Logger } from '../../utils/Logger';
import * as yaml from 'js-yaml';

export interface EntityConfig {
  id: string;
  attributes?: Array<{
    id: string;
    config?: any;
  }>;
}

export interface EntityAttributeData {
  entityId: string;
  attributes: Array<{
    id: string;
    config: any;
  }>;
}

export class EntityLoader {
  private configPath: string;

  constructor(configPath: string) {
    this.configPath = configPath;
  }

  /**
   * Load entity attributes from configs
   * Scans both entities/ and entities/vanilla_overrides/
   */
  loadEntityAttributes(): EntityAttributeData[] {
    const result: EntityAttributeData[] = [];
    
    // Load from entities/ folder
    const entitiesPath = join(this.configPath, 'entities');
    if (FileManager.exists(entitiesPath)) {
      const entities = this.loadFromDirectory(entitiesPath);
      result.push(...entities);
    }
    
    // Load from entities/vanilla_overrides/ folder
    const vanillaOverridesPath = join(entitiesPath, 'vanilla_overrides');
    if (FileManager.exists(vanillaOverridesPath)) {
      const vanillaEntities = this.loadFromDirectory(vanillaOverridesPath);
      result.push(...vanillaEntities);
    }
    
    Logger.log(`📦 Loaded ${result.length} entities with attributes`);
    return result;
  }

  private loadFromDirectory(dirPath: string): EntityAttributeData[] {
    const result: EntityAttributeData[] = [];
    
    try {
      const files = FileManager.listFiles(dirPath);
      
      for (const file of files) {
        if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
        
        const filePath = join(dirPath, file);
        const content = FileManager.readText(filePath);
        const config = yaml.load(content) as EntityConfig;
        
        // Only include entities with attributes
        if (config.attributes && config.attributes.length > 0) {
          result.push({
            entityId: config.id,
            attributes: config.attributes.map(attr => ({
              id: attr.id,
              config: attr.config || {}
            }))
          });
          
          Logger.log(`  ✓ ${config.id}: ${config.attributes.length} attributes`);
        }
      }
    } catch (error) {
      Logger.warn(`⚠️  Failed to load entities from ${dirPath}: ${error}`);
    }
    
    return result;
  }
}
```

## Part 2: Runtime Auto-Apply System

### 2.1 Create EntitySystem.ts

**Location:** `scripts/systems/entities/EntitySystem.ts`

**Full implementation:**

```typescript
/**
 * EntitySystem - Auto-apply attributes to entities on spawn
 * 
 * Loads entity attribute configs from GENERATED_ENTITIES and applies them
 * when entities spawn in the world.
 */

import { world, system, Entity } from '@minecraft/server';
import { GENERATED_ENTITIES } from '../../data/GeneratedGameData';
import { EntityAttributeStorage } from '../attributes/EntityAttributeStorage';

interface EntityAttributeConfig {
  entityId: string;
  attributes: Array<{
    id: string;
    config: any;
  }>;
}

export class EntitySystem {
  private static initialized = false;
  private static entityConfigs = new Map<string, EntityAttributeConfig>();
  private static processedEntities = new WeakSet<Entity>();

  static initialize(): void {
    if (this.initialized) {
      console.warn('[EntitySystem] Already initialized, skipping...');
      return;
    }

    console.warn('[EntitySystem] Initializing...');
    
    // Load entity configs
    this.loadEntityConfigs();
    
    // Subscribe to entity spawn events
    this.subscribeToSpawnEvents();
    
    // Also check existing entities (for world load)
    this.checkExistingEntities();
    
    this.initialized = true;
    console.warn('[EntitySystem] Initialized');
  }

  private static loadEntityConfigs(): void {
    for (const entityData of GENERATED_ENTITIES) {
      this.entityConfigs.set(entityData.entityId, entityData);
    }
    
    console.warn(`[EntitySystem] Loaded ${this.entityConfigs.size} entity configs`);
  }

  private static subscribeToSpawnEvents(): void {
    // Listen to entity spawn events
    world.afterEvents.entitySpawn.subscribe((event) => {
      try {
        const { entity } = event;
        
        // Skip if already processed
        if (this.processedEntities.has(entity)) return;
        
        // Apply attributes if config exists
        this.applyAttributesToEntity(entity);
        
        // Mark as processed
        this.processedEntities.add(entity);
      } catch (error) {
        console.warn('[EntitySystem] Error in spawn handler:', error);
      }
    });
  }

  private static checkExistingEntities(): void {
    // Delay to ensure world is fully loaded
    system.runTimeout(() => {
      try {
        for (const dimName of ['overworld', 'nether', 'the_end']) {
          const dimension = world.getDimension(dimName);
          const entities = dimension.getEntities();
          
          for (const entity of entities) {
            if (this.processedEntities.has(entity)) continue;
            
            this.applyAttributesToEntity(entity);
            this.processedEntities.add(entity);
          }
        }
      } catch (error) {
        console.warn('[EntitySystem] Error checking existing entities:', error);
      }
    }, 20); // 1 second delay
  }

  private static applyAttributesToEntity(entity: Entity): void {
    const config = this.entityConfigs.get(entity.typeId);
    if (!config) return;
    
    // Check if entity already has attributes (from previous spawn or transfer)
    const existingAttrs = EntityAttributeStorage.load(entity);
    const hasExisting = Object.keys(existingAttrs).length > 0;
    
    if (hasExisting) {
      // Entity already has attributes, don't override
      console.warn(`[EntitySystem] ${entity.typeId} already has attributes, skipping auto-apply`);
      return;
    }
    
    // Apply each attribute from config
    for (const attr of config.attributes) {
      EntityAttributeStorage.setAttribute(entity, attr.id, attr.config);
    }
    
    console.warn(`[EntitySystem] Applied ${config.attributes.length} attributes to ${entity.typeId}`);
  }

  /**
   * Manually apply attributes to an entity (for testing)
   */
  static applyAttributes(entity: Entity): boolean {
    try {
      this.applyAttributesToEntity(entity);
      this.processedEntities.add(entity);
      return true;
    } catch (error) {
      console.warn('[EntitySystem] Failed to apply attributes:', error);
      return false;
    }
  }
}
```

### 2.2 Update GameManager.ts

**Location:** `scripts/core/GameManager.ts`

**Changes needed:**

```typescript
// Add import
import { EntitySystem } from '../systems/entities/EntitySystem';

// In initializeSystems() method, add:
EntitySystem.initialize();
```

### 2.3 Update GeneratedGameData.ts (manual for now)

**Location:** `scripts/data/GeneratedGameData.ts`

**Add at end of file:**

```typescript
/**
 * Generated entity attribute data
 * Used by EntitySystem to auto-apply attributes on spawn
 */
export const GENERATED_ENTITIES = [
  {
    entityId: 'minecraft:zombie',
    attributes: [
      { id: 'hunger_infliction', config: { duration: 100, amplifier: 0 } }
    ]
  }
];
```

## Part 3: Testing & Verification

### 3.1 Test Flow

1. **Compile configs:**
   ```bash
   cd addon-generator
   bun run dev compile configs/addon.yaml --clean
   ```

2. **Build & deploy:**
   ```bash
   .\build-and-deploy.ps1
   ```

3. **In-game testing:**
   ```
   /reload
   
   # Test auto-apply
   /summon zombie ~~2~
   # Zombie should have hunger_infliction attribute
   # Let it attack you → Should get hunger effect
   
   # Test transfer
   /scriptevent test:transfer_zombie_to_item
   # Item should show hunger infliction lore
   
   # Test transfer back
   /scriptevent test:transfer_item_to_zombie
   # Zombie should work again
   ```

### 3.2 Verification Checklist

- [ ] GENERATED_ENTITIES generated correctly
- [ ] EntitySystem initializes without errors
- [ ] Zombie spawns with hunger_infliction attribute
- [ ] Zombie attack causes hunger effect
- [ ] Attribute transfers to item correctly
- [ ] Item shows hunger lore
- [ ] Attribute transfers back to entity
- [ ] Entity attribute works after transfer back

## Part 4: Additional Entities

### 4.1 Add More Entity Configs

**Example: Skeleton with slowness**

`configs/entities/vanilla_overrides/skeleton.yaml`:
```yaml
id: minecraft:skeleton
attributes:
  - id: slowness_infliction
    config:
      duration: 60
      amplifier: 0
```

**Need to create SlownessInflictionHandler.ts** (copy HungerInflictionHandler pattern)

### 4.2 Custom Entities

**Example: Custom mob**

`configs/entities/custom_mob.yaml`:
```yaml
id: apeirix:custom_mob
name: lang:entities.custom_mob
# ... other entity config ...
attributes:
  - id: fire_resistance
    config:
      duration: 200
      amplifier: 1
```

## Part 5: Future Enhancements

### 5.1 Entity Lore Display

Currently entities don't have visible lore. Future options:
- Name tag display with attributes
- Particle effects based on attributes
- Wiki integration (view entity info with wiki book)

### 5.2 Conditional Attributes

Add conditions to entity attributes:
```yaml
attributes:
  - id: hunger_infliction
    config:
      duration: 100
      amplifier: 0
    conditions:
      - type: time
        value: night
      - type: biome
        value: desert
```

### 5.3 Attribute Evolution

Entities gain/lose attributes over time:
```yaml
attributes:
  - id: strength_boost
    config:
      amplifier: 0
    evolution:
      tickInterval: 1200  # Every minute
      maxLevel: 3
```

## Implementation Priority

1. **HIGH PRIORITY** (Core functionality):
   - EntityLoader.ts
   - Update GameDataGenerator.ts
   - EntitySystem.ts
   - Update Compiler.ts
   - Update GameManager.ts

2. **MEDIUM PRIORITY** (Testing):
   - Manual GENERATED_ENTITIES update
   - In-game testing
   - Bug fixes

3. **LOW PRIORITY** (Polish):
   - Additional entity configs
   - More attribute handlers
   - Documentation updates

## Notes for Next AI

- All runtime code is complete and working
- Only need generator layer (config → GENERATED_ENTITIES)
- EntitySystem is straightforward - just apply attributes on spawn
- Test with zombie first, then expand to other entities
- Follow existing patterns (ToolLoader, FoodLoader, etc.)
- Don't overthink it - keep it simple!

## Files to Modify

1. `addon-generator/src/core/loaders/EntityLoader.ts` - CREATE
2. `addon-generator/src/generators/GameDataGenerator.ts` - MODIFY
3. `addon-generator/src/compiler/Compiler.ts` - MODIFY
4. `scripts/systems/entities/EntitySystem.ts` - CREATE
5. `scripts/core/GameManager.ts` - MODIFY
6. `scripts/data/GeneratedGameData.ts` - WILL BE AUTO-GENERATED

## Success Criteria

✅ Zombie spawns with hunger_infliction attribute automatically
✅ Zombie attack causes hunger effect
✅ Attributes can transfer Item ↔ Entity ↔ Block freely
✅ Lore displays correctly on items
✅ System works after /reload
✅ No performance issues with many entities
