import { requestUrl } from "obsidian";

const DEFAULT_HEADERS: Record<string, string> = {
	"User-Agent":
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
};

const LANG_ACCEPT: Record<string, string> = {
	en: "en-US,en;q=0.8",
	es: "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
	fr: "fr-FR,fr;q=0.8,en-US;q=0.5,en;q=0.3",
};

export async function fetchHtmlText(
	url: string,
	lang = "en",
): Promise<string> {
	const response = await requestUrl({
		url,
		headers: {
			...DEFAULT_HEADERS,
			"Accept-Language": LANG_ACCEPT[lang] || LANG_ACCEPT.en,
		},
	});

	if (response.status !== 200) {
		throw new Error(`HTTP ${response.status} fetching ${url}`);
	}

	return response.text;
}

export async function fetchPage(
	url: string,
	lang = "en",
): Promise<Document> {
	const text = await fetchHtmlText(url, lang);
	const parser = new DOMParser();
	return parser.parseFromString(text, "text/html");
}

export async function fetchPageArrayBuffer(
	url: string,
	lang = "en",
): Promise<ArrayBuffer> {
	const response = await requestUrl({
		url,
		headers: {
			...DEFAULT_HEADERS,
			"Accept-Language": LANG_ACCEPT[lang] || LANG_ACCEPT.en,
		},
	});

	if (response.status !== 200) {
		throw new Error(`HTTP ${response.status} fetching ${url}`);
	}

	return response.arrayBuffer;
}
