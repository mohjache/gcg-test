import {
	discoverMovies,
	getGenreMap,
	searchMovies,
} from "~/server/tmdb/movies";
import { getWatched } from "~/server/watched";
import { EmptyState } from "./empty-state";
import { GridPagination } from "./grid-pagination";
import { MovieGrid } from "./movie-grid";

const MAX_PAGE = 500;

/**
 * Async Server Component holding the Listing's data fetch. Suspends (keyed on
 * Keyword + page) so the page shell paints immediately. Browse vs Search is
 * chosen here; genres and Watched are fetched in parallel.
 */
export async function MovieResults({
	query,
	page,
}: {
	query: string;
	page: number;
}) {
	const [moviePage, genreMap, watchedIds] = await Promise.all([
		query ? searchMovies(query, page) : discoverMovies(page),
		getGenreMap(),
		getWatched(),
	]);

	if (moviePage.movies.length === 0) {
		return <EmptyState query={query} />;
	}

	return (
		<>
			<MovieGrid
				genreMap={genreMap}
				movies={moviePage.movies}
				watchedIds={watchedIds}
			/>
			<GridPagination
				currentPage={moviePage.page}
				query={query}
				totalPages={Math.min(moviePage.totalPages, MAX_PAGE)}
			/>
		</>
	);
}
