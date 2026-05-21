import { App, Notice, TFile, TFolder } from "obsidian";

export async function saveEtymologyToDictionary(
	app: App,
	word: string,
	etymology: string,
	folderPath: string,
	propertyName: string,
): Promise<boolean> {
	if (!folderPath) {
		new Notice("Dictionary folder not configured. Set it in plugin settings.");
		return false;
	}

	const folder = app.vault.getAbstractFileByPath(folderPath);
	if (!folder || !(folder instanceof TFolder)) {
		new Notice(`Folder "${folderPath}" not found.`);
		return false;
	}

	const files = folder.children.filter(
		(f): f is TFile => f instanceof TFile && f.extension === "md",
	);

	const matchingFile = files.find(
		(f) => f.basename.toLowerCase() === word.toLowerCase(),
	);

	if (!matchingFile) {
		new Notice(`No note matching "${word}" found in "${folderPath}".`);
		return false;
	}

	await app.fileManager.processFrontMatter(matchingFile, (fm) => {
		fm[propertyName] = etymology;
	});

	new Notice(`Etymology saved to "${matchingFile.basename}".`);
	return true;
}
