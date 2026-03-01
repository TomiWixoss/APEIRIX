# Testing Block Attribute Transfer System

## Setup

1. Build addon: `regolith run`
2. Load world trong Minecraft với addon enabled
3. Enable cheats trong world settings

## Test Commands

### Test 1: Transfer từ Item sang Block Type

**Mục đích**: Transfer `requires_tool` từ mangrove log item sang dirt block type

**Steps**:
1. Get mangrove log item: `/give @s mangrove_log`
2. Hold mangrove log trong tay (slot 0)
3. Run command: `/scriptevent test:transfer_to_dirt`
4. Check message: "Success! Dirt now requires axe to mine"
5. Try mining dirt without axe → Should be BLOCKED with message
6. Try mining dirt with axe → Should work normally

**Expected Result**:
- Mangrove log item: Mất `requires_tool` attribute (check lore)
- Dirt blocks: Giờ cần axe để mine (TẤT CẢ dirt blocks trong world)

---

### Test 2: Transfer từ Block Type sang Item

**Mục đích**: Transfer `requires_tool` từ dirt block type về item (remove from blocks)

**Steps**:
1. Get any item: `/give @s stick`
2. Hold item trong tay
3. Run command: `/scriptevent test:transfer_back`
4. Check message: "Success! Dirt no longer requires axe"
5. Try mining dirt without axe → Should work normally

**Expected Result**:
- Dirt blocks: Không cần axe nữa
- Item trong tay: Có `requires_tool` attribute (check lore)

---

### Test 3: Check Registry State

**Mục đích**: Xem block types nào có dynamic attributes

**Steps**:
1. Run command: `/scriptevent test:check_registry`
2. Check chat messages

**Expected Output**:
```
Block Attribute Registry: 1 block types
- minecraft:dirt: requires_tool
```

Hoặc nếu empty:
```
Block Attribute Registry: 0 block types
Registry is empty
```

---

### Test 4: Clear Registry

**Mục đích**: Reset tất cả dynamic block attributes

**Steps**:
1. Run command: `/scriptevent test:clear_registry`
2. Check message: "Registry cleared"
3. Try mining dirt without axe → Should work (no longer requires tool)

**Expected Result**:
- Tất cả dynamic block attributes bị xóa
- Blocks về behavior mặc định (static YAML hoặc vanilla)

---

## Test Scenarios

### Scenario A: Basic Transfer Flow

1. `/give @s mangrove_log`
2. Hold log, run `/scriptevent test:transfer_to_dirt`
3. Try mine dirt without axe → BLOCKED ✅
4. Hold stick, run `/scriptevent test:transfer_back`
5. Try mine dirt without axe → WORKS ✅

### Scenario B: Persistence Test

1. Transfer attribute to dirt: `/scriptevent test:transfer_to_dirt`
2. Check registry: `/scriptevent test:check_registry` → Should show dirt
3. Save & quit world
4. Reload world
5. Try mine dirt without axe → Should still be BLOCKED ✅
6. Check registry again → Should still show dirt ✅

### Scenario C: Multiple Transfers

1. Transfer log → dirt
2. Transfer dirt → stone: Use AttributeAPI in code
3. Check: Dirt works, stone blocked
4. Transfer stone → gravel
5. Check: Stone works, gravel blocked

---

## Debugging

### Check Console Logs

Look for these messages in content log:
```
[GlobalBlockAttributeRegistry] Initializing...
[GlobalBlockAttributeRegistry] Loaded X attributes for Y block types
[GlobalBlockAttributeRegistry] Added attribute 'requires_tool' to block type 'minecraft:dirt'
[RequiresToolHandler] Initializing...
[TestBlockAttributeTransfer] Test commands registered
```

### Common Issues

**Issue**: "No item in hand"
- **Fix**: Make sure item is in selected hotbar slot

**Issue**: "Failed to transfer attribute"
- **Cause**: Source doesn't have attribute, or target already has it
- **Fix**: Check with `/scriptevent test:check_registry`

**Issue**: Dirt still mineable without axe after transfer
- **Cause**: RequiresToolHandler not checking dynamic attributes
- **Fix**: Check console for errors, verify RequiresToolHandler.initialize() called

**Issue**: Attribute not persisting after reload
- **Cause**: World storage not saving
- **Fix**: Check world.setDynamicProperty() errors in console

---

## Manual Testing (Without Commands)

If you want to test programmatically:

```typescript
import { AttributeAPI } from './systems/attributes/AttributeAPI';
import { GlobalBlockAttributeRegistry } from './systems/attributes/GlobalBlockAttributeRegistry';

// Get player's held item
const player = world.getAllPlayers()[0];
const inventory = player.getComponent('inventory');
const item = inventory.container.getItem(player.selectedSlotIndex);

// Transfer to dirt
AttributeAPI.transferAttributeToBlockType(item, 'requires_tool', 'minecraft:dirt');

// Check registry
const attrs = GlobalBlockAttributeRegistry.getAllBlockAttributes();
console.warn(JSON.stringify(attrs, null, 2));

// Transfer back
AttributeAPI.transferAttributeFromBlockType('minecraft:dirt', item, 'requires_tool');
```

---

## Success Criteria

✅ Transfer item → block type works
✅ Transfer block type → item works
✅ Dynamic attributes override static (priority correct)
✅ Attributes persist across world reload
✅ Registry state queryable
✅ Clear registry works
✅ No console errors
✅ Lore updates correctly on items

---

## Next Steps

After testing, you can:
1. Create UI for attribute transfer (if needed)
2. Add more test scenarios
3. Implement per-location attributes (if needed)
4. Add attribute decay/expiration
5. Create machines that transfer attributes
