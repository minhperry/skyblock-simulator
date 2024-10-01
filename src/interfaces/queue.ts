export type Undefinable<T> = T | undefined;

interface IQueue<T> {
    enqueue(item: T): void,
    getLastN(n: number): T[],
    getLast(): Undefinable<T>
    size(): number
}

export class Queue<T> implements IQueue<T> {
    private storage: T[] = []

    constructor(private capacity: number = Infinity) {
    }

    size(): number {
        return this.capacity;
    }

    enqueue(item: T) {
        if (this.storage.length < this.capacity) {
            this.storage.push(item);
        } else {
            console.error("Queue capacity exceeded");
        }
    }

    getLastN(n: number): T[] {
        if (n > this.storage.length) {
            return [...this.storage]
        } else {
            return this.storage.slice(this.storage.length - n)
        }
    }

    getLast(): T | undefined {
        if (this.storage.length === 0) {
            return undefined;
        }
        return this.storage[this.storage.length - 1];
    }

    getQueue(): T[] {
        return [...this.storage]
    }

    clear() {
        this.storage = []
    }
}
