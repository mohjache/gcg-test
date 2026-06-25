# Watched state lives in a per-browser cookie, not a datastore

The brief scopes Watched to "the same browser" with no accounts, so we store the
set of watched Movie ids directly in an `httpOnly` cookie rather than in a
server-side datastore. We considered a session cookie backed by Upstash Redis and
deliberately rejected it: it adds infrastructure and a session-identity concept
the brief never asks for, and only earns its keep once Watched must sync across
devices (which requires real accounts). The cookie is read during server render so
the first paint already shows watched cards (no flash), and is updated via a
Server Action.

Consequence: Watched does not survive a cleared browser or move between devices.
The Redis-backed version remains the documented upgrade path for when accounts
exist.
