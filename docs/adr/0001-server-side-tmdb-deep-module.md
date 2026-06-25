# Server-side TMDB access through a single deep module

All access to the external movie database (TMDB) goes through one server-only
module (`src/server/tmdb`) — Server Components and Route Handlers call it; the
browser never does. We chose this over fetching TMDB directly from the client
because it keeps the API key server-side and lets the first paint be
server-rendered from the URL's `?q`/`?page` params (good first paint, shareable
URLs, SEO). The module is the *only* code that knows TMDB exists: it owns auth,
the base URL, the browse-vs-search endpoint split, and Zod-validates every
response at the boundary, so swapping the catalogue source later touches one
folder.
