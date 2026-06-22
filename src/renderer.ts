import { TableData, TableConfig, CellMerge } from './types';
import { TableStyler } from './styler';
import { TableCache } from './cache';

export class TableRenderer {
	private config: TableConfig;

	constructor(config: TableConfig) {
		this.config = config;
	}

	renderTable(table: TableData, container: HTMLElement): void {
		// Add caption above table if enabled
		if (this.config.enableCaption && table.caption) {
			const captionDiv = container.createEl('div', {
				cls: 'table-caption',
			});
			captionDiv.textContent = table.caption;
		}

		const tableEl = container.createEl('table');
		tableEl.addClass('better-table');

		// Create table body
		const tbody = tableEl.createEl('tbody');

		// Render rows
		table.rows.forEach((row, rowIndex) => {
			const tr = tbody.createEl('tr');

			row.forEach((cell, colIndex) => {
				const isHeader = (rowIndex === 0 && table.hasHeaderRow) ||
					(colIndex === 0 && table.hasHeaderColumn);

				const cellEl = tr.createEl(isHeader ? 'th' : 'td');
				this.renderCellContent(cellEl, cell);
				
				const alignment = TableStyler.getCellAlignment(rowIndex, colIndex, table, this.config.defaultAlignment);
				TableStyler.applyCellAlignment(cellEl, alignment);
			});
		});
	}

	private renderCellContent(cellEl: HTMLElement, content: string): void {
		const trimmedContent = content.trim();
		if (this.config.enableFormula && trimmedContent.startsWith('=')) {
			this.renderFormula(cellEl, trimmedContent);
		} else if (this.config.enableNewline && trimmedContent.includes('\\n')) {
			this.renderMultiline(cellEl, trimmedContent);
		} else {
			if (trimmedContent) cellEl.textContent = trimmedContent;
		}
	}

	private renderFormula(cellEl: HTMLElement, formula: string): void {
		// Try to evaluate simple formulas
		const result = this.evaluateFormula(formula);
		if (result !== null) {
			cellEl.textContent = result.toString();
			cellEl.addClass('formula-result');
		} else {
			cellEl.textContent = formula;
			cellEl.addClass('formula-error');
		}
		cellEl.addClass('formula-cell');
	}

	private evaluateFormula(formula: string): number | null {
		try {
			// Remove the leading '='
			const expr = formula.substring(1).trim();
			
			// Simple evaluation for basic math operations
			// This is a simplified implementation - in a real plugin you'd want a proper parser
			const sanitized = expr.replace(/[^0-9+\-*/().]/g, '');
			if (sanitized !== expr) {
				return null; // Invalid characters
			}
			
			// Simple math evaluation without using Function constructor
			// This is a basic implementation - for production use a proper math parser
			const result = this.simpleMathEval(sanitized);
			return result;
		} catch {
			return null;
		}
	}

	private simpleMathEval(expr: string): number | null {
		// Very basic math evaluation - only handles simple operations
		// For production, use a proper math expression parser
		try {
			// Handle simple numbers
			if (/^\d+(\.\d+)?$/.test(expr)) {
				return parseFloat(expr);
			}
			
			// Handle simple addition
			const addMatch = expr.match(/^(\d+(\.\d+)?)\+(\d+(\.\d+)?)$/);
			if (addMatch && addMatch[1] && addMatch[3]) {
				return parseFloat(addMatch[1]) + parseFloat(addMatch[3]);
			}
			
			// Handle simple subtraction
			const subMatch = expr.match(/^(\d+(\.\d+)?)-(\d+(\.\d+)?)$/);
			if (subMatch && subMatch[1] && subMatch[3]) {
				return parseFloat(subMatch[1]) - parseFloat(subMatch[3]);
			}
			
			// Handle simple multiplication
			const mulMatch = expr.match(/^(\d+(\.\d+)?)\*(\d+(\.\d+)?)$/);
			if (mulMatch && mulMatch[1] && mulMatch[3]) {
				return parseFloat(mulMatch[1]) * parseFloat(mulMatch[3]);
			}
			
			// Handle simple division
			const divMatch = expr.match(/^(\d+(\.\d+)?)\/(\d+(\.\d+)?)$/);
			if (divMatch && divMatch[1] && divMatch[3]) {
				const divisor = parseFloat(divMatch[3]);
				if (divisor === 0) return null; // Avoid division by zero
				return parseFloat(divMatch[1]) / divisor;
			}
			
			return null;
		} catch {
			return null;
		}
	}

	private renderMultiline(cellEl: HTMLElement, content: string): void {
		const lines = content.split('\\n');
		lines.forEach((line, index) => {
			if (index > 0) {
				cellEl.createEl('br');
			}
			cellEl.appendText(line);
		});
	}

	applyMerges(tableEl: HTMLTableElement, merges: CellMerge[]): void {
		// Clear cache before applying merges
		TableCache.clearCache(tableEl);
		
		merges.forEach(merge => {
			const startCell = this.getCell(tableEl, merge.start.row, merge.start.col);
			const endCell = this.getCell(tableEl, merge.end.row, merge.end.col);

			if (startCell && endCell) {
				// Calculate span
				const rowSpan = merge.end.row - merge.start.row + 1;
				const colSpan = merge.end.col - merge.start.col + 1;

				if (rowSpan > 1) {
					startCell.setAttribute('rowspan', rowSpan.toString());
				}
				if (colSpan > 1) {
					startCell.setAttribute('colspan', colSpan.toString());
				}

				// Hide merged cells
				for (let r = merge.start.row; r <= merge.end.row; r++) {
					for (let c = merge.start.col; c <= merge.end.col; c++) {
						if (r === merge.start.row && c === merge.start.col) continue;
						const cell = this.getCell(tableEl, r, c);
						if (cell) {
							cell.addClass('merged-cell-hidden');
						}
					}
				}
			}
		});
	}

	private getCell(tableEl: HTMLTableElement, row: number, col: number): HTMLTableCellElement | null {
		return TableCache.getCell(tableEl, row, col);
	}
}
