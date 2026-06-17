export class TableCache {
	private static cache = new Map<string, HTMLTableCellElement[][]>();

	static getTableCache(tableEl: HTMLTableElement): HTMLTableCellElement[][] {
		const cacheKey = tableEl.getAttribute('data-table-cache-key') || 
			`table-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
		
		if (!tableEl.getAttribute('data-table-cache-key')) {
			tableEl.setAttribute('data-table-cache-key', cacheKey);
		}

		let cached = TableCache.cache.get(cacheKey);
		if (!cached) {
			cached = [];
			const rows = tableEl.querySelectorAll('tr');
			rows.forEach(row => {
				const cells: HTMLTableCellElement[] = Array.from(row.querySelectorAll('td, th'));
				cached!.push(cells);
			});
			TableCache.cache.set(cacheKey, cached);
		}

		return cached;
	}

	static getCell(tableEl: HTMLTableElement, row: number, col: number): HTMLTableCellElement | null {
		const cached = TableCache.getTableCache(tableEl);
		if (row < cached.length) {
			const rowCells = cached[row];
			if (rowCells && col < rowCells.length) {
				return rowCells[col] || null;
			}
		}
		return null;
	}

	static clearCache(tableEl?: HTMLTableElement): void {
		if (tableEl) {
			const cacheKey = tableEl.getAttribute('data-table-cache-key');
			if (cacheKey) {
				TableCache.cache.delete(cacheKey);
				tableEl.removeAttribute('data-table-cache-key');
			}
		} else {
			TableCache.cache.clear();
		}
	}

	static invalidateCache(tableEl: HTMLTableElement): void {
		TableCache.clearCache(tableEl);
	}
}