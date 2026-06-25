# Read More resolves IMDB lazily via a redirect route

The brief asks Read More to link to IMDB "if the imdb_id is set" — but TMDB's list
endpoints (`/discover`, `/search`) do not return `imdb_id`; only the per-Movie
details endpoint does. Rather than fan out a details fetch for all 20 cards on
every page render (eager enrich), Read More points at our own `/r/[id]` route,
which fetches that one Movie's details at click time and 302-redirects to IMDB
when `imdb_id` is present, or to the TMDB page as a fallback.

Chosen because it pays the details cost only for Movies a visitor actually opens
and keeps the Listing's data fetch lean. Trade-off: the button cannot visually
distinguish Movies that have an IMDB page, because we don't know `imdb_id` at
render time — acceptable since the requirement is only about where the click
lands. Eager enrich would be required if per-card differentiation were ever wanted.
