# Test Checklist: Tin Ore World Generation

**Version**: 1.0.0  
**Ngày test**: _____  
**Minecraft Version**: _____  
**Tester**: _____  
**Seed**: _____

## 1. Tin Ore Generation

### Y-Level Distribution
- [ ] Tin ore spawn từ Y=0 đến Y=72
- [ ] Không spawn dưới Y=0
- [ ] Không spawn trên Y=72
- [ ] Tập trung nhiều ở Y=30-50 (mid-level)

### Frequency
- [ ] Tìm thấy tin ore trong vòng 5 phút mining
- [ ] Frequency hợp lý (không quá hiếm/nhiều)
- [ ] ~20 iterations per chunk (theo config)

### Vein Size
- [ ] Vein size trung bình 4-8 blocks
- [ ] Không có vein quá lớn (>15 blocks)
- [ ] Không có single ore (quá nhỏ)

### Biome Distribution
- [ ] Spawn trong Plains biome
- [ ] Spawn trong Forest biome
- [ ] Spawn trong Mountains biome
- [ ] Spawn trong Desert biome
- [ ] Spawn trong tất cả overworld biomes

## 2. Deepslate Tin Ore Generation

### Y-Level Distribution
- [ ] Deepslate tin ore spawn dưới Y=0
- [ ] Chỉ spawn trong deepslate layer
- [ ] Không spawn trong stone layer

### Frequency
- [ ] Frequency tương tự tin ore
- [ ] Tìm thấy khi mining trong deepslate

### Vein Size
- [ ] Vein size giống tin ore

## 3. Cave Generation

### Exposed Ores
- [ ] Tin ore exposed trong caves
- [ ] Tin ore exposed trên cave walls
- [ ] Tin ore exposed trên cave ceiling/floor

### Cave Systems
- [ ] Tin ore spawn trong lush caves
- [ ] Tin ore spawn trong dripstone caves
- [ ] Tin ore spawn trong normal caves

## 4. Feature & Feature Rule

### Configuration
- [ ] Feature file: `tin_ore_scatter.json` tồn tại
- [ ] Feature rule file: `tin_ore_feature.json` tồn tại
- [ ] Scatter count: 20 iterations
- [ ] Y-range: 0-72

### Placement
- [ ] Tin ore replace stone
- [ ] Tin ore replace deepslate (cho deepslate variant)
- [ ] Không replace air
- [ ] Không replace water/lava

## 5. Chunk Generation

### New Chunks
- [ ] Tin ore generate trong new chunks
- [ ] Consistent generation (không random mỗi lần load)

### Existing Chunks
- [ ] Tin ore KHÔNG generate trong existing chunks (trước khi add addon)
- [ ] Chỉ generate trong chunks mới

## 6. Performance

### Generation Speed
- [ ] Chunk generation không lag
- [ ] World load time bình thường
- [ ] Không có freeze khi generate

### Memory Usage
- [ ] Không có memory leak
- [ ] RAM usage bình thường

## 7. Compatibility

### Vanilla Ores
- [ ] Tin ore không replace vanilla ores
- [ ] Coal, iron, gold, diamond vẫn spawn bình thường
- [ ] Không conflict với vanilla generation

### Other Structures
- [ ] Tin ore spawn trong mineshafts
- [ ] Tin ore spawn gần strongholds
- [ ] Không break structures

## 8. Visual Inspection

### In-Game Check
- [ ] `/tp ~ 40 ~` và mine xung quanh
- [ ] Tìm thấy tin ore trong 10 phút
- [ ] Vein distribution hợp lý
- [ ] Texture blend tốt với stone/deepslate

## 9. Statistics (Optional)

### Mining Session (30 minutes)
```
Tin ore found: ___ blocks
Deepslate tin ore found: ___ blocks
Average vein size: ___ blocks
Y-level most common: Y=___
```

### Chunk Analysis (10 chunks)
```
Chunk 1: ___ tin ores
Chunk 2: ___ tin ores
...
Average: ___ tin ores per chunk
Expected: ~20-40 ores per chunk
```

## Ghi chú lỗi

_Ghi các lỗi phát hiện ở đây..._
