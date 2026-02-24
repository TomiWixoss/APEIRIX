# Custom Components

Thư mục này chứa các custom components cho items.

## Cấu trúc

Custom components khác với systems thường:
- **Systems**: Initialize trong `GameManager.initializeSystems()`
- **Components**: PHẢI register trong `system.beforeEvents.startup`

Do đó, components được import trực tiếp trong `main.ts` để đảm bảo register đúng thời điểm.

## Components hiện có

### FoodComponents.ts
Custom components cho food items:

#### `apeirix:food_effects`
Apply effects khi player ăn food.

**Usage trong JSON:**
```json
{
  "components": {
    "apeirix:food_effects": [
      {
        "name": "night_vision",
        "duration": 300,
        "amplifier": 0,
        "chance": 1.0
      }
    ]
  }
}
```

**Properties:**
- `name`: Effect ID (regeneration, speed, night_vision, etc.)
- `duration`: Duration trong ticks (giây × 20)
- `amplifier`: Effect level - 1 (0 = level I, 1 = level II)
- `chance`: Probability 0.0-1.0 (1.0 = 100%)

#### `apeirix:remove_effects`
Remove tất cả effects khi ăn (như milk).

**Usage trong JSON:**
```json
{
  "components": {
    "apeirix:remove_effects": true
  }
}
```

## Thêm Custom Component mới

1. Tạo file trong `scripts/components/`
2. Implement component với `onConsume`, `onUse`, etc.
3. Register trong `system.beforeEvents.startup`
4. Import trong `main.ts`
5. Update README này

## Lưu ý

- Custom components tự động register khi file được import
- KHÔNG cần gọi function register thủ công
- Components PHẢI được import TRƯỚC `GameManager.initialize()`
