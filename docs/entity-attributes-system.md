# Entity Attributes System

## Overview

Entity Attributes System cho phép entities có dynamic attributes giống như items/blocks, với khả năng transfer attributes tự do giữa Item ↔ Entity ↔ Block.

## Architecture

### Storage Layer
- **EntityAttributeStorage** - Store/load attributes từ `entity.dynamicProperties`
- Per-instance storage (mỗi entity có attributes riêng)
- Format: `{ attrId: config, ... }`

### Resolution Layer
- **EntityAttributeResolver** - Resolve attributes từ entity
- Simple interface giống AttributeResolver cho items

### Transfer Layer
- **AttributeAPI** - Extended với entity transfer methods:
  - `transferAttributeToEntity(item, entity, attrId)` - Item/Block → Entity
  - `transferAttributeFromEntity(entity, item, attrId)` - Entity → Item/Block
  - `transferAttributeBetweenEntities(fromEntity, toEntity, attrId)` - Entity ↔ Entity

### Handler Layer
- **HungerInflictionHandler** - Example entity attribute
- Zombie với attribute `hunger_infliction` gây hunger effect khi đánh

## Key Features

### 1. Bidirectional Transfer
Attributes có thể transfer tự do:
- Item → Entity → Item
- Entity → Block → Entity
- Item → Entity → Block → Item

### 2. Attribute Preservation
Attributes hoạt động đúng ở bất kỳ container nào:
- Item attributes work on items
- Block attributes work on blocks  
- Entity attributes work on entities
- No special marking or prefix needed

### 3. Dynamic Lore
Lore được generate từ attributes, không phụ thuộc origin:
- Item với entity attribute → Show attribute lore
- Entity attribute transferred back → Still works

## Usage

### Add Attribute to Entity
```typescript
EntityAttributeStorage.setAttribute(entity, 'hunger_infliction', {
  duration: 100,
  amplifier: 0
});
```

### Transfer Item → Entity
```typescript
const success = AttributeAPI.transferAttributeToEntity(
  itemStack,
  entity,
  'undead_slayer'
);
```

### Transfer Entity → Item
```typescript
const success = AttributeAPI.transferAttributeFromEntity(
  entity,
  itemStack,
  'hunger_infliction'
);
```

### Transfer Entity ↔ Entity
```typescript
const success = AttributeAPI.transferAttributeBetweenEntities(
  fromEntity,
  toEntity,
  'hunger_infliction'
);
```

## Testing

### In-Game Commands
```
/scriptevent test:add_hunger_to_zombie
/scriptevent test:transfer_zombie_to_item
/scriptevent test:check_entity_attrs
```

### Test Flow
1. Add `hunger_infliction` attribute to zombie
2. Let zombie attack you → Should get hunger effect
3. Transfer attribute from zombie to item
4. Check item lore → Should show hunger infliction lore
5. Transfer back to entity → Should work again

## Example: Hunger Infliction

### Config
```yaml
# Entity with hunger_infliction attribute
attributes:
  - id: hunger_infliction
    config:
      duration: 100  # 5 seconds
      amplifier: 0   # Level 1
```

### Runtime Behavior
- Entity với attribute đánh target → Target bị hunger effect
- Duration và amplifier configurable
- Works on any entity type

### Lore (when transferred to item)
```
§cInflicts Hunger (5.0s)
```

## Implementation Notes

### No Origin Tracking
- Attributes không track origin (item/block/entity)
- Simply transfer và hoạt động based on current container
- Simpler architecture, easier to maintain

### Handler Registration
- Handlers register trong AttributeSystem
- Support both item và entity attributes
- Lore generation automatic

### Storage Format
```typescript
// Entity.dynamicProperties
{
  "apeirix:entity_attributes": {
    "hunger_infliction": {
      "duration": 100,
      "amplifier": 0
    }
  }
}
```

## Future Extensions

### Possible Enhancements
1. Entity-specific attributes (only work on entities)
2. Attribute conditions based on entity type
3. Attribute stacking/combining
4. Attribute evolution over time

### Config Support
Currently entity attributes are runtime-only. Future:
- Define entity attributes in YAML configs
- Auto-generate entity JSON with attributes
- Wiki integration for entity info
