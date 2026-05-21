import { Plugin } from "obsidian";
import {
	EtymologyPluginSettings,
	DEFAULT_SETTINGS,
	SupportedLanguage,
} from "./types";
import { EtymologySettingTab } from "./settings";
import { LanguagePromptModal } from "./modals/LanguagePromptModal";
import { EtymologyLookupModal } from "./modals/EtymologyLookupModal";
import { EtymologyCache } from "./util/cache";
import { getSelectedText } from "./util/getSelectedText";
import { ellipsis } from "./util/ellipsis";

export default class EtymologyLookupPlugin extends Plugin {
	settings: EtymologyPluginSettings = DEFAULT_SETTINGS;
	cache: EtymologyCache = new EtymologyCache();

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new EtymologySettingTab(this.app, this));

		// Add ribbon icon for etymology lookup
		this.addRibbonIcon("bird", "Etymology Lookup", () => {
			const selection = getSelectedText(this.app);
			this.startLookup(selection);
		});

		// Add command for etymology search
		this.addCommand({
			id: "search",
			name: "Search Etymology",
			callback: () => {
				const selection = getSelectedText(this.app);
				this.startLookup(selection);
			},
		});

		// Register context menu event
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor) => {
				const selection = editor.getSelection();
				if (selection) {
					menu.addItem((item) => {
						item.setTitle(
							`Get etymology of "${ellipsis(selection, 18)}"`,
						).onClick(() => {
							this.startLookup(selection);
						});
					});
				}
			}),
		);
	}

	onunload() {
		this.cache.clear();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
		this.cache = new EtymologyCache(
			this.settings.cacheDurationMinutes,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.cache.updateTTL(this.settings.cacheDurationMinutes);
	}

	private startLookup(selection: string | undefined) {
		if (!selection) return;

		if (this.settings.defaultLanguage !== "ask") {
			this.openEtymologyModal(
				selection,
				this.settings.defaultLanguage,
			);
			return;
		}

		new LanguagePromptModal(
			this.app,
			selection,
			(lang: SupportedLanguage) => {
				this.openEtymologyModal(selection, lang);
			},
		).open();
	}

	private openEtymologyModal(word: string, lang: SupportedLanguage) {
		new EtymologyLookupModal(
			this.app,
			word,
			lang,
			this.cache,
			this.settings,
		).open();
	}
}
