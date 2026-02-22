/**
 * Achievement definitions for APEIRIX
 */

export interface Achievement {
    id: string;
    name: string;
    desc: string;
    requirement: number;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: "welcome",
        name: "Chào mừng đến APEIRIX",
        desc: "Tham gia thế giới lần đầu tiên",
        requirement: 1
    },
    {
        id: "first_steps",
        name: "Bước Đầu Tiên",
        desc: "Đi bộ 100 blocks",
        requirement: 100
    },
    {
        id: "breaker",
        name: "Người Phá Hủy",
        desc: "Phá 10 blocks",
        requirement: 10
    }
];
