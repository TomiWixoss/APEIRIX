# Test Function: Salad Đóng Hộp
# ID: apeirix:cannedsalad

# Test: Salad Đóng Hộp - Remove Effects
clear @s
give @s apeirix:cannedsalad 64
effect @s saturation 1 255 true
effect @s instant_damage 1 10 true
effect @s poison 30 0 false
effect @s wither 30 0 false
tellraw @s {"text":"=== Test: Salad Đóng Hộp ===","color":"gold"}
tellraw @s {"text":"Nutrition: 3 | Saturation: 3.6","color":"aqua"}
tellraw @s {"text":"Special: Xóa TẤT CẢ hiệu ứng xấu!","color":"light_purple"}
tellraw @s {"text":"Đã cho Poison + Wither, ăn để test!","color":"red"}
playsound random.levelup @s