import { SearchX } from "lucide-react";

export function EmptyState({ query }: { query: string }) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
			<SearchX aria-hidden="true" className="h-12 w-12 text-neutral-300" />
			<h2 className="font-semibold text-neutral-800 text-xl">
				No movies found
			</h2>
			<p className="max-w-sm text-neutral-500 text-sm">
				{query
					? `Nothing matched “${query}”. Try a different keyword.`
					: "There are no movies to show right now."}
			</p>
		</div>
	);
}
