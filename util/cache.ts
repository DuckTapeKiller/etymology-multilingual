interface CacheItem {
	data: unknown;
	expiry: number;
}

export class EtymologyCache {
	private store = new Map<string, CacheItem>();
	private ttlMs: number;

	constructor(ttlMinutes: number = 30) {
		this.ttlMs = ttlMinutes * 60 * 1000;
	}

	get<T>(key: string): T | null {
		if (this.ttlMs === 0) return null;

		const item = this.store.get(key);
		if (!item) return null;

		if (Date.now() > item.expiry) {
			this.store.delete(key);
			return null;
		}

		return item.data as T;
	}

	set(key: string, data: unknown): void {
		if (this.ttlMs === 0) return;

		this.store.set(key, {
			data,
			expiry: Date.now() + this.ttlMs,
		});
	}

	updateTTL(ttlMinutes: number): void {
		this.ttlMs = ttlMinutes * 60 * 1000;
	}

	clear(): void {
		this.store.clear();
	}
}
