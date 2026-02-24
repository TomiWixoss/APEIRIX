# Test Function: Thịt Hộp Hầm
# ID: apeirix:canned_food

# Test: Thịt Hộp Hầm
clear @s
give @s apeirix:canned_food 64
effect @s saturation 1 255 true
effect @s instant_damage 1 10 true
tellraw @s {"text":"=== Test: Thịt Hộp Hầm ===","color":"gold"}
tellraw @s {"text":"Nutrition: 10 | Saturation: 12.8","color":"aqua"}
tellraw @s {"text":"Hồi 5 đùi gà với saturation cực cao!","color":"green"}
playsound random.levelup @s