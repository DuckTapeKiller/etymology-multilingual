import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import {
	EtymologyPluginSettings,
	LANGUAGE_LABELS,
	SupportedLanguage,
} from "./types";
import type EtymologyLookupPlugin from "./main";

export class EtymologySettingTab extends PluginSettingTab {
	plugin: EtymologyLookupPlugin;

	constructor(app: App, plugin: EtymologyLookupPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Etymology Multilingual" });

		new Setting(containerEl)
			.setName("Default language")
			.setDesc(
				"Skip the language prompt and always search in this language.",
			)
			.addDropdown((dropdown) => {
				dropdown.addOption("ask", "Always ask");
				(
					Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]
				).forEach((lang) => {
					dropdown.addOption(lang, LANGUAGE_LABELS[lang]);
				});
				dropdown.setValue(this.plugin.settings.defaultLanguage);
				dropdown.onChange(async (value) => {
					this.plugin.settings.defaultLanguage =
						value as SupportedLanguage | "ask";
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Cache duration (minutes)")
			.setDesc(
				"How long to keep etymology results in memory. Set to 0 to disable caching.",
			)
			.addText((text) => {
				text.setPlaceholder("30");
				text.setValue(
					String(this.plugin.settings.cacheDurationMinutes),
				);
				text.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num) && num >= 0) {
						this.plugin.settings.cacheDurationMinutes = num;
						await this.plugin.saveSettings();
					}
				});
			});

		new Setting(containerEl)
			.setName("Clear cache")
			.setDesc("Clear all cached etymology results from memory.")
			.addButton((button) => {
				button.setButtonText("Clear");
				button.onClick(() => {
					this.plugin.cache.clear();
					new Notice("Etymology cache cleared.");
				});
			});

		containerEl.createEl("h3", { text: "Dictionary Integration" });
		containerEl.createEl("p", {
			text: "Save etymology definitions directly into your dictionary notes' frontmatter.",
			cls: "setting-item-description",
		});

		new Setting(containerEl)
			.setName("Dictionary folder")
			.setDesc(
				'Path to the folder containing your dictionary notes (e.g. "Diccionario"). Leave empty to disable.',
			)
			.addText((text) => {
				text.setPlaceholder("path/to/dictionary");
				text.setValue(this.plugin.settings.dictionaryFolder);
				text.onChange(async (value) => {
					this.plugin.settings.dictionaryFolder = value.trim();
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Dictionary property")
			.setDesc(
				"The frontmatter property name where etymology will be saved.",
			)
			.addText((text) => {
				text.setPlaceholder("Etimología");
				text.setValue(this.plugin.settings.dictionaryProperty);
				text.onChange(async (value) => {
					this.plugin.settings.dictionaryProperty = value.trim();
					await this.plugin.saveSettings();
				});
			});
	}
}
