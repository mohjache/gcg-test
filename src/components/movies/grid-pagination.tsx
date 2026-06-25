import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";

function pageHref(page: number, query: string): string {
	const params = new URLSearchParams();
	if (query) params.set("q", query);
	if (page > 1) params.set("page", String(page));
	const qs = params.toString();
	return qs ? `/?${qs}` : "/";
}

function pageWindow(current: number, total: number): number[] {
	const span = 2;
	const start = Math.max(1, current - span);
	const end = Math.min(total, current + span);
	const pages: number[] = [];
	for (let page = start; page <= end; page += 1) {
		pages.push(page);
	}
	return pages;
}

const baseItem =
	"inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 font-medium text-sm transition";

export function GridPagination({
	currentPage,
	totalPages,
	query,
}: {
	currentPage: number;
	totalPages: number;
	query: string;
}) {
	if (totalPages <= 1) return null;

	const pages = pageWindow(currentPage, totalPages);
	const hasPrev = currentPage > 1;
	const hasNext = currentPage < totalPages;

	return (
		<nav
			aria-label="Pagination"
			className="mt-12 flex items-center justify-center gap-2"
		>
			{hasPrev ? (
				<Link
					aria-label="Previous page"
					className={cn(
						baseItem,
						"bg-white text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-100",
					)}
					href={pageHref(currentPage - 1, query)}
				>
					<ChevronLeft aria-hidden="true" className="h-4 w-4" />
				</Link>
			) : (
				<span
					aria-hidden="true"
					className={cn(baseItem, "cursor-not-allowed text-neutral-300")}
				>
					<ChevronLeft className="h-4 w-4" />
				</span>
			)}

			{pages.map((page) => {
				const isCurrent = page === currentPage;
				return (
					<Link
						aria-current={isCurrent ? "page" : undefined}
						aria-label={`Page ${page}`}
						className={cn(
							baseItem,
							isCurrent
								? "bg-violet-600 text-white"
								: "bg-white text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-100",
						)}
						href={pageHref(page, query)}
						key={page}
					>
						{page}
					</Link>
				);
			})}

			{hasNext ? (
				<Link
					aria-label="Next page"
					className={cn(
						baseItem,
						"bg-white text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-100",
					)}
					href={pageHref(currentPage + 1, query)}
				>
					<ChevronRight aria-hidden="true" className="h-4 w-4" />
				</Link>
			) : (
				<span
					aria-hidden="true"
					className={cn(baseItem, "cursor-not-allowed text-neutral-300")}
				>
					<ChevronRight className="h-4 w-4" />
				</span>
			)}
		</nav>
	);
}
