import { App, PluginSettingTab, Setting } from 'obsidian';
import MyPlugin from './main';
import { TableConfig } from './types';

export interface BetterTablesSettings {
	enableAdvancedTables: boolean;
	enableHeaderRow: boolean;
	enableHeaderColumn: boolean;
	enableCellMerging: boolean;
	enableFormula: boolean;
	enableNewline: boolean;
	enableCaption: boolean;
	defaultHorizontalAlignment: 'left' | 'center' | 'right';
	defaultVerticalAlignment: 'top' | 'middle' | 'bottom';
}

export const DEFAULT_SETTINGS: BetterTablesSettings = {
	enableAdvancedTables: true,
	enableHeaderRow: true,
	enableHeaderColumn: true,
	enableCellMerging: true,
	enableFormula: true,
	enableNewline: true,
	enableCaption: true,
	defaultHorizontalAlignment: 'left',
	defaultVerticalAlignment: 'middle',
};

export function settingsToConfig(settings: BetterTablesSettings): TableConfig {
	return {
		enableMerging: settings.enableCellMerging,
		enableFormula: settings.enableFormula,
		enableNewline: settings.enableNewline,
		enableCaption: settings.enableCaption,
		defaultAlignment: {
			horizontal: settings.defaultHorizontalAlignment,
			vertical: settings.defaultVerticalAlignment,
		},
	};
}

export class BetterTablesSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl).setName('Table features').setHeading();

		new Setting(containerEl)
			.setName('Enable advanced tables')
			.setDesc('Enable advanced table features in preview mode')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableAdvancedTables)
				.onChange(async (value) => {
					this.plugin.settings.enableAdvancedTables = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Enable header row')
			.setDesc('Automatically format the first row as a header')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableHeaderRow)
				.onChange(async (value) => {
					this.plugin.settings.enableHeaderRow = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Enable header column')
			.setDesc('Automatically format the first column as a header')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableHeaderColumn)
				.onChange(async (value) => {
					this.plugin.settings.enableHeaderColumn = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Enable cell merging')
			.setDesc('Allow merging cells in tables')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableCellMerging)
				.onChange(async (value) => {
					this.plugin.settings.enableCellMerging = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Enable formula support')
			.setDesc('Support formulas in table cells (starting with =)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableFormula)
				.onChange(async (value) => {
					this.plugin.settings.enableFormula = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Enable newline in cells')
			.setDesc('Support newlines in table cells using \\n')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableNewline)
				.onChange(async (value) => {
					this.plugin.settings.enableNewline = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Enable table caption')
			.setDesc('Support table captions above the table')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableCaption)
				.onChange(async (value) => {
					this.plugin.settings.enableCaption = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Default horizontal alignment')
			.setDesc('Default horizontal alignment for table cells')
			.addDropdown(dropdown => dropdown
				.addOption('left', 'Left')
				.addOption('center', 'Center')
				.addOption('right', 'Right')
				.setValue(this.plugin.settings.defaultHorizontalAlignment)
				.onChange(async (value) => {
					this.plugin.settings.defaultHorizontalAlignment = value as 'left' | 'center' | 'right';
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Default vertical alignment')
			.setDesc('Default vertical alignment for table cells')
			.addDropdown(dropdown => dropdown
				.addOption('top', 'Top')
				.addOption('middle', 'Middle')
				.addOption('bottom', 'Bottom')
				.setValue(this.plugin.settings.defaultVerticalAlignment)
				.onChange(async (value) => {
					this.plugin.settings.defaultVerticalAlignment = value as 'top' | 'middle' | 'bottom';
					await this.plugin.saveSettings();
				}));
	}
}