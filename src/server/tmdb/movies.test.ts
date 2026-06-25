import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import {
	discoverMovies,
	getGenreMap,
	searchMovies,
} from "~/server/tmdb/movies";
import { server } from "~/test/server";

const TMDB = "https://api.themoviedb.org/3";

describe("discoverMovies", () => {
	it("returns a parsed page of movies from the discover endpoint", async () => {
		server.use(
			http.get(`${TMDB}/discover/movie`, () =>
				HttpResponse.json({
					page: 1,
					total_pages: 500,
					total_results: 10000,
					results: [
						{
							id: 27205,
							title: "Inception",
							poster_path: "/poster.jpg",
							vote_average: 8.4,
							release_date: "2010-07-16",
							overview: "A thief who steals corporate secrets...",
							genre_ids: [28, 878],
						},
					],
				}),
			),
		);

		const result = await discoverMovies(1);

		expect(result.page).toBe(1);
		expect(result.totalPages).toBe(500);
		expect(result.totalResults).toBe(10000);
		expect(result.movies).toHaveLength(1);
		expect(result.movies[0]).toMatchObject({
			id: 27205,
			title: "Inception",
			posterPath: "/poster.jpg",
			voteAverage: 8.4,
			releaseYear: 2010,
			overview: "A thief who steals corporate secrets...",
			genreIds: [28, 878],
		});
	});
});

describe("searchMovies", () => {
	it("queries the search endpoint with the keyword and page", async () => {
		let captured: URL | undefined;
		server.use(
			http.get(`${TMDB}/search/movie`, ({ request }) => {
				captured = new URL(request.url);
				return HttpResponse.json({
					page: 2,
					total_pages: 5,
					total_results: 90,
					results: [],
				});
			}),
		);

		const result = await searchMovies("batman", 2);

		expect(captured?.searchParams.get("query")).toBe("batman");
		expect(captured?.searchParams.get("page")).toBe("2");
		expect(result.page).toBe(2);
		expect(result.totalPages).toBe(5);
	});
});

describe("page clamping", () => {
	it("clamps the requested page to TMDB's 1-500 range", async () => {
		const requestedPages: (string | null)[] = [];
		server.use(
			http.get(`${TMDB}/discover/movie`, ({ request }) => {
				requestedPages.push(new URL(request.url).searchParams.get("page"));
				return HttpResponse.json({
					page: 1,
					total_pages: 500,
					total_results: 0,
					results: [],
				});
			}),
		);

		await discoverMovies(0);
		await discoverMovies(999);

		expect(requestedPages).toEqual(["1", "500"]);
	});
});

describe("getGenreMap", () => {
	it("returns a map of genre id to name", async () => {
		server.use(
			http.get(`${TMDB}/genre/movie/list`, () =>
				HttpResponse.json({
					genres: [
						{ id: 28, name: "Action" },
						{ id: 878, name: "Science Fiction" },
					],
				}),
			),
		);

		const map = await getGenreMap();

		expect(map.get(28)).toBe("Action");
		expect(map.get(878)).toBe("Science Fiction");
	});
});

describe("boundary validation", () => {
	it("rejects a malformed TMDB response rather than passing it through", async () => {
		server.use(
			http.get(`${TMDB}/discover/movie`, () =>
				HttpResponse.json({ unexpected: "shape" }),
			),
		);

		await expect(discoverMovies(1)).rejects.toThrow();
	});
});
