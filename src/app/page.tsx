import { Suspense } from "react";
import { MovieGridSkeleton } from "~/components/movies/movie-card-skeleton";
import { MovieResults } from "~/components/movies/movie-results";
import { SearchBar } from "~/components/movies/search-bar";

type SearchParams = Record<string, string | string[] | undefined>;

function parseQuery(params: SearchParams): string {
	return typeof params.q === "string" ? params.q.trim() : "";
}

function parsePage(params: SearchParams): number {
	const raw = typeof params.page === "string" ? Number(params.page) : 1;
	return Number.isFinite(raw) && raw > 0 ? Math.trunc(raw) : 1;
}

export default async function HomePage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const params = await searchParams;
	const query = parseQuery(params);
	const page = parsePage(params);

	return (
		<main className="min-h-screen bg-[#f5f6fa] text-neutral-800">
			<header className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
				<div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-20 text-center">
					<div className="flex flex-col items-center gap-2">
						<span className="font-semibold text-white/70 text-xs uppercase tracking-[0.25em]">
							Martin&apos;s Movies
						</span>
						<h1 className="font-bold text-4xl text-white tracking-tight sm:text-5xl">
							Start browsing now
						</h1>
						<p className="max-w-md text-sm text-white/80">
							Discover movies, search by keyword, and keep track of what
							you&apos;ve watched.
						</p>
					</div>
					<SearchBar initialQuery={query} />
				</div>
			</header>

			<section className="mx-auto max-w-7xl px-6 py-12">
				<h2 className="mb-6 font-bold text-2xl text-neutral-900">
					{query ? `Results for “${query}”` : "Latest movies"}
				</h2>
				<Suspense fallback={<MovieGridSkeleton />} key={`${query}-${page}`}>
					<MovieResults page={page} query={query} />
				</Suspense>
			</section>
		</main>
	);
}
