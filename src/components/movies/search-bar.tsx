"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 400;

/**
 * Central Keyword search (the brief's one customization). Debounced; syncs the
 * Keyword into the URL via `replace` (one history entry per real search, not per
 * keystroke) and resets to page 1 so results stay coherent.
 */
export function SearchBar({ initialQuery }: { initialQuery: string }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const searchParamsRef = useRef(searchParams);
	searchParamsRef.current = searchParams;

	const [value, setValue] = useState(initialQuery);
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		const handle = setTimeout(() => {
			const params = new URLSearchParams(
				Array.from(searchParamsRef.current.entries()),
			);
			const trimmed = value.trim();
			if (trimmed) {
				params.set("q", trimmed);
			} else {
				params.delete("q");
			}
			params.delete("page");

			const qs = params.toString();
			router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
		}, DEBOUNCE_MS);

		return () => clearTimeout(handle);
	}, [value, pathname, router]);

	return (
		<div className="relative w-full max-w-xl">
			<Search
				aria-hidden="true"
				className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-neutral-500"
			/>
			<input
				aria-label="Search movies by keyword"
				className="w-full rounded-full border border-white/10 bg-neutral-900/80 py-3.5 pr-5 pl-12 text-base text-neutral-100 shadow-lg outline-none backdrop-blur transition placeholder:text-neutral-500 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/30"
				onChange={(event) => setValue(event.target.value)}
				placeholder="Search movies by keyword…"
				type="search"
				value={value}
			/>
		</div>
	);
}
