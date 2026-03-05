# Display System Architecture

## Overview
Hệ thống hiển thị thông tin khi player nhìn vào blocks/entities. Kiến trúc modular, dễ mở rộng.

## Structure

```
processing/
├── DisplayHandler.ts              # Orchestrator (slim)
├── BlockInfoProvider.ts           # Block data extraction
├── BlockToolRequirements.ts       # Tool requirements mapping
├── providers/
│   ├── IDisplayProvider.ts        # Provider interface
│   ├── BlockDisplayProvider.ts    # Block display logic
│   └── EntityDisplayProvider.ts   # Entity display logic
├── validators/
│   └── ToolValidator.ts           # Tool checking logic
└── formatters/
    ├── RawMessageFormatter.ts     # RawMessage builder
    └── ColorFormatter.ts          # Color codes
```

## How It Works

### 1. DisplayHandler (Orchestrator)
- Slim coordinator: Chỉ quản lý raycast và dispatch
- Không chứa business logic
- Register providers và gọi theo priority

### 2. Providers (Business Logic)
Mỗi provider xử lý 1 loại target:
- `BlockDisplayProvider`: Blocks + tool requirements
- `EntityDisplayProvider`: Entities + HP
- **Future**: `ContainerDisplayProvider` (chest, furnace, etc.)

### 3. Validators
- `ToolValidator`: Check tool type + tier

### 4. Formatters
- `RawMessageFormatter`: Build RawMessage objects
- `ColorFormatter`: Color codes + formatting

## Adding New Provider

Example: Container display (chest, furnace, etc.)

```typescript
// providers/ContainerDisplayProvider.ts
export class ContainerDisplayProvider implements IDisplayProvider {
  canHandle(target: any): boolean {
    // Check if target is a container block
    return target.typeId?.includes('chest') || 
           target.typeId?.includes('furnace');
  }

  getDisplayInfo(player: any, target: any): DisplayInfo | null {
    const block = target as Block;
    const inventory = block.getComponent('inventory');
    
    if (inventory) {
      const itemCount = this.countItems(inventory.container);
      return {
        message: `§6Chest §7| §e${itemCount} items`,
        priority: 15 // Higher than block, lower than entity
      };
    }
    
    return null;
  }
}
```

Then register in `DisplayHandler.initialize()`:
```typescript
this.providers = [
  new EntityDisplayProvider(),     // Priority 20
  new ContainerDisplayProvider(),  // Priority 15
  new BlockDisplayProvider()       // Priority 10
];
```

## Priority System
- Higher priority = hiển thị trước
- Entity (20) > Container (15) > Block (10)
- First matching provider wins

## Benefits
✅ Dễ thêm provider mới (chest, furnace, hopper, etc.)
✅ Tách biệt concerns (display, validation, formatting)
✅ Test được từng phần riêng
✅ Không phình to 1 file
✅ Extensible cho tương lai
