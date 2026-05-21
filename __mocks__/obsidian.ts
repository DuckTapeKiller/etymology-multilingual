export interface RequestUrlResponse {
	status: number;
	text: string;
	arrayBuffer: ArrayBuffer;
}

/** Overrides obsidian's requestUrl and uses native fetch, to enable isolated testing in GH actions */
export const requestUrl = async ({
	url,
	headers,
}: {
	url: string;
	headers?: Record<string, string>;
}): Promise<RequestUrlResponse> => {
	const response = await fetch(url, { headers });
	const cloned = response.clone();
	const text = await cloned.text();
	const arrayBuffer = await response.arrayBuffer();
	return {
		status: response.status,
		text,
		arrayBuffer,
	};
};
