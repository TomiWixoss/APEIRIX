# Simplified Lore System - NO ENCODING

## Problem with Current Approach
- Lore encoding (§0{JSON}§r) vượt 50 char limit
- Too complex, hard to debug
- Mixing storage with display

## NEW SIMPLE APPROACH

### Core Principle
**Lore = Display ONLY (no storage)**

### Storage Strategy
1. **Items**: dynamicProperties (non-stackable) or skip dynamic attributes (stackable)
2. **Blocks**: GlobalBlockAttributeRegistry (per-type)
3. **NO lore encoding** - Lore is pure display

### Lore Generation
```typescript
// SIMPLE: Just show visible text
const lore = [];
for (const attr of attributes) {
  const text = handler.generateLoreText(attr.config);
  lore.push(text); // NO encoding prefix
}
```

### Trade-offs
**Pros:**
- Simple, clean, no char limit issues
- Easy to debug
- Clear separation: storage vs display

**Cons:**
- Stackable items can't have dynamic attributes (Minecraft limitation)
- But that's OK - most items with attributes are non-stackable (tools, armor)

### Implementation
1. Remove LoreAttributeCodec usage from PlaceholderRegistry
2. Generate plain text lore (no §0 prefix)
3. Attributes stored ONLY in dynamicProperties or GlobalBlockAttributeRegistry
4. For stackable items: Use block-type attributes only

