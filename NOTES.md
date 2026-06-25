# NOTES — Martin's Movies

A paginated, searchable movie listing built on Next.js (App Router) against The
Movie Database (TMDB) API, with per-browser "watched" tracking and a Read More
link that resolves to IMDB.

Domain language is pinned in [`CONTEXT.md`](./CONTEXT.md); the non-obvious
decisions have short ADRs in [`docs/adr/`](./docs/adr/).

---

## 1. How I interpreted the brief & assumptions

The brief is deliberately open in a few places. My readings:

- **"Pull all data from their new database" → browse via TMDB `/discover/movie`,
  ordered by popularity.** This is the closest thing to "the whole catalogue"
  with sorting + pagination. Curated lists like `/movie/popular` are subsets, so
  I avoided them.
- **"Search by attribute such as Keyword" → free-text title search via
  `/search/movie`.** "Keyword" is read as what a user types into a central box,
  not TMDB's formal keyword-entity system (`with_keywords`). Browse and Search are
  treated as mutually exclusive states of the same Listing — the two TMDB
  endpoints can't be unified (search ignores discover's sort/filter params).
- **"Mark as watched … same browser" → a per-browser cookie, no accounts.** The
  brief explicitly scopes persistence to the browser and mentions no login, so I
  did **not** build a database or auth. See ADR-0002.
- **"Read More → IMDB if `imdb_id` is set."** TMDB's list endpoints **don't
  return `imdb_id`** (only the per-movie details endpoint does). Rather than fetch
  details for all 20 cards on every page, Read More points at an internal
  `/r/[id]` route that resolves `imdb_id` at click time and redirects to IMDB, or
  to the TMDB page as a fallback. This is the brief's main hidden seam — see
  ADR-0003.
- **Theme:** the Movify `movie-grid3` reference is treated as a design *direction*
  (dark, poster-forward grid, rating, genre tags, hover Read More), reimplemented
  cleanly with Tailwind rather than cloned pixel-for-pixel, plus the central
  search input Martin asked for.

Pagination state and the search keyword live entirely in the **URL**
(`/?q=…&page=…`) so pages and searches are shareable and server-rendered.

## 2. Architecture & why

- **Hybrid App Router (ADR-0001).** Server Components read `?q`/`?page` and render
  the first paint from the server; only three things are client components
  (search bar, watched toggle, that's it). No client data-fetching library.
- **One deep TMDB module (`src/server/tmdb`).** It is the *only* code that knows
  TMDB exists — base URL, v3 `api_key` injection, the browse-vs-search split, page
  clamping (1–500), and **Zod validation of every response at the boundary**. The
  rest of the app calls `discoverMovies` / `searchMovies` / `getMovieDetails` /
  `getGenreMap` and receives clean typed domain objects. Swapping the catalogue
  source later touches one folder.
- **API key stays server-side.** All fetches run on the server, so `TMDB_API_KEY`
  never reaches the browser. It's validated through the existing T3
  `src/env.js` schema so a missing key fails the build, not production.
- **Watched in a cookie (ADR-0002).** Watched movie ids are stored directly in an
  `httpOnly` cookie, read during SSR (so the first paint already shows watched
  cards — no flash), and toggled through a Server Action with `useOptimistic` for
  an instant flip.
- **Lazy IMDB redirect (ADR-0003).** `/r/[id]` fetches one movie's details on
  demand and 302s to IMDB or TMDB. Details are only fetched for movies a visitor
  actually opens.
- **Genres** are resolved id→name via a cached `getGenreMap()`; **posters** use
  `next/image` against a hardcoded image base + `w500` (a deliberate
  simplification over reading TMDB's `/configuration`).

Layout: `app/page.tsx` (Listing) · `app/r/[id]/route.ts` (redirect) ·
`server/tmdb/*` (deep module) · `server/watched.ts` + `watched-actions.ts` ·
`components/movies/*` (grid, card, search bar, pagination, skeleton) ·
`app/error.tsx` + `app/not-found.tsx`.

## 3. How I used AI tools

This project was built with **Claude Code** driving a structured workflow rather
than ad-hoc prompting. What that looked like concretely:

- **Interrogating the brief before coding.** I ran a "grilling" pass where the
  model walked the design tree one decision at a time (data-fetching shape →
  persistence → TMDB endpoints → pagination → search → IMDB link → theme →
  testing) and had to recommend and justify each choice. This is where the
  ambiguities got resolved deliberately instead of by accident.
- **Where I overrode it.** The model initially proposed (and I briefly accepted)
  a session-cookie + Upstash Redis store for watched state. I pushed back —
  the brief only needs per-browser persistence — and we **dropped Redis entirely**
  for a plain cookie. The model had also pasted in a `Redis.fromEnv()` snippet; I
  had it verify against my actual `.env`, where it caught that my vars were
  Vercel-KV-named, not the `UPSTASH_*` names that helper expects. Both course
  corrections are recorded in ADR-0002.
- **Where it helped most.** It found the real trap in the brief: that TMDB list
  endpoints omit `imdb_id`, which forced the lazy `/r/[id]` design (ADR-0003). I'd
  have hit that at implementation time otherwise.
- **Recording decisions.** Domain terms went into `CONTEXT.md` and the
  hard-to-reverse choices into ADRs as they were made, so this NOTES file is a
  summary of decisions already written down, not a reconstruction.
- **Test-first build.** The data layer, redirect, and watched logic were built
  TDD — one failing test → minimal code → repeat — with the model writing each
  test against the public interface. I kept it honest about *seams*: mock only the
  external boundaries (TMDB HTTP via MSW, the cookie store), never internal
  collaborators (see section below).
- **Generated UI, my styling direction.** The model produced the grid/card/search
  components; I steered the visual language (dark, amber accent, poster-forward)
  toward the Movify reference.

## 4. Testing

Tests assert **observable behavior through public interfaces** and mock only true
external dependencies, so they survive refactors. Two seams, zero internal mocks:

- **TMDB HTTP boundary (MSW).** Drives the real `server/tmdb` module: browse vs
  search routing, page clamping, Zod parsing, genre mapping, and malformed-
  response rejection. The `/r/[id]` redirect is tested *through* this same seam
  (it calls the real `getMovieDetails`): IMDB when `imdb_id` is set, TMDB fallback
  when not.
- **Cookie store.** Fakes `next/headers` and exercises `watched.ts`: empty by
  default, add/remove round-trip.

Run with `pnpm test`. UI/component tests were deliberately left out as low-value
for this scope.

## 5. What I'd do differently / add with more time

- **Cross-device watched state.** The cookie is per-browser by design; with real
  accounts I'd promote it to the session + Upstash Redis store that ADR-0002
  documents as the upgrade path.
- **Richer search/filters.** Sort controls and filtering by year/genre/person —
  "search by attribute" hints at more than keyword. Browse mode already uses
  `/discover`, which supports these.
- **A proper movie detail page** instead of bouncing straight out to IMDB, with
  cast, trailers, and similar titles.
- **Read TMDB `/configuration`** for image base/sizes instead of hardcoding, and
  add a couple of component/E2E tests (the search→URL→grid round-trip) now that
  the core logic is covered.
- **Genre map caching** could move to a single module-level memo; right now it's a
  per-request cached fetch.

---

### Running locally

1. `pnpm install`
2. Add `TMDB_API_KEY=<your v3 key>` to `.env`
3. `pnpm dev` → http://localhost:3000
4. `pnpm test` for the suite
