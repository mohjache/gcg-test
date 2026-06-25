const IMAGE_BASE = "https://image.tmdb.org/t/p";

type PosterSize = "w342" | "w500" | "w780";

/**
 * Builds a TMDB poster URL. The image base/sizes are hardcoded rather than read
 * from TMDB's `/configuration` endpoint — a deliberate simplification (see NOTES).
 * Returns null when the movie has no poster, so callers can show a placeholder.
 */
export function posterUrl(
	path: string | null,
	size: PosterSize = "w500",
): string | null {
	return path ? `${IMAGE_BASE}/${size}${path}` : null;
}
