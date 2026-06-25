"use server";

import { revalidatePath } from "next/cache";
import { toggleWatched } from "./watched";

/**
 * Server Action binding for the optimistic Watched toggle. The core logic lives
 * in `watched.ts` (testable, no `use server`); this thin wrapper exposes it to
 * the client and revalidates the Listing so SSR reflects the new state.
 */
export async function toggleWatchedAction(id: number): Promise<void> {
	await toggleWatched(id);
	revalidatePath("/");
}
