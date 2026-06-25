"use client";

import { Check, Eye } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { cn } from "~/lib/utils";
import { toggleWatchedAction } from "~/server/watched-actions";

/**
 * Marks a Movie as Watched. Optimistic: the button flips instantly while the
 * Server Action round-trips and rewrites the cookie (ADR-0002).
 */
export function WatchedToggle({
	movieId,
	watched,
}: {
	movieId: number;
	watched: boolean;
}) {
	const [optimisticWatched, setOptimisticWatched] = useOptimistic(watched);
	const [isPending, startTransition] = useTransition();

	function handleToggle() {
		startTransition(async () => {
			setOptimisticWatched(!optimisticWatched);
			await toggleWatchedAction(movieId);
		});
	}

	return (
		<button
			aria-pressed={optimisticWatched}
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-xs transition",
				optimisticWatched
					? "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/40"
					: "bg-white/5 text-neutral-300 ring-1 ring-white/10 hover:bg-white/10",
			)}
			disabled={isPending}
			onClick={handleToggle}
			type="button"
		>
			{optimisticWatched ? (
				<Check aria-hidden="true" className="h-3.5 w-3.5" />
			) : (
				<Eye aria-hidden="true" className="h-3.5 w-3.5" />
			)}
			{optimisticWatched ? "Watched" : "Mark watched"}
		</button>
	);
}
