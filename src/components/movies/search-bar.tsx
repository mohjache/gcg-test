"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 400;

/**
 * Central Keyword search (the brief's one customization). Debounced; syncs the
 * Keyword into the URL via `replace` (one history entry per real search, not per
 * keystroke) and resets to page 1 so results stay coherent. The button flushes
 * the search immediately.
 */
export function SearchBar({ initialQuery }: { initialQuery: string }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const searchParamsRef = useRef(searchParams);
	searchParamsRef.current = searchParams;

	const [value, setValue] = useState(initialQuery);
	const isFirstRender = useRef(true);

	const navigate = useCallback(
		(keyword: string) => {
			const params = new URLSearchParams(
				Array.from(searchParamsRef.current.entries()),
			);
			const trimmed = keyword.trim();
			if (trimmed) {
				params.set("q", trimmed);
			} else {
				params.delete("q");
			}
			params.delete("page");

			const qs = params.toString();
			router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
		},
		[pathname, router],
	);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		const handle = setTimeout(() => navigate(value), DEBOUNCE_MS);
		return () => clearTimeout(handle);
	}, [value, navigate]);

	return (
		<form
			className="relative w-full max-w-2xl"
			onSubmit={(event) => {
				event.preventDefault();
				navigate(value);
			}}
		>
			<input
				aria-label="Search movies by keyword"
				className="w-full rounded-md border-0 bg-white py-4 pr-16 pl-5 text-base text-neutral-800 shadow-xl outline-none transition placeholder:text-neutral-400 focus:ring-4 focus:ring-white/30"
				onChange={(event) => setValue(event.target.value)}
				placeholder="Enter movie title…"
				type="search"
				value={value}
			/>
			<button
				aria-label="Search"
				className="absolute top-1/2 right-1.5 inline-flex h-11 w-12 -translate-y-1/2 items-center justify-center rounded bg-violet-600 text-white transition hover:bg-violet-700"
				type="submit"
			>
				<Search aria-hidden="true" className="h-5 w-5" />
			</button>
		</form>
	);
}
