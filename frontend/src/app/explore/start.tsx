"use client";

import React, { type FormEvent, useState, useEffect } from "react";
import { motion } from "motion/react";
import Input from "../components/form-input";
import FormButton from "../components/form-button";

interface StartProps {
	onQuery: (data: { query: string }) => void;
}

export default function Start({ onQuery }: StartProps) {
	const [query, setQuery] = useState("");
	const [stars, setStars] = useState<
		{ id: number; x: number; y: number; size: number; delay: number }[]
	>([]);

	useEffect(() => {
		const generateStars = () => {
			const newStars = [];
			for (let i = 0; i < 50; i++) {
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

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const input = query.trim();
		if (input) {
			onQuery({ query: input });
		}
	};

	return (
		<div className="relative min-h-screen bg-gradient-to-b from-slate-900 to-black text-white overflow-hidden">
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

			<div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
				<motion.h1
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-8"
				>
					Explore Data
				</motion.h1>

				<motion.form
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3 }}
					onSubmit={handleSubmit}
					className="w-full max-w-md space-y-4"
				>
					<Input
						value={query}
						setValue={setQuery}
						message="Search for entities, connections, or topics..."
					/>
					<FormButton display="Search" />
				</motion.form>
			</div>
		</div>
	);
}
