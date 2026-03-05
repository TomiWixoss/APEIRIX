/**
 * Registry Pattern - Central registration system
 */

export class Registry<T> {
    private items: Map<string, T> = new Map();

    register(id: string, item: T): void {
        if (this.items.has(id)) {
            console.warn(`Item with id "${id}" already registered`);
            return;
        }
        this.items.set(id, item);
    }

    unregister(id: string): boolean {
        return this.items.delete(id);
    }

    get(id: string): T | undefined {
        return this.items.get(id);
    }

    getAll(): T[] {
        return Array.from(this.items.values());
    }

    has(id: string): boolean {
        return this.items.has(id);
    }

    clear(): void {
        this.items.clear();
    }

    forEach(callback: (item: T, id: string) => void): void {
        this.items.forEach((item, id) => callback(item, id));
    }
}
