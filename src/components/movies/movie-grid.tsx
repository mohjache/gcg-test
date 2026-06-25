import type { Movie } from "~/server/tmdb/movies";
import { MovieCard } from "./movie-card";

export function MovieGrid({
	movies,
	genreMap,
	watchedIds,
}: {
	movies: Movie[];
	genreMap: Map<number, string>;
	watchedIds: Set<number>;
}) {
	return (
		<div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{movies.map((movie) => (
				<MovieCard
					genreMap={genreMap}
					key={movie.id}
					movie={movie}
					watched={watchedIds.has(movie.id)}
				/>
			))}
		</div>
	);
}
