import { beforeEach, describe, expect, it, vi } from "vitest";

// In-memory cookie jar standing in for the browser's cookie store (Seam 2).
const { jarRef } = vi.hoisted(() => ({
	jarRef: { current: new Map<string, string>() },
}));

vi.mock("next/headers", () => ({
	cookies: async () => ({
		get: (name: string) => {
			const value = jarRef.current.get(name);
			return value === undefined ? undefined : { name, value };
		},
		set: (name: string, value: string) => jarRef.current.set(name, value),
		delete: (name: string) => jarRef.current.delete(name),
	}),
}));

import { getWatched, toggleWatched } from "~/server/watched";

describe("watched", () => {
	beforeEach(() => {
		jarRef.current = new Map();
	});

	it("is empty when no cookie is set", async () => {
		expect([...(await getWatched())]).toEqual([]);
	});

	it("round-trips: toggling adds an id, toggling again removes it", async () => {
		await toggleWatched(27205);
		expect([...(await getWatched())]).toEqual([27205]);

		await toggleWatched(27205);
		expect([...(await getWatched())]).toEqual([]);
	});
});
