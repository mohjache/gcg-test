# GCGHealth Test -Martin's Movies

A paginated, searchable movie listing built on Next.js (App Router) against The
Movie Database (TMDB) API, with per-browser "watched" tracking and a Read More
link that resolves to IMDB.

- **Live app:** [HERE](https://gcg-test.vercel.app/)
- **Design reference:** [Movify movie-grid](https://gnodesign.com/templates/movify/movie-grid3.html) (light, purple-blue) + a central search input
- **Decisions & assumptions:** see [`NOTES.md`](./NOTES.md), the domain glossary in [`CONTEXT.md`](./CONTEXT.md), and ADRs in [`docs/adr/`](./docs/adr/)
- Theres some linting errors from ShadCN given the nature of the test I've left them for now but I usually would ensure we setup commit hooks with linting and typechecking if we are using Agents heaviliy in a codebase

## Stack

- **Next.js (App Router only)** — server-rendered listing, URL-driven state
- **[@t3-oss/env-nextjs](https://env.t3.gg/)** — env vars validated with Zod at build, so a missing `TMDB_API_KEY` fails the build, not production
- **Tailwind CSS v4 + shadcn/ui** — component layer
- **Zod** — validates every TMDB response at the boundary
- **Vitest + MSW** — tests against mocked external boundaries
- **Biome** — lint/format

## How this was built

This project was built with **Claude Code** driving a deliberately structured
workflow rather than ad-hoc prompting. The journey, in order:

1. **Scaffold** with `create-t3-app` — App Router only, plus `@t3-oss/env-nextjs`
   to guarantee env values at build time.
2. **Push to GitHub** and **set up Vercel** for deployment.
3. **Add shadcn/ui** components, fix integration issues, and deploy.
4. **Install [Matt Pocock's skills](https://github.com/mattpocock/skills)** to have
   structured discussions with Claude about the implementation.
5. **`/setup-matt-pocock-skills`** to configure issue tracking — local markdown
   docs were chosen for this use case (see [`docs/agents/`](./docs/agents/)).
6. **`/grill-with-docs`** — a back-and-forth with Claude that interrogates the
   spec one decision at a time before any code is written. Hard-to-reverse
   decisions were captured as **ADRs**.
7. **`/to-prd`** — produces a PRD artifact for the work (treated as ephemeral; see
   [`.scratch/martins-movies/PRD.md`](./.scratch/martins-movies/PRD.md)).
8. **`/tdd`** — consumes the PRD and builds the functionality as tracer bullets,
   each backed by a test (one failing test → minimal code → repeat).

The point of the workflow: resolve ambiguity and record decisions *before*
implementing, then build test-first so the core logic is verified as it lands.

## Local development

```bash
pnpm install
# add your TMDB v3 API key:
echo "TMDB_API_KEY=<your-key>" >> .env
pnpm dev        # http://localhost:3000
pnpm test       # Vitest suite
pnpm build      # production build
```

## Project layout

```
src/
  app/page.tsx              Listing (Server Component): reads ?q & ?page
  app/r/[id]/route.ts       Read More → lazy IMDB/TMDB redirect
  server/tmdb/              Deep module: the only code that knows TMDB exists
  server/watched.ts         Per-browser watched state (cookie)
  components/movies/        Grid, card, search bar, pagination, skeleton
```

> This product uses the TMDB API but is not endorsed or certified by TMDB.


raw notes:

```
create t3 app only app router and t3-env to guarantee env values
push to GitHub
setup vercel deploy
setup shadcn components and add all fix any issues and deploy 
setup mattpocock skills so I can have discussions with claude on implementation
https://github.com/mattpocock/skills
used /setup-skills to configure issue tracking (using local docs for this usecase)
use /grill-with-docs to enter a back and forth conversation with claude on implementation based on the spec.
this might produce ADR for hard to revert changes or decisions 
/to-prd to produce artifact for work which is considered ephemeral
ran /tdd which took in the prd and and then created tracer-bullets of functionality that are backed by tests for implementation

thoughts?
are we legally allowed to store/query imdb data? Commercial licensing?
rate limits seemed to be remove but can we add some kind of caching layer? whats to stop them from adding it back and we don't know?
api doesn't seem to be able to mark movies on your watchlist as watched?
using v3
imdb id doesn't seem to exist on list view therefore we defer to when details are asked for
assumption on push to main is good enough for now
```