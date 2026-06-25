import { NextResponse } from "next/server";
import { getMovieDetails } from "~/server/tmdb/movies";

/**
 * Read More target (ADR-0003). TMDB list endpoints omit `imdb_id`, so we resolve
 * it lazily here — only for movies a visitor actually opens — and redirect to
 * IMDB when present, or the TMDB page as a fallback.
 */
export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const details = await getMovieDetails(Number(id));

	const destination = details.imdbId
		? `https://www.imdb.com/title/${details.imdbId}/`
		: `https://www.themoviedb.org/movie/${details.id}`;

	return NextResponse.redirect(destination, 302);
}
