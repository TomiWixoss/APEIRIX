# Lessons Learned - APEIRIX Project

## Minecraft Bedrock Runtime Limitations

### Dynamic require() NOT SUPPORTED
**Date**: 2026-03-02
**Context**: Auto-migration system in GlobalItemAttributeRegistry

**Problem**: 
```typescript
// ❌ WRONG - Dynamic require fails in MC runtime
const { GENERATED_ATTRIBUTES } = require('../../../data/GeneratedAttributes');
```

**Error**:
```
Error: Dynamic require of "../../../data/GeneratedAttributes" is not supported
```

**Solution**:
```typescript
// ✅ CORRECT - Use static import
import { GENERATED_ATTRIBUTES, getAttributeConfig } from '../../data/GeneratedAttributes';
```

**Rule**: ALWAYS use static imports in Minecraft Bedrock scripts. Dynamic `require()` is NOT supported in the runtime environment.

**Files affected**:
- `scripts/systems/attributes/GlobalItemAttributeRegistry.ts`
- `scripts/systems/attributes/AttributeAPI.ts`

---

## Stackable Items and dynamicProperties

**Date**: Previous sessions
**Context**: Attribute storage for stackable items

**Problem**: `ItemStack.setDynamicProperty()` ONLY works for non-stackable items (maxAmount = 1)

**Solution**: Use world-level registries for stackable items:
- `GlobalItemAttributeRegistry` for stackable items (per-type)
- `ItemStack.dynamicProperties` for non-stackable items (per-instance)

**Rule**: Check `itemStack.maxAmount > 1` to determine storage strategy.
