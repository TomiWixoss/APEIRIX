# Test Checklist: Achievement System

**Version**: 1.0.0  
**Ngày test**: _____  
**Minecraft Version**: _____  
**Tester**: _____

## 1. Achievement Book Item

### Obtaining
- [ ] Có achievement book trong inventory khi spawn
- [ ] Có thể craft achievement book (nếu có recipe)
- [ ] Có thể lấy từ creative inventory

### Display
- [ ] Texture đúng
- [ ] Tên: "Sách Thành Tựu Apeirix"
- [ ] Description đúng

### Usage
- [ ] Click chuột phải → mở UI
- [ ] UI hiển thị đúng
- [ ] Không consume item khi dùng

## 2. Achievement UI

### Main Menu
- [ ] Hiển thị danh sách categories
- [ ] Hiển thị số achievements completed/total
- [ ] Hiển thị progress bar
- [ ] Màu sắc UI dễ đọc (sáng cho body, tối cho buttons)

### Category Menu
- [ ] Click category → hiển thị achievements trong category
- [ ] Hiển thị achievement icons
- [ ] Hiển thị achievement names (tiếng Việt)
- [ ] Hiển thị completion status (✓ hoặc ✗)
- [ ] Back button hoạt động

### Detail UI
- [ ] Click achievement → hiển thị chi tiết
- [ ] Hiển thị description
- [ ] Hiển thị requirements
- [ ] Hiển thị rewards (nếu có)
- [ ] Hiển thị progress (nếu có)
- [ ] Back button hoạt động

## 3. Starter Category Achievements

### Welcome Achievement
- [ ] ID: `apeirix:welcome`
- [ ] Tên: "Chào Mừng Đến APEIRIX"
- [ ] Trigger: Join world lần đầu
- [ ] Auto-complete khi spawn
- [ ] Hiển thị toast notification
- [ ] Reward: 10 XP (nếu có)

### First Steps Achievement
- [ ] ID: `apeirix:first_steps`
- [ ] Tên: "Bước Đầu Tiên"
- [ ] Trigger: Di chuyển 10 blocks
- [ ] Progress tracking: 0/10 blocks
- [ ] Complete khi đi đủ 10 blocks
- [ ] Toast notification khi complete

### Breaker Achievement
- [ ] ID: `apeirix:breaker`
- [ ] Tên: "Người Phá Hoại"
- [ ] Trigger: Phá 100 blocks
- [ ] Progress tracking: 0/100 blocks
- [ ] Complete khi phá đủ 100 blocks
- [ ] Toast notification khi complete

## 4. Achievement Storage

### Dynamic Properties
- [ ] Achievement progress được lưu
- [ ] Achievement completion được lưu
- [ ] Data persist sau khi thoát game
- [ ] Data persist sau khi restart world

### Player-Specific
- [ ] Mỗi player có achievement riêng
- [ ] Player A complete không affect Player B
- [ ] Multiplayer support

## 5. Achievement Tracking

### Event System
- [ ] EventBus hoạt động
- [ ] Events trigger đúng
- [ ] Achievement listeners subscribe đúng
- [ ] Progress update real-time

### Progress Display
- [ ] Progress bar update trong UI
- [ ] Progress text update (e.g., "5/10")
- [ ] Percentage display (nếu có)

## 6. Toast Notifications

### Display
- [ ] Toast hiển thị khi complete achievement
- [ ] Toast có achievement name
- [ ] Toast có achievement icon (nếu có)
- [ ] Toast tự động biến mất sau vài giây

### Sound
- [ ] Sound effect khi complete (nếu có)
- [ ] Sound không quá loud

## 7. Registry Pattern

### AchievementRegistry
- [ ] Đăng ký achievements đúng
- [ ] Đăng ký categories đúng
- [ ] Get achievement by ID hoạt động
- [ ] Get all achievements hoạt động

### Extensibility
- [ ] Dễ dàng thêm achievement mới
- [ ] Không cần chỉnh code cũ
- [ ] Follow Open/Closed principle

## 8. Performance

### UI Performance
- [ ] UI mở nhanh (< 1 giây)
- [ ] UI scroll smooth
- [ ] Không lag khi có nhiều achievements

### Tracking Performance
- [ ] Achievement tracking không gây lag
- [ ] Event system efficient
- [ ] Storage operations fast

## 9. Edge Cases

### Multiple Completions
- [ ] Achievement không complete nhiều lần
- [ ] Toast không spam khi complete

### Invalid Data
- [ ] Handle invalid achievement ID
- [ ] Handle corrupted save data
- [ ] Không crash game

### Multiplayer
- [ ] Achievements hoạt động trong multiplayer
- [ ] Không conflict giữa players
- [ ] Sync đúng

## 10. Language System

### Vietnamese Display
- [ ] Tất cả achievement names tiếng Việt
- [ ] Tất cả descriptions tiếng Việt
- [ ] UI text tiếng Việt
- [ ] LangManager hoạt động đúng

## Ghi chú lỗi

_Ghi các lỗi phát hiện ở đây..._
