import { TableData, CellPosition, TableAlignment, CellMerge } from './types';
import { TableOperations } from './operations';

export class TableEditor {
	private table: TableData;
	private container: HTMLElement;
	private merges: CellMerge[] = [];

	constructor(table: TableData, container: HTMLElement) {
		this.table = table;
		this.container = container;
	}

	toggleHeaderRow(): void {
		this.table = TableOperations.toggleHeaderRow(this.table);
		this.refreshTable();
	}

	toggleHeaderColumn(): void {
		this.table = TableOperations.toggleHeaderColumn(this.table);
		this.refreshTable();
	}

	setCellAlignment(position: CellPosition, alignment: TableAlignment): void {
		// This would require storing alignment per cell
		// For now, just refresh the table
		this.refreshTable();
	}

	setCaption(caption: string): void {
		this.table = TableOperations.setCaption(this.table, caption);
		this.refreshTable();
	}

	addRow(afterIndex: number): void {
		this.table = TableOperations.addRow(this.table, afterIndex);
		this.refreshTable();
	}

	addColumn(afterIndex: number): void {
		this.table = TableOperations.addColumn(this.table, afterIndex);
		this.refreshTable();
	}

	deleteRow(index: number): void {
		this.table = TableOperations.deleteRow(this.table, index);
		this.refreshTable();
	}

	deleteColumn(index: number): void {
		this.table = TableOperations.deleteColumn(this.table, index);
		this.refreshTable();
	}

	updateCell(position: CellPosition, value: string): void {
		this.table = TableOperations.updateCell(this.table, position, value);
	}

	mergeCells(start: CellPosition, end: CellPosition): void {
		const result = TableOperations.mergeCells(this.table, this.merges, start, end);
		this.table = result.table;
		this.merges = result.merges;
		this.refreshTable();
	}

	unmergeCells(position: CellPosition): void {
		this.merges = TableOperations.unmergeCells(this.merges, position);
		this.refreshTable();
	}

	getMerges(): CellMerge[] {
		return [...this.merges];
	}

	getTable(): TableData {
		return this.table;
	}

	private refreshTable(): void {
		// This would trigger a re-render
		// Implementation depends on how the plugin manages state
	}
}