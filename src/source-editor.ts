import { App, MarkdownPostProcessorContext, MarkdownView } from 'obsidian';
import { isHtmlInSection } from './html-serializer';

export interface TableSourceInfo {
	lineStart: number;
	lineEnd: number;
	text: string;
}

/**
 * Get the source line range for a table element via the post-processor context.
 */
export function getTableSourceInfo(
	context: MarkdownPostProcessorContext,
	tableEl: HTMLTableElement,
): TableSourceInfo | null {
	const info = context.getSectionInfo(tableEl);
	if (!info) return null;

	return {
		lineStart: info.lineStart,
		lineEnd: info.lineEnd,
		text: info.text,
	};
}

/**
 * Read the source text of a table from the editor.
 */
export function readTableSource(
	app: App,
	context: MarkdownPostProcessorContext,
	tableEl: HTMLTableElement,
): string | null {
	const info = getTableSourceInfo(context, tableEl);
	if (!info) return null;

	const view = app.workspace.getActiveViewOfType(MarkdownView);
	if (!view) return info.text;

	const editor = view.editor;
	const lines: string[] = [];
	for (let i = info.lineStart; i <= info.lineEnd; i++) {
		lines.push(editor.getLine(i));
	}
	return lines.join('\n');
}

/**
 * Replace the source text of a table in the editor.
 */
export function replaceTableSource(
	app: App,
	context: MarkdownPostProcessorContext,
	tableEl: HTMLTableElement,
	newContent: string,
): boolean {
	const info = getTableSourceInfo(context, tableEl);
	if (!info) return false;

	const view = app.workspace.getActiveViewOfType(MarkdownView);
	if (!view) return false;

	const editor = view.editor;
	const lastLineLength = editor.getLine(info.lineEnd)?.length ?? 0;

	editor.replaceRange(
		newContent,
		{ line: info.lineStart, ch: 0 },
		{ line: info.lineEnd, ch: lastLineLength },
	);
	return true;
}

/**
 * Check whether a table's source is HTML (vs Markdown).
 */
export function isTableFromHtmlSource(
	context: MarkdownPostProcessorContext,
	tableEl: HTMLTableElement,
): boolean {
	const info = getTableSourceInfo(context, tableEl);
	if (!info) return false;
	return isHtmlInSection(info.text);
}
