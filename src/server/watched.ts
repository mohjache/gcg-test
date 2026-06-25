import { cookies } from "next/headers";

const COOKIE_NAME = "watched";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Watched state (ADR-0002): the set of watched Movie ids lives directly in a
 * per-browser `httpOnly` cookie — no datastore. Read during server render so the
 * first paint already shows watched cards; mutated via the toggle below.
 */
export async function getWatched(): Promise<Set<number>> {
	const store = await cookies();
	const raw = store.get(COOKIE_NAME)?.value;
	if (!raw) return new Set();
	return new Set(
		raw
			.split(",")
			.filter(Boolean)
			.map(Number)
			.filter((id) => Number.isFinite(id)),
	);
}

export async function toggleWatched(id: number): Promise<void> {
	const watched = await getWatched();
	if (watched.has(id)) {
		watched.delete(id);
	} else {
		watched.add(id);
	}

	const store = await cookies();
	store.set(COOKIE_NAME, [...watched].join(","), {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		maxAge: ONE_YEAR_SECONDS,
	});
}
