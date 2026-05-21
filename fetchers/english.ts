import * as cheerio from "cheerio";
import { Entry } from "../types";
import { fetchHtmlText } from "./shared";

const BASE_URL = "https://www.etymonline.com";
const MAX_RESULTS = 5;

export async function fetchEnglishEtymology(
	term: string,
): Promise<Entry[]> {
	const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(term)}`;
	const html = await fetchHtmlText(searchUrl, "en");
	const $ = cheerio.load(html);

	const entryPromises = $(
		'a[href^="/word/"]:not(.crossreference):not(.link)',
	)
		.slice(0, MAX_RESULTS)
		.map(async (_i, el) => {
			const $el = $(el);
			const entryTerm = $el.find("span").first().text();
			const path = $el.attr("href") as string;

			try {
				const termHtml = await fetchHtmlText(BASE_URL + path, "en");
				const $term = cheerio.load(termHtml);
				const def = $term("section.-mt-4.-mb-2.lg\\:-mb-2 > p")
					.map((_i, el) => $term(el).text())
					.get()
					.join("\n\n")
					.trim()
					.replace(/\t/g, "");

				const id = path.split("/").pop() || "";
				return {
					term: entryTerm,
					def: def || "Definition unavailable",
					path,
					id,
				} as Entry;
			} catch {
				const id = path.split("/").pop() || "";
				return {
					term: entryTerm,
					def: "Definition unavailable",
					path,
					id,
				} as Entry;
			}
		})
		.get();

	return Promise.all(entryPromises);
}

export { BASE_URL };
