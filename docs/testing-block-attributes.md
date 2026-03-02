# Testing Block Attribute Transfer System

This document provides test commands and workflows for the Block Attribute Transfer System.

## Available Test Commands

### Test 1: Transfer from Item to Block Type
**Command**: `/scriptevent test:transfer_to_dirt`

**Purpose**: Transfer `requires_tool` attribute from an item (e.g., mangrove_log) to dirt block type.

**Steps**:
1. Get a mangrove log: `/give @s mangrove_log`
2. Hold the log in your hand
3. Run command: `/scriptevent test:transfer_to_dirt`
4. Check message: "Success! Dirt now requires axe to mine"
5. Throw and pickup dirt items to see lore auto-apply
6. Try mining dirt without axe → Should be blocked

**Expected Result**:
- Mangrove log loses "Yêu cầu: Rìu" lore
- Dirt items show "Yêu cầu: Rìu" lore
- Dirt blocks require axe to mine

---

### Test 2: Transfer from Block Type to Item
**Command**: `/scriptevent test:transfer_back`

**Purpose**: Transfer `requires_tool` attribute from dirt block type back to an item.

**Steps**:
1. Get any item: `/give @s stick`
2. Hold item in your hand
3. Run command: `/scriptevent test:transfer_back`
4. Check message: "Success! Dirt no longer requires axe"
5. Throw and pickup items to see lore update
6. Try mining dirt without axe → Should work normally

**Expected Result**:
- Stick gains "Yêu cầu: Rìu" lore
- Dirt items lose "Yêu cầu: Rìu" lore
- Dirt blocks no longer require axe

---

### Test 3: Check Registry State
**Command**: `/scriptevent test:check_registry`

**Purpose**: View all block types with dynamic attributes.

**Steps**:
1. Run command: `/scriptevent test:check_registry`
2. Check chat for registry contents

**Expected Output**:
```
Block Attribute Registry: X block types
- minecraft:dirt: requires_tool
- minecraft:cobblestone: requires_tool
```

---

### Test 4: Clear Registry
**Command**: `/scriptevent test:clear_registry`

**Purpose**: Reset all block attributes (for testing/debugging).

**Steps**:
1. Run command: `/scriptevent test:clear_registry`
2. Check message: "Registry cleared"
3. All blocks return to default behavior

---

### Test 5: Transfer Between Items
**Command**: `/scriptevent test:transfer_item_to_item`

**Purpose**: Transfer attribute from one item to another item.

**Steps**:
1. Get source item with attribute (e.g., stick with requires_tool)
2. Get target item in next slot (e.g., another stick)
3. Hold source item in hand
4. Run command: `/scriptevent test:transfer_item_to_item`
5. Throw and pickup both items to see lore update

**Expected Result**:
- Source item loses attribute and lore
- Target item gains attribute and lore

---

### Test 6: Transfer Between Block Types
**Command**: `/scriptevent test:transfer_block_to_block`

**Purpose**: Transfer attribute from one block type to another.

**Steps**:
1. Ensure dirt has `requires_tool` attribute (use Test 1 first)
2. Run command: `/scriptevent test:transfer_block_to_block`
3. Check message: "Success! Cobblestone now requires axe, dirt no longer requires axe"
4. Try mining both blocks to verify

**Expected Result**:
- Dirt blocks no longer require axe
- Cobblestone blocks now require axe
- Dirt items lose lore
- Cobblestone items gain lore (when picked up)

---

### Test 7: Transfer from Tool to Block (Real-World Use Case)
**Command**: `/scriptevent test:transfer_tool_to_block`

**Purpose**: Transfer attribute from a tool (with existing attributes) to a block type.

**Steps**:
1. Get a tool with attributes: `/give @s wooden_pickaxe`
2. Hold the tool in your hand
3. Run command: `/scriptevent test:transfer_tool_to_block`
4. Check message showing which attribute was transferred
5. Throw and pickup tool to see lore update
6. Try mining dirt to verify block attribute

**Expected Result**:
- Tool loses first attribute and its lore line
- Dirt blocks gain that attribute
- Dirt items show new lore when picked up

---

## Testing Workflow

### Complete Transfer Cycle
1. Start with wooden_pickaxe (has attributes)
2. Transfer attribute to dirt: `/scriptevent test:transfer_tool_to_block`
3. Verify dirt requires tool, pickaxe lost lore
4. Transfer back to stick: `/scriptevent test:transfer_back`
5. Verify stick has lore, dirt no longer requires tool
6. Check registry: `/scriptevent test:check_registry`
7. Clear registry: `/scriptevent test:clear_registry`

### Lore Refresh Testing
1. Transfer attribute to dirt
2. Get dirt items: `/give @s dirt 64`
3. Items should have NO lore initially
4. Throw dirt on ground
5. Pickup dirt
6. Items should now have "Yêu cầu: Rìu" lore

### Mining Behavior Testing
1. Transfer `requires_tool` to dirt
2. Try mining dirt with hand → Should fail
3. Try mining dirt with axe → Should work
4. Transfer attribute away from dirt
5. Try mining dirt with hand → Should work

---

## Architecture Notes

### Two Registries
- **GlobalItemAttributeRegistry**: For item lore (per-type, affects all items of that type)
- **GlobalBlockAttributeRegistry**: For mining checks (per-type, affects all blocks of that type)

### Transfer Operations Update Both
When transferring attributes, BOTH registries are updated:
- Item → Block: Remove from item registry, add to both item and block registries for target
- Block → Item: Remove from both registries for source, add to item registry for target
- Item → Item: Only affects item registry
- Block → Block: Affects both registries

### Lore Auto-Refresh
- Lore refreshes automatically when items enter inventory
- Use "throw and pickup" to force lore refresh
- Lore = Function(Attributes) - always generated dynamically

---

## Troubleshooting

### Lore Not Updating
- Throw item on ground and pickup again
- Check if attribute exists in registry: `/scriptevent test:check_registry`
- Verify item type matches (dirt vs minecraft:dirt)

### Mining Behavior Not Working
- Check GlobalBlockAttributeRegistry has the attribute
- Verify you're using correct tool type
- Try `/reload` to refresh game state

### Transfer Failed
- Check source has the attribute
- Check target doesn't already have the attribute
- Verify item is in hand (for item transfers)
- Check console logs for error messages
