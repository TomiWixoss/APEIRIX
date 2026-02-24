# Test Function: Bánh Mì Đóng Hộp
# ID: apeirix:cannedbread

# Test: Bánh Mì Đóng Hộp
clear @s
give @s apeirix:cannedbread 64
effect @s saturation 1 255 true
effect @s instant_damage 1 10 true
tellraw @s {"text":"=== Test: Bánh Mì Đóng Hộp ===","color":"gold"}
tellraw @s {"text":"Nutrition: 5 | Saturation: 6.0","color":"aqua"}
tellraw @s {"text":"Easter Egg: Spongebob reference!","color":"yellow"}
playsound random.levelup @s