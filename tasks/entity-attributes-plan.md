# Entity Attributes Implementation Plan

## Goal
Add entity attribute support với khả năng:
1. Entity có attributes động (lưu trong entity.dynamicProperties)
2. Transfer attributes: Player ↔ Entity, Entity ↔ Entity
3. Transfer Entity → Item/Block: ADD entity lore vào item/block lore hiện tại
4. Wiki tương tác với entity để xem info
5. Zombie attribute: `hunger_infliction` - đánh entity → entity bị hunger

## Architecture

### 1. Storage Layer
- `EntityAttributeStorage.ts` - Store/load từ entity.dynamicProperties
- Format: `{ attrId: config, ... }`

### 2. Resolution Layer
- `EntityAttributeResolver.ts` - Resolve entity attributes
- `AttributeResolver.ts` - EXTEND để check entity attributes khi resolve item/block

### 3. Transfer Layer (AttributeAPI)
- `transferAttributeToEntity(source, entity, attrId)` - Item/Block/Player → Entity
- `transferAttributeFromEntity(entity, target, attrId)` - Entity → Item/Block/Player
- `transferAttributeBetweenEntities(from, to, attrId)` - Entity ↔ Entity

### 4. Lore Layer
- Entity lore được generate từ attributes
- Khi transfer sang item/block → ADD với prefix `§c[EntityName]`
- LoreSystem cần check entity attributes trong item/block

### 5. Handler Layer
- `HungerInflictionHandler.ts` - Zombie với attribute đánh → target bị hunger
- Subscribe `beforeEvents.entityHurt`

### 6. Wiki Layer
- `WikiUI.ts` - Extend để support entity interaction
- Show entity info + lore từ attributes

## Implementation Steps

### Step 1: Storage & Resolution
- [ ] Create `EntityAttributeStorage.ts`
- [ ] Create `EntityAttributeResolver.ts`
- [ ] Update `AttributeResolver.ts` để check entity attributes

### Step 2: Transfer API
- [ ] Update `AttributeAPI.ts` với entity transfer methods
- [ ] Handle entity lore prefix khi transfer

### Step 3: Lore System
- [ ] Update `LoreSystem.ts` để detect entity attributes trong items
- [ ] Add entity lore với prefix

### Step 4: Hunger Handler
- [ ] Create `HungerInflictionHandler.ts`
- [ ] Register trong `AttributeSystem.ts`

### Step 5: Wiki Integration
- [ ] Update `WikiUI.ts` để support entity interaction

### Step 6: Config & Generation
- [ ] Create entity configs với attributes
- [ ] Update generators để support entity attributes
- [ ] Add lang entries

## Testing
- [ ] Transfer zombie attr → player → item
- [ ] Verify item shows both item lore + entity lore
- [ ] Test zombie attack → hunger effect
- [ ] Test wiki interaction với entity
