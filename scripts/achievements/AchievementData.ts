/**
 * Achievement definitions for APEIRIX
 * Text content is managed by LangManager
 */

export interface Achievement {
    id: string;
    requirement: number;
    category: string;
    icon: string; // Vanilla texture path
    rewards?: Array<{
        item: string;
        amount: number;
        icon: string;
    }>;
}

export const ACHIEVEMENT_CATEGORIES = {
    starter: {
        id: "starter",
        icon: "textures/items/book_normal"
    }
};

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: "welcome",
        requirement: 1,
        category: "starter",
        icon: "textures/items/book_writable",
        rewards: [
            {
                item: "minecraft:diamond",
                amount: 1,
                icon: "textures/items/diamond"
            }
        ]
    },
    {
        id: "first_steps",
        requirement: 100,
        category: "starter",
        icon: "textures/items/leather_boots",
        rewards: [
            {
                item: "minecraft:iron_ingot",
                amount: 5,
                icon: "textures/items/iron_ingot"
            }
        ]
    },
    {
        id: "breaker",
        requirement: 10,
        category: "starter",
        icon: "textures/items/iron_pickaxe",
        rewards: [
            {
                item: "minecraft:coal",
                amount: 16,
                icon: "textures/items/coal"
            }
        ]
    }
];
