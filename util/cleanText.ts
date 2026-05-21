export function cleanText(text: string): string {
	return text
		.replace(/[ \t]+/g, " ")
		.replace(/(\r?\n){3,}/g, "\n\n")
		.trim();
}
