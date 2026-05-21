import { fetchEnglishEtymology } from "../fetchers/english";

describe("Etymology search", () => {
	test("should return capped results for 'something'", async () => {
		const SEARCH_TERM = "something";
		const entries = await fetchEnglishEtymology(SEARCH_TERM);

		console.log(`Found ${entries.length} entries for '${SEARCH_TERM}'`);
		console.log("First entry:", JSON.stringify(entries[0], null, 2));

		expect(entries.length).toBeGreaterThan(0);
		expect(entries.length).toBeLessThanOrEqual(5);
		expect(entries[0]).toHaveProperty("term");
		expect(entries[0]).toHaveProperty("def");
		expect(entries[0]).toHaveProperty("path");
		expect(entries[0]).toHaveProperty("id");
		expect(entries[0].term.length).toBeGreaterThan(0);
		expect(entries[0].def.length).toBeGreaterThan(0);
		expect(entries[0].path.length).toBeGreaterThan(0);
		expect(entries[0].id.length).toBeGreaterThan(0);
	}, 30000);
});
