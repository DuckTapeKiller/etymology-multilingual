import { fetchPage } from "./shared";
import { EtymologyResult } from "../types";
import { cleanText } from "../util/cleanText";

export async function fetchFrenchEtymology(
	word: string,
): Promise<EtymologyResult[]> {
	const [wiktionary, cnrtl] = await Promise.all([
		fetchWiktionary(word),
		fetchCNRTL(word),
	]);

	return [
		{ source: "Wiktionnaire", content: wiktionary },
		{ source: "CNRTL", content: cnrtl },
	];
}

async function fetchWiktionary(word: string): Promise<string | null> {
	try {
		const url = `https://fr.wiktionary.org/wiki/${encodeURIComponent(word)}`;
		const doc = await fetchPage(url, "fr");

		const etymologySection = doc.querySelector(
			"#Étymologie, #Etymologie",
		);
		if (!etymologySection) return null;

		let etymologyText = "";
		let nextElement = etymologySection.nextElementSibling;

		while (
			nextElement &&
			!["h2", "h3"].includes(nextElement.tagName.toLowerCase())
		) {
			const text = nextElement.textContent?.trim();
			if (text) etymologyText += text + "\n";
			nextElement = nextElement.nextElementSibling;
		}

		return cleanText(etymologyText) || null;
	} catch (error) {
		console.error(
			"Error fetching French etymology from Wiktionnaire:",
			error,
		);
		return null;
	}
}

async function fetchCNRTL(word: string): Promise<string | null> {
	try {
		const url = `https://www.cnrtl.fr/etymologie/${encodeURIComponent(word)}`;
		const doc = await fetchPage(url, "fr");

		const etymologyDiv = doc.querySelector("div.tlf_cvedette + b");
		if (!etymologyDiv) return null;

		let etymologyText = "";
		let currentElement: Element | null = etymologyDiv.parentElement;

		while (currentElement && currentElement.id !== "contentbox") {
			const text = currentElement.textContent?.trim();
			if (text) etymologyText += text + "\n";
			currentElement = currentElement.nextElementSibling;
		}

		return cleanText(etymologyText) || null;
	} catch (error) {
		console.error("Error fetching French etymology from CNRTL:", error);
		return null;
	}
}
