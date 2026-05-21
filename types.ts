export type SupportedLanguage = "en" | "es" | "fr";

export interface Entry {
	term: string;
	def: string;
	path: string;
	id: string;
}

export interface EtymologyResult {
	source: string;
	content: string | null;
}

export interface EtymologyPluginSettings {
	defaultLanguage: SupportedLanguage | "ask";
	dictionaryFolder: string;
	dictionaryProperty: string;
	cacheDurationMinutes: number;
}

export const DEFAULT_SETTINGS: EtymologyPluginSettings = {
	defaultLanguage: "ask",
	dictionaryFolder: "",
	dictionaryProperty: "Etimología",
	cacheDurationMinutes: 30,
};

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
	en: "English",
	es: "Español",
	fr: "Français",
};
