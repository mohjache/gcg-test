import { ExternalLink, Film, Star } from "lucide-react";
import Image from "next/image";
import { posterUrl } from "~/lib/tmdb-image";
import type { Movie } from "~/server/tmdb/movies";
import { WatchedToggle } from "./watched-toggle";

export function MovieCard({
	movie,
	genreMap,
	watched,
}: {
	movie: Movie;
	genreMap: Map<number, string>;
	watched: boolean;
}) {
	const poster = posterUrl(movie.posterPath);
	const genres = movie.genreIds
		.map((id) => genreMap.get(id))
		.filter((name): name is string => Boolean(name))
		.slice(0, 2);

	return (
		<article className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:shadow-xl">
			<div className="relative aspect-[2/3] overflow-hidden bg-neutral-100">
				{poster ? (
					<Image
						alt={`${movie.title} poster`}
						className="object-cover transition duration-500 group-hover:scale-105"
						fill
						sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
						src={poster}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center text-neutral-300">
						<Film aria-hidden="true" className="h-12 w-12" />
					</div>
				)}

				{watched && (
					<span className="absolute top-3 left-3 rounded-full bg-violet-600 px-2.5 py-1 font-semibold text-[11px] text-white shadow">
						Watched
					</span>
				)}

				<div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
					<a
						className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 font-semibold text-sm text-white shadow-lg transition hover:bg-violet-700"
						href={`/r/${movie.id}`}
						rel="noopener noreferrer"
						target="_blank"
					>
						Read More
						<ExternalLink aria-hidden="true" className="h-4 w-4" />
					</a>
				</div>
			</div>

			<div className="flex flex-1 flex-col gap-2 p-4">
				<div className="flex items-start justify-between gap-2">
					<h3 className="font-semibold text-neutral-900 leading-snug">
						{movie.title}
					</h3>
					{movie.voteAverage > 0 && (
						<span className="flex shrink-0 items-center gap-1 font-semibold text-sm text-violet-600">
							<Star
								aria-hidden="true"
								className="h-3.5 w-3.5 fill-violet-500 text-violet-500"
							/>
							{movie.voteAverage.toFixed(1)}
						</span>
					)}
				</div>

				<div className="flex items-center gap-2 text-neutral-500 text-xs">
					{movie.releaseYear && <span>{movie.releaseYear}</span>}
					{genres.length > 0 && (
						<>
							<span aria-hidden="true">•</span>
							<span>{genres.join(", ")}</span>
						</>
					)}
				</div>

				{movie.overview && (
					<p className="line-clamp-3 text-neutral-600 text-sm">
						{movie.overview}
					</p>
				)}

				<div className="mt-auto pt-2">
					<WatchedToggle movieId={movie.id} watched={watched} />
				</div>
			</div>
		</article>
	);
}
