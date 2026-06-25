# PRD: Martin's Movies — Paginated Listing, Search & Watched

Status: ready-for-agent

## Problem Statement

Martin's Movies has moved its entire catalogue into an external movie database that is only reachable via an API. They currently have no way for customers to browse or find those movies, no way to mark which ones they've already seen, and no path from a movie to its authoritative reference page. They need a customer-facing website that makes the catalogue browsable, searchable, and personal to each visitor's browser.

## Solution

A server-rendered web app presenting the catalogue as a paginated grid of movie cards in a dark, cinematic theme. Visitors browse popularity-ordered movies by default, narrow them with a central keyword search box, page through results with shareable URLs, mark movies as **Watched** (remembered in their own browser across visits), and use **Read More** to jump to a movie's IMDB page (or the source-database page when no IMDB reference exists).

## User Stories

1. As a customer, I want to see a paginated grid of movies on the main page, so that I can browse the catalogue without being overwhelmed.
2. As a customer, I want the default Listing ordered by popularity, so that the most relevant movies surface first.
3. As a customer, I want each card to show poster, title, rating out of 10, genre tags, release year and a short overview, so that I can judge a movie at a glance.
4. As a customer, I want to move between pages with numbered pagination, so that I can navigate the catalogue predictably.
5. As a customer, I want the page I'm on reflected in the URL, so that I can bookmark or share an exact page.
6. As a customer, I want a central search box, so that I can find movies by keyword instead of scrolling.
7. As a customer, I want results to update as I type (debounced), so that searching feels immediate without a submit step.
8. As a customer, I want my search term reflected in the URL, so that I can share or revisit a search.
9. As a customer, I want a new search to return me to the first page of results, so that I never land on an out-of-range or stale page.
10. As a customer, I want to page through search results the same way as the browse grid, so that the experience is consistent.
11. As a customer, I want to mark a movie as Watched, so that I can keep track of what I've seen.
12. As a customer, I want a Watched movie to stay marked when I reopen the site in the same browser, so that my history persists across visits.
13. As a customer, I want Watched movies to appear already marked on the first paint, so that I don't see them flicker from unwatched to watched.
14. As a customer, I want marking Watched to feel instant, so that the interface stays responsive even while it saves.
15. As a customer, I want to unmark a movie as Watched, so that I can correct a mistake.
16. As a customer, I want a Read More action on each movie, so that I can reach its authoritative reference page.
17. As a customer, I want Read More to take me to IMDB when the movie has an IMDB reference, so that I get the page I expect.
18. As a customer, I want Read More to still take me somewhere useful (the source-database page) when there's no IMDB reference, so that the action never dead-ends.
19. As a customer, I want missing data (no poster, no overview, no release date) handled gracefully, so that cards never look broken.
20. As a customer, I want a clear "no results" state when a search matches nothing, so that I understand the empty grid.
21. As a customer, I want a friendly error state if the catalogue is temporarily unreachable, so that I'm not left with a blank screen.
22. As a customer on a phone, I want the grid to reflow responsively, so that the site is usable on any device.
23. As a customer, I want genre labels shown as names rather than codes, so that the tags are meaningful.
24. As the site owner (Martin), I want the design to match the movie-grid theme I liked with a central search input added, so that the site feels like the product I envisioned.
25. As a developer, I want the catalogue's API key kept server-side, so that it is never exposed in the browser.
26. As a developer, I want all catalogue access behind one module, so that the source database can be swapped with minimal change.
27. As a developer, I want API responses validated at the boundary, so that upstream changes fail loudly rather than corrupting the UI.
28. As a developer, I want invalid or out-of-range page parameters clamped/guarded, so that hand-edited URLs can't break the page.

## Implementation Decisions

- **Architecture (ADR-0001):** Hybrid Next.js App Router. Server Components read the URL's `?q`/`?page` params and render the first paint; only interactive concerns are client islands. No client-side data-fetching library.
- **Deep TMDB module (ADR-0001):** A single server-only module is the only code aware of TMDB. Public interface: `discoverMovies(page)`, `searchMovies(keyword, page)`, `getMovieDetails(id)`, `getGenreMap()`. It owns auth, base URL, the browse-vs-search endpoint split, page clamping, and returns clean typed domain objects.
- **TMDB auth:** v3 API key, query-string, server-only, validated in the project's env schema.
- **Browse vs Search are mutually exclusive:** absent keyword -> `/discover/movie` (`popularity.desc`); present keyword -> `/search/movie`. The endpoints can't be unified (search ignores discover's sort/filter params); the module encapsulates the switch.
- **Genre tags:** `getGenreMap()` resolves genre ids -> names from a heavily-cached lookup; cards render names.
- **Posters:** built via `next/image` against a hardcoded image base + `w500` size (deliberate simplification over reading `/configuration`).
- **Pagination:** numbered, state carried in the URL, clamped to TMDB's 1-500.
- **Search:** debounced (~400ms) live search that updates the URL via `replace` (one history entry per real search, not per keystroke) and resets `page` to 1; a `<Suspense>` boundary keyed on `q`+`page` shows a skeleton during refetch.
- **Watched (ADR-0002):** The set of watched movie ids is stored directly in an `httpOnly` cookie — no datastore. Read during server render (eliminates the unwatched->watched flash); mutated through a Server Action paired with optimistic UI. A session-cookie + Redis design was considered and rejected as out-of-scope for per-browser persistence; it remains the documented cross-device upgrade path.
- **Read More (ADR-0003):** Because TMDB list endpoints omit `imdb_id`, Read More links to an owned `/r/[id]` route that fetches that one movie's details at click time and 302-redirects to IMDB when `imdb_id` is set, else to the TMDB page. Details are fetched only for movies a visitor actually opens.
- **Validation:** Zod schemas validate every TMDB response at the module boundary, producing trustworthy domain types.

## Testing Decisions

- **What makes a good test here:** assert external, observable behavior through a module's public interface — never its internals. Mock only true external dependencies; drive real code end-to-end.
- **Seam 1 — TMDB HTTP boundary:** mock outbound `fetch` to TMDB and exercise the real `server/tmdb` public API. Covers browse-vs-search selection, page clamping (1-500), Zod parsing of canned TMDB JSON, and genre-id->name mapping. The `/r/[id]` redirect is tested through this same seam (it calls the real `getMovieDetails`): assert 302->IMDB when `imdb_id` present, 302->TMDB fallback when absent.
- **Seam 2 — cookie store:** fake `next/headers` `cookies()` and test the real `watched` module's public surface — read returns the set; toggle adds/removes an id and round-trips.
- **No internal mocks between our own modules; no UI/component tests** (deliberately the lower-value end and out of scope).
- **Tooling:** Vitest (newly introduced — no existing test runner). No prior art in this greenfield repo; these tests establish the pattern.

## Out of Scope

- User accounts / authentication; cross-device sync of Watched (cookie is per-browser only — Redis-backed sync is the noted future path).
- Sorting/filtering controls beyond the default popularity browse order.
- Literal TMDB "keyword entity" search (`with_keywords`); keyword maps to free-text title search.
- Searching by attributes other than keyword (year, genre, person) — the brief's "such as Keyword" is read as keyword-first.
- A bespoke movie detail page (Read More goes to the external reference, not an internal page).
- UI/component and end-to-end browser tests.
- Reading TMDB `/configuration` for image base/sizes (hardcoded instead).
- GitHub repo and Vercel deployment (owned by the developer).

## Further Notes

- Domain vocabulary is fixed in `CONTEXT.md` (Movie, Catalogue, Listing, Browse mode, Search mode, Keyword, Watched, Read More, Genre tag) and used throughout.
- Three ADRs back the non-obvious decisions: `0001` (server-side deep TMDB module), `0002` (cookie-based Watched, Redis rejected), `0003` (lazy IMDB redirect because list endpoints omit `imdb_id`).
- These PRD sections seed NOTES.md (required deliverable): Problem/Solution + assumptions -> "interpreting the brief"; Implementation Decisions + ADRs -> "architecture"; Out of Scope -> "what I'd do differently / with more time".
- `TMDB_API_KEY` must be added locally (developer will provide at first live fetch) and to the deployment environment.
