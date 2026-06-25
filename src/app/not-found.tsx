import { Film } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f6fa] px-6 text-center text-neutral-800">
			<Film aria-hidden="true" className="h-12 w-12 text-violet-600" />
			<h1 className="font-semibold text-2xl">Page not found</h1>
			<p className="max-w-sm text-neutral-500 text-sm">
				The page you&apos;re looking for doesn&apos;t exist.
			</p>
			<Link
				className="mt-2 rounded-full bg-violet-600 px-5 py-2.5 font-semibold text-sm text-white transition hover:bg-violet-700"
				href="/"
			>
				Back to movies
			</Link>
		</main>
	);
}
