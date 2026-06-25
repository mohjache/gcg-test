import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
	title: "Martin's Movies",
	description: "Browse, search, and track movies from Martin's Movies.",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html className={`${geist.variable}`} lang="en">
			<body className="bg-[#f5f6fa] font-sans text-neutral-800 antialiased">
				{children}
			</body>
		</html>
	);
}
