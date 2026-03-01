# Global Block Attributes System

## Overview

Hệ thống cho phép transfer attributes từ items sang block types và giữa các block types. Attributes áp dụng GLOBAL cho tất cả blocks cùng type trong world, không phải per-location.

## Architecture

### Components

1. **GlobalBlockAttributeRegistry** - Global registry lưu attributes cho block types
   - Persist to `world.dynamicProperty('apeirix:block_attributes')`
   - Data structure: `{ [blockId]: { [attrId]: config } }`
   - Initialize trong `AttributeSystem.initialize()`

2. **RequiresToolHandler** (Modified) - Check dynamic + static attributes
   - Priority: Dynamic (GlobalBlockAttributeRegistry) > Static (YAML)
   - Không cần item trong inventory để check

3. **AttributeAPI** (Extended) - Transfer methods
   - `transferAttributeToBlockType()` - Item → Block type
   - `transferAttributeBetweenBlockTypes()` - Block type → Block type

## Usage

### Transfer Attribute từ Item sang Block Type

```typescript
import { AttributeAPI } from './systems/attributes/AttributeAPI';

// Example: Transfer requires_tool từ log item sang dirt block type
const logItem = player.getComponent('inventory').container.getItem(0);
const success = AttributeAPI.transferAttributeToBlockType(
  logItem,
  'requires_tool',
  'minecraft:dirt'
);

// Giờ TẤT CẢ dirt blocks trong world cần axe để đào
```

### Transfer Attribute giữa Block Types

```typescript
import { AttributeAPI } from './systems/attributes/AttributeAPI';

// Transfer requires_tool từ dirt sang stone
const success = AttributeAPI.transferAttributeBetweenBlockTypes(
  'minecraft:dirt',
  'minecraft:stone',
  'requires_tool'
);

// Dirt không cần tool nữa, stone giờ cần tool
```

### Transfer Attribute từ Block Type sang Item (Remove from Block)

```typescript
import { AttributeAPI } from './systems/attributes/AttributeAPI';

// Remove attribute từ block type bằng cách transfer sang item
// Item chỉ là "container" để chứa attribute đã loại bỏ
const dirtHadAttribute = GlobalBlockAttributeRegistry.hasBlockAttribute('minecraft:dirt', 'requires_tool');
if (dirtHadAttribute) {
  const containerItem = player.getComponent('inventory').container.getItem(0);
  AttributeAPI.transferAttributeFromBlockType('minecraft:dirt', containerItem, 'requires_tool');
  
  // Dirt không cần tool nữa
  // Item có attribute trong lore (nhưng không có runtime effect)
}
```

### Check Block Attributes

```typescript
import { GlobalBlockAttributeRegistry } from './systems/attributes/GlobalBlockAttributeRegistry';

// Check if block type has attribute
const hasTool = GlobalBlockAttributeRegistry.hasBlockAttribute('minecraft:dirt', 'requires_tool');

// Get attribute config
const config = GlobalBlockAttributeRegistry.getBlockAttribute('minecraft:dirt', 'requires_tool');
// Returns: { toolType: 'axe' }

// Get all attributes for block type
const attrs = GlobalBlockAttributeRegistry.getBlockAttributes('minecraft:dirt');
// Returns: ['requires_tool', ...]
```

## How It Works

### 1. Static Attributes (YAML)

```yaml
# configs/special/vanilla_overrides/mangrove_log.yaml
id: minecraft:mangrove_log
attributes:
  requires_tool:
    toolType: axe
```

→ Compiled to `GeneratedAttributes.ts`

### 2. Dynamic Attributes (Runtime)

```typescript
// Add attribute to block type
GlobalBlockAttributeRegistry.addBlockAttribute(
  'minecraft:dirt',
  'requires_tool',
  { toolType: 'axe' }
);

// Persisted to world.dynamicProperty
```

### 3. Attribute Resolution

RequiresToolHandler checks:
1. **Dynamic first**: `GlobalBlockAttributeRegistry.hasBlockAttribute(blockId, attrId)`
2. **Static fallback**: `hasAttribute(blockId, attrId)` from YAML

Priority: Dynamic > Static

## Example Workflow

### Use Case: Transfer Log Attribute to Dirt

1. **Initial State**:
   - Log blocks: `requires_tool: axe` (static from YAML)
   - Dirt blocks: No attributes

2. **Transfer**:
   ```typescript
   const logItem = getLogItem();
   AttributeAPI.transferAttributeToBlockType(logItem, 'requires_tool', 'minecraft:dirt');
   ```

3. **Result**:
   - Log item: `requires_tool` removed (dynamic disabled)
   - Dirt blocks: `requires_tool: axe` added (dynamic)
   - ALL dirt blocks in world now require axe to mine

4. **Persistence**:
   - Saved to `world.dynamicProperty('apeirix:block_attributes')`
   - Survives world reload

## API Reference

### GlobalBlockAttributeRegistry

```typescript
class GlobalBlockAttributeRegistry {
  // Initialize (called in AttributeSystem.initialize())
  static initialize(): void;
  
  // Add attribute to block type
  static addBlockAttribute(blockId: string, attrId: string, config: any): boolean;
  
  // Remove attribute from block type
  static removeBlockAttribute(blockId: string, attrId: string): boolean;
  
  // Get attribute config
  static getBlockAttribute(blockId: string, attrId: string): any | undefined;
  
  // Check if block type has attribute
  static hasBlockAttribute(blockId: string, attrId: string): boolean;
  
  // Get all attributes for block type
  static getBlockAttributes(blockId: string): string[];
  
  // Get all block attributes (debugging)
  static getAllBlockAttributes(): BlockAttributeData;
  
  // Clear all (testing/reset)
  static clearAll(): void;
}
```

### AttributeAPI (Extended)

```typescript
class AttributeAPI {
  // ... existing methods ...
  
  // Transfer attribute from item to block type
  static transferAttributeToBlockType(
    itemStack: ItemStack,
    attrId: string,
    targetBlockId: string
  ): boolean;
  
  // Transfer attribute between block types
  static transferAttributeBetweenBlockTypes(
    fromBlockId: string,
    toBlockId: string,
    attrId: string
  ): boolean;
  
  // Transfer attribute from block type to item (remove from block)
  static transferAttributeFromBlockType(
    sourceBlockId: string,
    targetStack: ItemStack,
    attrId: string
  ): boolean;
}
```

## Implementation Details

### Storage Format

```json
{
  "minecraft:dirt": {
    "requires_tool": { "toolType": "axe" }
  },
  "minecraft:stone": {
    "requires_tool": { "toolType": "pickaxe" },
    "breakable": { "context": "mining", "value": 50 }
  }
}
```

Stored in: `world.dynamicProperty('apeirix:block_attributes')`

### Handler Integration

Handlers that check block attributes should follow this pattern:

```typescript
// Check dynamic first, fallback to static
let config: any;
let hasAttr = false;

if (GlobalBlockAttributeRegistry.hasBlockAttribute(blockId, attrId)) {
  config = GlobalBlockAttributeRegistry.getBlockAttribute(blockId, attrId);
  hasAttr = true;
} else if (hasAttribute(blockId, attrId)) {
  config = getAttributeConfig(blockId, attrId);
  hasAttr = true;
}

if (!hasAttr || !config) return;
// ... use config
```

## Limitations

1. **Block Type Only**: Attributes apply to ALL blocks of that type, không phải per-location
2. **No Lore**: Block attributes không có lore (blocks không có lore system)
3. **Dynamic Only Transfer**: Chỉ transfer được dynamic attributes giữa block types (không transfer static)
4. **World Storage Limit**: Minecraft có giới hạn kích thước dynamicProperty (~32KB per key)

## Future Enhancements

1. **Per-Location Attributes**: Nếu cần attributes cho specific block locations (phức tạp hơn nhiều)
2. **Attribute Decay**: Attributes tự động expire sau thời gian
3. **Attribute Stacking**: Multiple configs cho cùng attribute
4. **Block Lore System**: Display attributes khi nhìn vào block

## Testing

### Manual Test

1. Get log item with `requires_tool: axe`
2. Transfer to dirt: `AttributeAPI.transferAttributeToBlockType(logItem, 'requires_tool', 'minecraft:dirt')`
3. Try mining dirt without axe → Should be blocked
4. Try mining log without axe → Should work (attribute removed)
5. Reload world → Dirt still requires axe (persisted)

### Debug Commands

```typescript
// Check registry state
const allAttrs = GlobalBlockAttributeRegistry.getAllBlockAttributes();
console.warn(JSON.stringify(allAttrs, null, 2));

// Clear all (reset)
GlobalBlockAttributeRegistry.clearAll();
```

## Related Systems

- **Dynamic Attributes System** (`docs/dynamic-attributes-system.md`) - Item-level dynamic attributes
- **Attribute System** (`scripts/systems/attributes/`) - Core attribute architecture
- **RequiresToolHandler** - Example handler using block attributes
