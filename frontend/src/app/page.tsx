"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

export default function Home() {
	const [stars, setStars] = useState<
		{ id: number; x: number; y: number; size: number; delay: number }[]
	>([]);

	useEffect(() => {
		// Generate random stars
		const generateStars = () => {
			const newStars = [];
			for (let i = 0; i < 100; i++) {
				newStars.push({
					id: i,
					x: Math.random() * 100,
					y: Math.random() * 100,
					size: Math.random() * 3 + 1,
					delay: Math.random() * 5,
				});
			}
			setStars(newStars);
		};

		generateStars();
	}, []);

	return (
		<div className="relative min-h-screen bg-gradient-to-b from-slate-900 to-black text-white overflow-hidden">
			{/* Dynamic Star Background */}
			<div className="absolute inset-0 z-0">
				{stars.map((star) => (
					<motion.div
						key={star.id}
						className="absolute rounded-full bg-white"
						style={{
							top: `${star.y}%`,
							left: `${star.x}%`,
							width: `${star.size}px`,
							height: `${star.size}px`,
						}}
						animate={{
							opacity: [0.2, 0.8, 0.2],
							scale: [1, 1.2, 1],
						}}
						transition={{
							duration: 3 + star.delay,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
					/>
				))}
			</div>

			{/* Content */}
			<div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center max-w-6xl mx-auto space-y-20">
				<motion.h1
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
				>
					IntelOSINT Explorer
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3 }}
					className="text-2xl md:text-3xl text-slate-300 max-w-3xl"
				>
					Visualize, analyze, and explore connections in open-source
					intelligence data with our powerful graph-based visualization tool.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.6 }}
				>
					<Link href="/explore">
						<button
							type="button"
							className="px-12 py-4 text-xl bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40"
						>
							Get Started
						</button>
					</Link>
				</motion.div>
			</div>
		</div>
	);
}
