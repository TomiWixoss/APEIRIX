# Test Function: Cá Mòi Đóng Hộp
# ID: apeirix:cannedfish

# Test: Cá Mòi Đóng Hộp - Water Breathing
clear @s
give @s apeirix:cannedfish 64
effect @s saturation 1 255 true
effect @s instant_damage 1 10 true
tellraw @s {"text":"=== Test: Cá Mòi Đóng Hộp ===","color":"gold"}
tellraw @s {"text":"Nutrition: 5 | Saturation: 6.0","color":"aqua"}
tellraw @s {"text":"Effect: Water Breathing 30s","color":"yellow"}
tellraw @s {"text":"Ăn để test Water Breathing!","color":"white"}
playsound random.levelup @s