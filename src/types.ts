export interface TableData {
	rows: string[][];
	hasHeaderRow: boolean;
	hasHeaderColumn: boolean;
	caption?: string;
}

export interface CellPosition {
	row: number;
	col: number;
}

export interface CellMerge {
	start: CellPosition;
	end: CellPosition;
}

export interface TableAlignment {
	horizontal: 'left' | 'center' | 'right';
	vertical: 'top' | 'middle' | 'bottom';
}

export interface TableConfig {
	enableMerging: boolean;
	enableFormula: boolean;
	enableNewline: boolean;
	enableCaption: boolean;
	defaultAlignment: TableAlignment;
}