import { tmdbFetch } from "./client";
import {
	type TmdbMovie,
	tmdbGenreListSchema,
	tmdbMovieDetailsSchema,
	tmdbPageSchema,
} from "./schemas";

export interface Movie {
	id: number;
	title: string;
	posterPath: string | null;
	voteAverage: number;
	releaseYear: number | null;
	overview: string;
	genreIds: number[];
}

export interface MoviePage {
	movies: Movie[];
	page: number;
	totalPages: number;
	totalResults: number;
}

/** TMDB paginates from 1 and caps navigation at page 500. */
function clampPage(page: number): number {
	if (!Number.isFinite(page)) return 1;
	return Math.min(500, Math.max(1, Math.trunc(page)));
}

function toMovie(raw: TmdbMovie): Movie {
	return {
		id: raw.id,
		title: raw.title,
		posterPath: raw.poster_path,
		voteAverage: raw.vote_average,
		releaseYear: raw.release_date ? Number(raw.release_date.slice(0, 4)) : null,
		overview: raw.overview,
		genreIds: raw.genre_ids,
	};
}

function toMoviePage(data: unknown): MoviePage {
	const parsed = tmdbPageSchema.parse(data);
	return {
		movies: parsed.results.map(toMovie),
		page: parsed.page,
		totalPages: parsed.total_pages,
		totalResults: parsed.total_results,
	};
}

/** Browse mode: the broad catalogue, ordered by popularity. */
export async function discoverMovies(page: number): Promise<MoviePage> {
	const data = await tmdbFetch("/discover/movie", {
		sort_by: "popularity.desc",
		page: clampPage(page),
	});
	return toMoviePage(data);
}

/** Search mode: movies matching a free-text keyword by title. */
export async function searchMovies(
	keyword: string,
	page: number,
): Promise<MoviePage> {
	const data = await tmdbFetch("/search/movie", {
		query: keyword,
		page: clampPage(page),
	});
	return toMoviePage(data);
}

export interface MovieDetails {
	id: number;
	title: string;
	imdbId: string | null;
}

/** Per-movie details — the only place `imdb_id` is available (ADR-0003). */
export async function getMovieDetails(id: number): Promise<MovieDetails> {
	const data = await tmdbFetch(`/movie/${id}`);
	const parsed = tmdbMovieDetailsSchema.parse(data);
	return { id: parsed.id, title: parsed.title, imdbId: parsed.imdb_id };
}

/** Resolves genre ids to names; the card maps its genreIds through this. */
export async function getGenreMap(): Promise<Map<number, string>> {
	const data = await tmdbFetch("/genre/movie/list");
	const parsed = tmdbGenreListSchema.parse(data);
	return new Map(parsed.genres.map((genre) => [genre.id, genre.name]));
}
