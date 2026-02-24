# Test Recipe: canempty
# Type: shaped
# Result: canempty x4

clear @s

# Give ingredients:
give @s apeirix:tin_ingot 3

# Instructions:
tellraw @s {"text":"=== Test Shaped Recipe ===","color":"gold"}
tellraw @s {"text":"Recipe: canempty","color":"aqua"}
tellraw @s {"text":"Open crafting table and arrange items","color":"yellow"}
tellraw @s {"text":"Expected result: canempty x4","color":"green"}
playsound random.levelup @s
