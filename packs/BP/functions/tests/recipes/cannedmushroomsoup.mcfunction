# Test Recipe: cannedmushroomsoup
# Type: shapeless
# Result: cannedmushroomsoup

clear @s

# Give ingredients:
give @s apeirix:canempty 1
give @s minecraft:mushroom_stew 1

# Instructions:
tellraw @s {"text":"=== Test Shapeless Recipe ===","color":"gold"}
tellraw @s {"text":"Recipe: cannedmushroomsoup","color":"aqua"}
tellraw @s {"text":"Open crafting table and place items","color":"yellow"}
tellraw @s {"text":"Expected result: cannedmushroomsoup","color":"green"}
playsound random.levelup @s
