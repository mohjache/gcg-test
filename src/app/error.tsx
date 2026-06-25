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
		<main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f6fa] px-6 text-center text-neutral-800">
			<AlertTriangle aria-hidden="true" className="h-12 w-12 text-violet-600" />
			<h1 className="font-semibold text-2xl">Something went wrong</h1>
			<p className="max-w-sm text-neutral-500 text-sm">
				We couldn&apos;t reach the movie catalogue. Please try again.
			</p>
			<button
				className="mt-2 rounded-full bg-violet-600 px-5 py-2.5 font-semibold text-sm text-white transition hover:bg-violet-700"
				onClick={reset}
				type="button"
			>
				Try again
			</button>
		</main>
	);
}
