import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "~/test/server";
import { GET } from "./route";

const TMDB = "https://api.themoviedb.org/3";

function callRoute(id: string) {
	return GET(new Request(`http://localhost/r/${id}`), {
		params: Promise.resolve({ id }),
	});
}

describe("GET /r/[id]", () => {
	it("redirects to the IMDB page when imdb_id is set", async () => {
		server.use(
			http.get(`${TMDB}/movie/27205`, () =>
				HttpResponse.json({
					id: 27205,
					title: "Inception",
					imdb_id: "tt1375666",
				}),
			),
		);

		const res = await callRoute("27205");

		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe(
			"https://www.imdb.com/title/tt1375666/",
		);
	});

	it("falls back to the TMDB page when imdb_id is absent", async () => {
		server.use(
			http.get(`${TMDB}/movie/49026`, () =>
				HttpResponse.json({ id: 49026, title: "Untitled", imdb_id: null }),
			),
		);

		const res = await callRoute("49026");

		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe(
			"https://www.themoviedb.org/movie/49026",
		);
	});
});
