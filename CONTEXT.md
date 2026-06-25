# Martin's Movies

A movie-browsing site for the client "Martin's Movies". Their catalogue lives in
an external movie database reachable only via API. The site lets visitors browse
and search that catalogue, mark movies they've watched, and jump to a movie's
external reference page.

## Language

**Movie**:
A single film in the catalogue, identified by its database id. Carries a title,
poster, rating, genres, release year and overview.

**Catalogue**:
The full set of Movies in the external database. Never held locally — always read
through the API.

**Listing**:
The paginated grid of Movie cards that is the site's main page. Shows one page of
results at a time.

**Browse mode**:
The Listing's default state with no search term — shows the broad catalogue,
ordered by popularity.

**Search mode**:
The Listing's state when the visitor has entered a Keyword — shows Movies matching
that term instead of the broad catalogue. Browse and Search are mutually exclusive
states of the same Listing.

**Keyword**:
The free-text term a visitor types into the central search box to find Movies by
title. (The brief's "search by attribute such as Keyword".)

**Watched**:
A visitor's mark on a Movie meaning "I have seen this". Scoped to the visitor's own
browser and persists across visits in that browser. Not tied to any account.
_Avoid_: seen, favourited, saved.

**Read More**:
The per-Movie action that sends the visitor to that Movie's external reference page
(IMDB when available, otherwise the source-database page).
_Avoid_: details, view, more info.

**Genre tag**:
A human-readable genre label shown on a Movie card (e.g. "Action"). The catalogue
exposes genres as ids; the names are resolved separately.
