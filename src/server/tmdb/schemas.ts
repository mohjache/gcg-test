import { z } from "zod";

/**
 * Validates TMDB responses at the boundary (ADR-0001) so upstream drift fails
 * loudly instead of corrupting the UI.
 */
export const tmdbMovieSchema = z.object({
	id: z.number(),
	title: z.string(),
	poster_path: z.string().nullable().default(null),
	vote_average: z.number().default(0),
	release_date: z.string().default(""),
	overview: z.string().default(""),
	genre_ids: z.array(z.number()).default([]),
});

export const tmdbPageSchema = z.object({
	page: z.number(),
	total_pages: z.number(),
	total_results: z.number(),
	results: z.array(tmdbMovieSchema),
});

export const tmdbGenreListSchema = z.object({
	genres: z.array(z.object({ id: z.number(), name: z.string() })),
});

export const tmdbMovieDetailsSchema = z.object({
	id: z.number(),
	title: z.string(),
	imdb_id: z.string().nullable().default(null),
});

export type TmdbMovie = z.infer<typeof tmdbMovieSchema>;
