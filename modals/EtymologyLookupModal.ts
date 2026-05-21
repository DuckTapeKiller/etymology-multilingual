import { App, Modal, Notice, setIcon } from "obsidian";
import {
	SupportedLanguage,
	Entry,
	EtymologyResult,
	EtymologyPluginSettings,
} from "../types";
import { fetchEnglishEtymology, BASE_URL } from "../fetchers/english";
import { fetchSpanishEtymology } from "../fetchers/spanish";
import { fetchFrenchEtymology } from "../fetchers/french";
import { EtymologyCache } from "../util/cache";
import { saveEtymologyToDictionary } from "../util/dictionaryUtils";

export class EtymologyLookupModal extends Modal {
	private word: string;
	private lang: SupportedLanguage;
	private cache: EtymologyCache;
	private settings: EtymologyPluginSettings;

	constructor(
		app: App,
		word: string,
		lang: SupportedLanguage,
		cache: EtymologyCache,
		settings: EtymologyPluginSettings,
	) {
		super(app);
		this.word = word;
		this.lang = lang;
		this.cache = cache;
		this.settings = settings;
	}

	async onOpen() {
		const { contentEl, modalEl } = this;
		contentEl.addClass("etymol-modal-content");
		modalEl.addClass("etymol-modal");

		// Show loading spinner with bird icon
		const loadingEl = contentEl.createDiv({ cls: "etymol-loading" });
		const loadingIconEl = loadingEl.createDiv({ cls: "etymol-modal-icon" });
		setIcon(loadingIconEl, "bird");
		loadingEl.createDiv({ cls: "etymol-spinner" });
		loadingEl.createEl("p", {
			text: "Searching...",
			cls: "etymol-loading-text",
		});

		const searchTerm = this.word.trim().toLowerCase();
		const cacheKey = `${this.lang}:${searchTerm}`;

		try {
			if (this.lang === "en") {
				let entries = this.cache.get<Entry[]>(cacheKey);
				if (!entries) {
					entries = await fetchEnglishEtymology(searchTerm);
					this.cache.set(cacheKey, entries);
				}
				contentEl.empty();
				contentEl.addClass("etymol-modal-content");
				this.addBirdIcon(contentEl);
				this.renderEnglishResults(entries, searchTerm);
			} else if (this.lang === "es") {
				let results = this.cache.get<EtymologyResult[]>(cacheKey);
				if (!results) {
					results = await fetchSpanishEtymology(searchTerm);
					this.cache.set(cacheKey, results);
				}
				contentEl.empty();
				contentEl.addClass("etymol-modal-content");
				this.addBirdIcon(contentEl);
				this.renderMultiSourceResults(
					results,
					searchTerm,
					"No se ha encontrado la etimología.",
				);
			} else if (this.lang === "fr") {
				let results = this.cache.get<EtymologyResult[]>(cacheKey);
				if (!results) {
					results = await fetchFrenchEtymology(searchTerm);
					this.cache.set(cacheKey, results);
				}
				contentEl.empty();
				contentEl.addClass("etymol-modal-content");
				this.addBirdIcon(contentEl);
				this.renderMultiSourceResults(
					results,
					searchTerm,
					"Aucune étymologie trouvée.",
				);
			}
		} catch (error) {
			contentEl.empty();
			contentEl.addClass("etymol-modal-content");
			this.addBirdIcon(contentEl);
			contentEl.createEl("p", {
				text: "Search failed. Are you connected to the internet?",
				cls: "etymol-error",
			});
			console.error("Etymology lookup error:", error);
		}
	}

	private renderEnglishResults(entries: Entry[], searchTerm: string) {
		const { contentEl } = this;

		if (!entries.length) {
			contentEl.createEl("p", {
				text: "No etymology results found.",
			});
			return;
		}

		const infoSpan = contentEl.createEl("span", { cls: "etymol-info" });
		infoSpan.appendText("Results from ");
		const linkEl = infoSpan.createEl("a");
		linkEl.href = `${BASE_URL}/search?q=${searchTerm}`;
		linkEl.innerText = "Online Etymology Dictionary";

		const listEl = contentEl.createEl("ul", { cls: "etymol-entries" });

		entries.forEach((entry) => {
			const itemEl = listEl.createEl("li", { cls: "etymol-entry" });

			itemEl.createEl("p", {
				text: entry.term,
				cls: "etymol-entry-title",
			});

			itemEl.createEl("p", {
				text: entry.def,
				cls: "etymol-entry-def",
			});

			const actionsEl = itemEl.createDiv({ cls: "etymol-actions" });
			this.addActionButtons(actionsEl, entry.def, searchTerm);
		});
	}

	private renderMultiSourceResults(
		results: EtymologyResult[],
		searchTerm: string,
		notFoundText: string,
	) {
		const { contentEl } = this;

		contentEl.createEl("h1", {
			text: searchTerm,
			cls: "etymol-word-heading",
		});

		results.forEach((result) => {
			contentEl.createEl("h3", {
				text: result.source,
				cls: "etymol-source-heading",
			});

			const text = result.content ?? notFoundText;
			contentEl.createEl("div", {
				text,
				cls: "etymol-source-text",
			});

			if (result.content) {
				const actionsEl = contentEl.createDiv({
					cls: "etymol-actions",
				});
				this.addActionButtons(
					actionsEl,
					result.content,
					searchTerm,
				);
			}
		});
	}

	private addActionButtons(
		container: HTMLElement,
		text: string,
		word: string,
	) {
		// Copy button
		const copyBtn = container.createEl("button", {
			cls: "etymol-action-btn",
		});
		copyBtn.createSvg("svg", {
			attr: {
				xmlns: "http://www.w3.org/2000/svg",
				width: "14",
				height: "14",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "2",
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
			},
		});
		copyBtn.appendText(" Copy");
		const copySvg = copyBtn.querySelector("svg");
		if (copySvg) {
			copySvg.innerHTML =
				'<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
		}
		copyBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			navigator.clipboard.writeText(text);
			new Notice("Copied!");
		});

		// Insert at cursor button
		const insertBtn = container.createEl("button", {
			cls: "etymol-action-btn",
		});
		insertBtn.createSvg("svg", {
			attr: {
				xmlns: "http://www.w3.org/2000/svg",
				width: "14",
				height: "14",
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "2",
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
			},
		});
		insertBtn.appendText(" Paste at cursor");
		const insertSvg = insertBtn.querySelector("svg");
		if (insertSvg) {
			insertSvg.innerHTML =
				'<path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>';
		}
		insertBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			const editor = this.app.workspace.activeEditor?.editor;
			if (editor) {
				editor.replaceSelection(text);
				new Notice("Inserted!");
				this.close();
			} else {
				new Notice("No active editor found.");
			}
		});

		// Save to dictionary button (only shown if dictionary folder is configured)
		if (this.settings.dictionaryFolder) {
			const saveBtn = container.createEl("button", {
				cls: "etymol-action-btn etymol-action-btn-save",
			});
			saveBtn.createSvg("svg", {
				attr: {
					xmlns: "http://www.w3.org/2000/svg",
					width: "14",
					height: "14",
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					"stroke-linecap": "round",
					"stroke-linejoin": "round",
				},
			});
			saveBtn.appendText(" Save to dictionary");
			const saveSvg = saveBtn.querySelector("svg");
			if (saveSvg) {
				saveSvg.innerHTML =
					'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>';
			}
			saveBtn.addEventListener("click", async (e) => {
				e.stopPropagation();
				await saveEtymologyToDictionary(
					this.app,
					word,
					text,
					this.settings.dictionaryFolder,
					this.settings.dictionaryProperty,
				);
			});
		}
	}

	private addBirdIcon(container: HTMLElement) {
		const iconEl = container.createDiv({ cls: "etymol-modal-icon" });
		setIcon(iconEl, "bird");
	}

	onClose() {
		this.contentEl.empty();
	}
}
