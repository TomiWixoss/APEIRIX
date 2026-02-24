# Test All Recipes - Bulk Test
# Total recipes: 12

clear @s

# Give ALL ingredients for ALL recipes:
give @s apeirix:tin_ingot 3
give @s apeirix:candirty 1
give @s minecraft:water_bucket 1
give @s apeirix:canempty 10
give @s minecraft:mushroom_stew 1
give @s minecraft:beetroot_soup 1
give @s minecraft:cooked_beef 2
give @s minecraft:cooked_porkchop 1
give @s minecraft:bread 2
give @s minecraft:carrot 4
give @s minecraft:pumpkin 1
give @s minecraft:sugar 1
give @s minecraft:cooked_cod 2
give @s minecraft:apple 1
give @s minecraft:sweet_berries 1
give @s minecraft:oak_leaves 1
give @s minecraft:rotten_flesh 2
give @s minecraft:bone 1

# Recipe List:
# 1. canempty (shaped) -> canempty x4
# 2. candirty_to_canempty (shaped) -> canempty
# 3. cannedmushroomsoup (shapeless) -> cannedmushroomsoup
# 4. cannedbeets (shapeless) -> cannedbeets
# 5. canned_food (shapeless) -> canned_food
# 6. cannedbread (shapeless) -> cannedbread
# 7. cannedcarrots (shapeless) -> cannedcarrots
# 8. canned_pumpkin (shapeless) -> canned_pumpkin
# 9. cannedfish (shapeless) -> cannedfish
# 10. cannedsalad (shapeless) -> cannedsalad
# 11. cannedmeal (shapeless) -> cannedmeal
# 12. canneddogfood (shapeless) -> canneddogfood

# Instructions:
tellraw @s {"text":"=== Test All Recipes ===","color":"gold"}
tellraw @s {"text":"Total: 12 recipes","color":"aqua"}
tellraw @s {"text":"All ingredients provided!","color":"yellow"}
tellraw @s {"text":"Craft each recipe to test","color":"green"}
playsound random.levelup @s
