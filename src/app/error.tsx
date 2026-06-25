"use client";

import { AlertTriangle } from "lucide-react";

/**
 * Route-level error boundary — shown when the catalogue is unreachable or a
 * fetch fails, so visitors never hit a blank screen.
 */
export default function ErrorBoundary({
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 px-6 text-center text-neutral-100">
			<AlertTriangle aria-hidden="true" className="h-12 w-12 text-amber-400" />
			<h1 className="font-semibold text-2xl">Something went wrong</h1>
			<p className="max-w-sm text-neutral-400 text-sm">
				We couldn&apos;t reach the movie catalogue. Please try again.
			</p>
			<button
				className="mt-2 rounded-full bg-amber-400 px-5 py-2.5 font-semibold text-neutral-950 text-sm transition hover:bg-amber-300"
				onClick={reset}
				type="button"
			>
				Try again
			</button>
		</main>
	);
}
