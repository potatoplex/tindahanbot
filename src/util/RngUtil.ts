export function doRoll(max: number): number {
	return Math.floor(Math.random() * max);
}

export function doRollRange(mn: number, mx: number): number {
	const min = Math.ceil(mn);
	const max = Math.floor(mx);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function rateRoll(rate: number): boolean {
	return doRoll(100) < rate;
}

export function pick<T>(pool: T[]): T {
	return pool[doRoll(pool.length)];
}

export function shuffle<T>(b: T[]): T[] {
	const a = b.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export function getRandomColor(): string {
	const letters = '0123456789ABCDEF'.split('');
	return Array(6)
		.fill(undefined)
		.reduce((prev) => `${prev}${pick(letters)}`, '#');
}
