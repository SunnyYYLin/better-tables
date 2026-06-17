import {
	Plugin,
	MarkdownPostProcessorContext,
	MarkdownView,
	Notice,
} from 'obsidian';
import {
	BetterTablesSettings,
	DEFAULT_SETTINGS,
	BetterTablesSettingTab,
	settingsToConfig,
} from './settings';
import { TableRenderer } from './renderer';
import { TableStyler } from './styler';
import { TableMenu } from './menu';

export default class BetterTablesPlugin extends Plugin {
	settings!: BetterTablesSettings;
	private renderer!: TableRenderer;

	async onload() {
		await this.loadSettings();

		// Initialize renderer with settings
		this.renderer = new TableRenderer(settingsToConfig(this.settings));

		// Register markdown post processor for tables
		this.registerMarkdownPostProcessor((element: HTMLElement, context: MarkdownPostProcessorContext) => {
			this.processTables(element, context);
		});

		// Add commands
		this.addCommand({
			id: 'toggle-header-row',
			name: 'Toggle header row',
			callback: () => this.toggleHeaderRow(),
		});

		this.addCommand({
			id: 'toggle-header-column',
			name: 'Toggle header column',
			callback: () => this.toggleHeaderColumn(),
		});

		this.addCommand({
			id: 'add-table-caption',
			name: 'Add table caption',
			callback: () => this.addTableCaption(),
		});

		// Add settings tab
		this.addSettingTab(new BetterTablesSettingTab(this.app, this));
	}

	onunload() {
		// Cleanup
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<BetterTablesSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		// Update renderer with new settings
		this.renderer = new TableRenderer(settingsToConfig(this.settings));
	}

	private processTables(element: HTMLElement, context: MarkdownPostProcessorContext): void {
		if (!this.settings.enableAdvancedTables) return;

		// Find all tables in the element
		const tables = element.querySelectorAll('table');
		tables.forEach(table => {
			this.enhanceTable(table, context);
		});
	}

	private enhanceTable(tableEl: HTMLTableElement, context: MarkdownPostProcessorContext): void {
		// Add CSS class for styling
		tableEl.addClass('better-table');

		// Add drag handles for column resizing
		this.addColumnResizeHandles(tableEl);

		// Add context menu for table operations
		this.addTableContextMenu(tableEl);

		// Add caption support
		if (this.settings.enableCaption) {
			this.addCaptionSupport(tableEl, context);
		}
	}

	private addColumnResizeHandles(tableEl: HTMLTableElement): void {
		const headerCells = tableEl.querySelectorAll('th');
		headerCells.forEach((cell, index) => {
			if (index < headerCells.length - 1) {
				const handle = cell.createEl('div', {
					cls: 'column-resize-handle',
				});
				this.makeResizable(handle, cell, index, tableEl);
			}
		});
	}

	private makeResizable(handle: HTMLElement, cell: HTMLElement, colIndex: number, tableEl: HTMLTableElement): void {
		let startX: number;
		let startWidth: number;
		let isResizing = false;

		// Double-click to auto-fit column
		handle.addEventListener('dblclick', (e: MouseEvent) => {
			e.preventDefault();
			TableStyler.autoFitColumn(tableEl, colIndex);
		});

		handle.addEventListener('mousedown', (e: MouseEvent) => {
			e.preventDefault();
			isResizing = true;
			startX = e.clientX;
			startWidth = cell.offsetWidth;

			// Add resizing class to table
			tableEl.addClass('resizing');

			const onMouseMove = (e: MouseEvent) => {
				if (!isResizing) return;
				
				const width = Math.max(50, startWidth + (e.clientX - startX));
				TableStyler.setColumnWidth(tableEl, colIndex, width);
			};

			const onMouseUp = () => {
				isResizing = false;
				tableEl.removeClass('resizing');
				activeDocument.removeEventListener('mousemove', onMouseMove);
				activeDocument.removeEventListener('mouseup', onMouseUp);
			};

			activeDocument.addEventListener('mousemove', onMouseMove);
			activeDocument.addEventListener('mouseup', onMouseUp);
		});
	}

	private addTableContextMenu(tableEl: HTMLTableElement): void {
		tableEl.addEventListener('contextmenu', (e: MouseEvent) => {
			e.preventDefault();
			this.showTableMenu(tableEl, e);
		});
	}

	private showTableMenu(tableEl: HTMLTableElement, e: MouseEvent): void {
		const actions = [
			{ text: 'Toggle Header Row', action: () => this.toggleHeaderRow() },
			{ text: 'Toggle Header Column', action: () => this.toggleHeaderColumn() },
			{ text: 'Add Caption', action: () => this.addTableCaption() },
			{ text: 'Auto-fit Columns', action: () => TableStyler.autoFitColumns(tableEl) },
			{ text: 'Equal Column Width', action: () => TableStyler.equalizeColumns(tableEl) },
		];

		TableMenu.show(tableEl, e, actions);
	}

	private addCaptionSupport(tableEl: HTMLTableElement, context: MarkdownPostProcessorContext): void {
		// Check if there's a caption element before the table
		const parent = tableEl.parentElement;
		if (parent) {
			const prevSibling = tableEl.previousElementSibling;
			if (prevSibling && prevSibling.tagName === 'P') {
				const text = prevSibling.textContent?.trim();
				if (text && text.startsWith('Table:')) {
					const caption = text.substring(6).trim();
					const captionEl = tableEl.createEl('caption');
					captionEl.textContent = caption;
					prevSibling.remove();
				}
			}
		}
	}

	private toggleHeaderRow(): void {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (view) {
			// This would need to be implemented to work with the current table
			// For now, just show a notice
			new Notice('Toggle header row command executed');
		}
	}

	private toggleHeaderColumn(): void {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (view) {
			// This would need to be implemented to work with the current table
			// For now, just show a notice
			new Notice('Toggle header column command executed');
		}
	}

	private addTableCaption(): void {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (view) {
			// This would need to be implemented to work with the current table
			// For now, just show a notice
			new Notice('Add table caption command executed');
		}
	}
}