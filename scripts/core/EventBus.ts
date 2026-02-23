/**
 * Event Bus - Decoupling system communication
 */

type EventCallback = (...args: any[]) => void;

export class EventBus {
    private static events: Map<string, EventCallback[]> = new Map();

    static on(event: string, callback: EventCallback): void {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push(callback);
    }

    static off(event: string, callback: EventCallback): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    static emit(event: string, ...args: any[]): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(...args));
        }
    }

    static clear(): void {
        this.events.clear();
    }
}
