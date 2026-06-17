import { TableData, CellPosition, CellMerge } from './types';

export class TableOperations {
	static toggleHeaderRow(table: TableData): TableData {
		return {
			...table,
			hasHeaderRow: !table.hasHeaderRow,
		};
	}

	static toggleHeaderColumn(table: TableData): TableData {
		return {
			...table,
			hasHeaderColumn: !table.hasHeaderColumn,
		};
	}

	static setCaption(table: TableData, caption: string): TableData {
		return {
			...table,
			caption,
		};
	}

	static addRow(table: TableData, afterIndex: number): TableData {
		const firstRow = table.rows[0];
		if (!firstRow) return table;

		const newRow = Array.from<string>({ length: firstRow.length }).fill('');
		const newRows = [...table.rows];
		newRows.splice(afterIndex + 1, 0, newRow);

		return {
			...table,
			rows: newRows,
		};
	}

	static addColumn(table: TableData, afterIndex: number): TableData {
		const newRows = table.rows.map(row => {
			const newRow = [...row];
			newRow.splice(afterIndex + 1, 0, '');
			return newRow;
		});

		return {
			...table,
			rows: newRows,
		};
	}

	static deleteRow(table: TableData, index: number): TableData {
		if (table.rows.length <= 1) return table;

		const newRows = [...table.rows];
		newRows.splice(index, 1);

		return {
			...table,
			rows: newRows,
		};
	}

	static deleteColumn(table: TableData, index: number): TableData {
		const firstRow = table.rows[0];
		if (!firstRow || firstRow.length <= 1) return table;

		const newRows = table.rows.map(row => {
			const newRow = [...row];
			newRow.splice(index, 1);
			return newRow;
		});

		return {
			...table,
			rows: newRows,
		};
	}

	static updateCell(table: TableData, position: CellPosition, value: string): TableData {
		const newRows = table.rows.map((row, rowIndex) => {
			if (rowIndex !== position.row) return row;
			return row.map((cell, colIndex) => {
				if (colIndex !== position.col) return cell;
				return value;
			});
		});

		return {
			...table,
			rows: newRows,
		};
	}

	static mergeCells(table: TableData, merges: CellMerge[], start: CellPosition, end: CellPosition): { table: TableData; merges: CellMerge[] } {
		// Validate merge range
		if (start.row > end.row || start.col > end.col) {
			return { table, merges };
		}

		// Check if merge is valid
		if (!TableOperations.isValidMerge(merges, start, end)) {
			return { table, merges };
		}

		return {
			table,
			merges: [...merges, { start, end }],
		};
	}

	static unmergeCells(merges: CellMerge[], position: CellPosition): CellMerge[] {
		return merges.filter(merge =>
			!(position.row >= merge.start.row &&
				position.row <= merge.end.row &&
				position.col >= merge.start.col &&
				position.col <= merge.end.col)
		);
	}

	private static isValidMerge(merges: CellMerge[], start: CellPosition, end: CellPosition): boolean {
		for (const merge of merges) {
			// Check for overlap
			if (start.row <= merge.end.row &&
				end.row >= merge.start.row &&
				start.col <= merge.end.col &&
				end.col >= merge.start.col) {
				return false;
			}
		}
		return true;
	}
}