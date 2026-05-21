import { App } from "obsidian";

export function getSelectedText(app: App): string {
	const editor = app.workspace.activeEditor?.editor;
	if (editor) {
		const selection = editor.getSelection();
		if (typeof selection === "string" && selection.trim()) {
			return selection.trim();
		}
	}
	const selection = document.getSelection()?.toString();
	return (selection && selection.trim()) || "";
}
