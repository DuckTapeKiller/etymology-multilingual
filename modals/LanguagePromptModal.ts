import { App, Modal, setIcon } from "obsidian";
import { SupportedLanguage, LANGUAGE_LABELS } from "../types";

export class LanguagePromptModal extends Modal {
	private selection: string | undefined;
	private onSubmit: (lang: SupportedLanguage) => void;

	constructor(
		app: App,
		selection: string | undefined,
		onSubmit: (lang: SupportedLanguage) => void,
	) {
		super(app);
		this.selection = selection;
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.addClass("etymol-language-prompt");

		const iconEl = contentEl.createDiv({ cls: "etymol-modal-icon" });
		setIcon(iconEl, "bird");

		contentEl.createEl("h2", { text: "Select Language" });
		contentEl.createEl("p", {
			text: "Search etymology / Buscar etimología / Rechercher l'étymologie",
			cls: "etymol-language-subtitle",
		});

		const buttonContainer = contentEl.createDiv({
			cls: "etymol-button-container",
		});

		const languages: SupportedLanguage[] = ["en", "es", "fr"];
		const buttons: HTMLButtonElement[] = [];

		languages.forEach((lang, index) => {
			const button = buttonContainer.createEl("button", {
				text: `${index + 1}. ${LANGUAGE_LABELS[lang]}`,
				cls: "etymol-lang-button",
			});
			button.addEventListener("click", () => {
				this.onSubmit(lang);
				this.close();
			});
			buttons.push(button);
		});

		contentEl.createEl("p", {
			text: "Press 1, 2, or 3 to select quickly",
			cls: "etymol-keyboard-hint",
		});

		// Focus first button for keyboard accessibility
		setTimeout(() => buttons[0]?.focus(), 50);

		// Keyboard shortcuts: 1, 2, 3 for language selection
		this.modalEl.addEventListener("keydown", (e: KeyboardEvent) => {
			const index = parseInt(e.key) - 1;
			if (index >= 0 && index < languages.length) {
				e.preventDefault();
				this.onSubmit(languages[index]);
				this.close();
			}
		});
	}

	onClose() {
		this.contentEl.empty();
	}
}
