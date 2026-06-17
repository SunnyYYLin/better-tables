import { TableData, TableAlignment } from './types';

export class TableStyler {
	static getCellAlignment(row: number, col: number, table: TableData, defaultAlignment: TableAlignment): TableAlignment {
		// Check for header cells
		if ((row === 0 && table.hasHeaderRow) || (col === 0 && table.hasHeaderColumn)) {
			return {
				horizontal: 'center',
				vertical: 'middle',
			};
		}

		return defaultAlignment;
	}

	static applyCellAlignment(cellEl: HTMLElement, alignment: TableAlignment): void {
		if (alignment.horizontal) {
			cellEl.style.textAlign = alignment.horizontal;
		}
		if (alignment.vertical) {
			cellEl.style.verticalAlign = alignment.vertical;
		}
	}

	static setColumnWidth(tableEl: HTMLTableElement, colIndex: number, width: number): void {
		const rows = tableEl.querySelectorAll('tr');
		rows.forEach(row => {
			const cells = row.querySelectorAll('td, th');
			if (colIndex < cells.length) {
				(cells[colIndex] as HTMLElement).style.width = `${width}px`;
			}
		});
	}

	static autoFitColumn(tableEl: HTMLTableElement, colIndex: number): void {
		const rows = tableEl.querySelectorAll('tr');
		let maxWidth = 0;

		// Calculate max content width for the column
		rows.forEach(row => {
			const cells = row.querySelectorAll('td, th');
			if (colIndex < cells.length) {
				const cell = cells[colIndex] as HTMLElement;
				const width = cell.scrollWidth;
				if (width > maxWidth) {
					maxWidth = width;
				}
			}
		});

		// Apply the max width
		if (maxWidth > 0) {
			TableStyler.setColumnWidth(tableEl, colIndex, maxWidth);
		}
	}

	static autoFitColumns(tableEl: HTMLTableElement): void {
		const rows = tableEl.querySelectorAll('tr');
		const firstRow = rows[0];
		const colCount = firstRow?.querySelectorAll('td, th').length || 0;

		// Calculate max content width for each column
		const maxWidths = new Array<number>(colCount).fill(0);
		rows.forEach(row => {
			const cells = row.querySelectorAll('td, th');
			cells.forEach((cell, index) => {
				const width = (cell as HTMLElement).scrollWidth;
				const maxWidth = maxWidths[index];
				if (maxWidth !== undefined && width > maxWidth) {
					maxWidths[index] = width;
				}
			});
		});

		// Apply widths
		rows.forEach(row => {
			const cells = row.querySelectorAll('td, th');
			cells.forEach((cell, index) => {
				const maxWidth = maxWidths[index];
				if (maxWidth !== undefined) {
					(cell as HTMLElement).style.width = `${maxWidth}px`;
				}
			});
		});
	}

	static equalizeColumns(tableEl: HTMLTableElement): void {
		const rows = tableEl.querySelectorAll('tr');
		const colCount = rows[0]?.querySelectorAll('td, th').length || 0;
		const tableWidth = tableEl.offsetWidth;
		const equalWidth = tableWidth / colCount;

		rows.forEach(row => {
			const cells = row.querySelectorAll('td, th');
			cells.forEach(cell => {
				(cell as HTMLElement).style.width = `${equalWidth}px`;
			});
		});
	}
}