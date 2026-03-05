# Better SB - Nhật Ký Cập Nhật

**Skyblock lấy cảm hứng từ Sky Factory 4 cho Minecraft Bedrock**

---

## [1.0.0] - 05/03/2026

### ✨ Tính Năng Mới

#### Hệ Thống Sky Factory 4
- **Bảo Vệ Void**: Tự động dịch chuyển về trời khi rơi xuống void (y < 0)
- **Dịch Chuyển Lên Y=200**: Giống Sky Factory 4, spawn lại trên trời
- **Cooldown 2 Giây**: Tránh spam teleport
- **Âm Thanh & Thông Báo**: Hiệu ứng enderman portal + thông báo

#### 🔍 Hiển Thị Thông Tin (QoL)
- **Tên Block/Entity**: Hiển thị tên tiếng Việt khi nhìn vào
- **Yêu Cầu Công Cụ**: Hiển thị tool cần thiết (cuốc, rìu, xẻng, v.v.)
- **Kiểm Tra Tool**: ✓ xanh nếu cầm đúng tool, ✗ đỏ nếu sai
- **Hỗ Trợ 700+ Blocks**: Mapping đầy đủ tất cả blocks Minecraft
- **Hiển Thị HP Entity**: Máu hiện tại/tối đa khi nhìn vào mob
- **Cập Nhật 0.5s**: Mượt mà, không lag

#### 🌐 Đa Ngôn Ngữ
- **Tiếng Việt**: Ngôn ngữ mặc định
- **Tiếng Anh**: Hỗ trợ đầy đủ
- **3 Hệ Thống Lang**: Pack lang, Script UI lang, Lore system

### 🏗️ Hệ Thống Core

#### Kiến Trúc
- **Game Manager**: Quản lý khởi tạo và systems
- **Event Bus**: Hệ thống sự kiện tập trung
- **Registry Pattern**: Tra cứu dữ liệu nhanh
- **Provider Architecture**: Dễ mở rộng tính năng mới

#### Build System
- **YAML → JSON**: Compile tự động từ config
- **Auto-Generate**: Tự động tạo TypeScript data files
- **Multi-Language**: Hỗ trợ nhiều ngôn ngữ
- **Clean Build**: Pipeline build sạch sẽ

### 🛠️ Công Cụ Dev

#### Addon Generator (CLI)
- Compile configs: `bun run dev compile configs/addon.yaml --clean`
- Build & deploy: `.\build-and-deploy.ps1`
- TypeScript build: `regolith run`

---

## 🎯 Thông Tin Dự Án

- **Tên**: Better SB (Better Skyblock)
- **Tác Giả**: TomiSakae
- **Phiên Bản**: 1.0.0
- **Minecraft**: 1.21.50+
- **Script API**: @minecraft/server 2.6.0-beta
- **Ngôn Ngữ**: Tiếng Việt (mặc định), Tiếng Anh

---

## � Ghi Chú

- **Better SB**: Phiên bản đơn giản, lấy cảm hứng Sky Factory 4
- **APEIRIX**: Phiên bản đầy đủ với machines, processing, etc.
- Đây là changelog của Better SB (phiên bản đơn giản)

---

**Cập Nhật Lần Cuối**: 05/03/2026  
**Trạng Thái**: Đang Phát Triển
