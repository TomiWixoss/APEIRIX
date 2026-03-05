/**
 * Registry Pattern - Central registration system
 * Better SB
 */

export class Registry<T> {
  private items: Map<string, T> = new Map();

  /**
   * Register item
   */
  register(id: string, item: T): void {
    if (this.items.has(id)) {
      console.warn(`[Registry] Item with id "${id}" already registered`);
      return;
    }
    this.items.set(id, item);
  }

  /**
   * Unregister item
   */
  unregister(id: string): boolean {
    return this.items.delete(id);
  }

  /**
   * Get item by ID
   */
  get(id: string): T | undefined {
    return this.items.get(id);
  }

  /**
   * Get all items
   */
  getAll(): T[] {
    return Array.from(this.items.values());
  }

  /**
   * Check if item exists
   */
  has(id: string): boolean {
    return this.items.has(id);
  }

  /**
   * Clear all items
   */
  clear(): void {
    this.items.clear();
  }

  /**
   * Iterate over all items
   */
  forEach(callback: (item: T, id: string) => void): void {
    this.items.forEach((item, id) => callback(item, id));
  }
}
