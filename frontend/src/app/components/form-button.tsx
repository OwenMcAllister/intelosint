interface FormButtonProps {
	display: string;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	className?: string;
}

export default function FormButton({
	display,
	onClick,
	type = "submit",
	className = "",
}: FormButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			className={`w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
        font-medium transition-colors shadow-lg shadow-blue-500/30 
        hover:shadow-blue-600/40 ${className}`}
		>
			{display}
		</button>
	);
}
