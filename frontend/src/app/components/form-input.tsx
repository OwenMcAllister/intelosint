import type { ChangeEvent } from "react";

interface InputProps {
	value: string;
	setValue: (value: string) => void;
	message?: string;
	className?: string;
}

export default function Input({
	value,
	setValue,
	message,
	className = "",
}: InputProps) {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	return (
		<input
			type="text"
			value={value}
			onChange={handleChange}
			placeholder={message || "Enter text..."}
			className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 
        bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 ${className}`}
		/>
	);
}
