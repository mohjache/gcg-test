import { env } from "~/env";

const BASE_URL = "https://api.themoviedb.org/3";

/**
 * The single point where TMDB is reached (ADR-0001). Owns base URL, v3 api_key
 * injection, and error mapping. Nothing above this module knows TMDB exists.
 */
export async function tmdbFetch(
	path: string,
	params: Record<string, string | number> = {},
): Promise<unknown> {
	const url = new URL(`${BASE_URL}${path}`);
	url.searchParams.set("api_key", env.TMDB_API_KEY);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, String(value));
	}

	const res = await fetch(url, {
		// TMDB data is near-static; cache aggressively (ignored outside Next).
		next: { revalidate: 60 * 60 },
	});

	if (!res.ok) {
		throw new Error(`TMDB request failed (${res.status}) for ${path}`);
	}

	return res.json();
}
