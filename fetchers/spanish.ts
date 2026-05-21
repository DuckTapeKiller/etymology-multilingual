import { fetchPage, fetchPageArrayBuffer } from "./shared";
import { EtymologyResult } from "../types";
import { cleanText } from "../util/cleanText";

export async function fetchSpanishEtymology(
	word: string,
): Promise<EtymologyResult[]> {
	const [dpd, dle, deChile] = await Promise.all([
		fetchDPD(word),
		fetchDLE(word),
		fetchDeChile(word),
	]);

	return [
		{ source: "DPD (RAE)", content: dpd },
		{ source: "DLE (RAE)", content: dle },
		{ source: "Diccionario Etimológico de Chile", content: deChile },
	];
}

async function fetchDPD(word: string): Promise<string | null> {
	try {
		const url = `https://www.rae.es/dpd/${encodeURIComponent(word)}`;
		const doc = await fetchPage(url, "es");

		const sections = Array.from(doc.querySelectorAll("section"));
		for (const section of sections) {
			const header = section.querySelector("h2");
			if (
				header &&
				header.textContent?.trim().toLowerCase() === "etimología"
			) {
				const text = section.textContent
					?.replace(/^etimología\s*/i, "")
					.trim();
				if (text) return text;
			}
		}

		const firstSenseP = doc.querySelector("p[data-heading='sense']");
		if (firstSenseP) {
			const text = firstSenseP.textContent?.trim();
			if (text) return text;
		}

		return null;
	} catch (error) {
		console.error("Error fetching Spanish etymology from DPD:", error);
		return null;
	}
}

async function fetchDLE(word: string): Promise<string | null> {
	try {
		const url = `https://dle.rae.es/${encodeURIComponent(word)}`;
		const doc = await fetchPage(url, "es");

		const section = doc.querySelector("section.c-section");
		if (section) {
			const etimDiv = section.querySelector("div.n2.c-text-intro");
			if (etimDiv) {
				return etimDiv.textContent?.trim() || null;
			}
		}

		return null;
	} catch (error) {
		console.error("Error fetching Spanish etymology from DLE:", error);
		return null;
	}
}

async function fetchDeChile(word: string): Promise<string | null> {
	try {
		const url = `https://etimologias.dechile.net/?${encodeURIComponent(word)}`;
		const buffer = await fetchPageArrayBuffer(url, "es");
		const text = new TextDecoder("windows-1252").decode(
			new Uint8Array(buffer),
		);

		const parser = new DOMParser();
		const doc = parser.parseFromString(text, "text/html");

		const h3Elements = Array.from(doc.querySelectorAll("h3"));
		let targetH3: Element | null = null;

		for (const h3 of h3Elements) {
			if (h3.textContent?.trim().toLowerCase() === word.toLowerCase()) {
				targetH3 = h3;
				break;
			}
		}

		if (!targetH3) return null;

		const etymologyTexts: string[] = [];
		let sibling = targetH3.nextElementSibling;

		while (sibling && sibling.tagName.toLowerCase() === "p") {
			const siblingText = sibling.textContent?.trim();
			if (siblingText) etymologyTexts.push(cleanText(siblingText));
			sibling = sibling.nextElementSibling;
		}

		if (etymologyTexts.length === 0) return null;

		return etymologyTexts.join("\n\n");
	} catch (error) {
		console.error(
			"Error fetching Spanish etymology from DeChile:",
			error,
		);
		return null;
	}
}
