function CardSkeleton() {
	return (
		<div className="overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5">
			<div className="aspect-[2/3] animate-pulse bg-neutral-800" />
			<div className="flex flex-col gap-2 p-4">
				<div className="h-4 w-3/4 animate-pulse rounded bg-neutral-800" />
				<div className="h-3 w-1/2 animate-pulse rounded bg-neutral-800" />
				<div className="h-3 w-full animate-pulse rounded bg-neutral-800" />
			</div>
		</div>
	);
}

/** Suspense fallback for the Listing while a Browse/Search fetch is in flight. */
export function MovieGridSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{Array.from({ length: 20 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
				<CardSkeleton key={index} />
			))}
		</div>
	);
}
