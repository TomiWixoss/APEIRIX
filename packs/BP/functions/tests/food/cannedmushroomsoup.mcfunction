# Test Function: Súp Nấm Hộp
# ID: apeirix:cannedmushroomsoup

# Test: Súp Nấm Hộp
clear @s
give @s apeirix:cannedmushroomsoup 64
effect @s saturation 1 255 true
effect @s instant_damage 1 10 true
tellraw @s {"text":"=== Test: Súp Nấm Hộp ===","color":"gold"}
tellraw @s {"text":"Nutrition: 6 | Saturation: 7.2","color":"aqua"}
tellraw @s {"text":"Biến món súp vô dụng thành hành trang mine!","color":"white"}
playsound random.levelup @s