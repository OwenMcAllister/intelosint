import type React from "react";

interface InfoDisplayProps {
	// biome-ignore lint/suspicious/noExplicitAny: Depends on backend data
	data?: Record<string, any>;
}

export default function InfoDisplay({ data }: InfoDisplayProps) {
	if (!data) {
		return (
			<div className="fixed bottom-4 right-4 z-10 bg-gray-100 p-4 rounded-md border border-gray-300 text-gray-500 text-center">
				Nothing to preview
			</div>
		);
	}

	// biome-ignore lint/suspicious/noExplicitAny: Depends on backend data
	function renderData(obj: Record<string, any>): React.ReactNode {
		return (
			<div className="space-y-1">
				{Object.entries(obj).map(([key, value]) => {
					const displayValue = value ? String(value) : "undefined";

					return (
						<div key={key} className="flex gap-2">
							<span className="text-gray-800 font-medium min-w-[4rem]">
								{key}:
							</span>
							<span className="text-gray-700">{displayValue}</span>
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<div className="fixed bottom-4 right-4 z-10 bg-white p-4 rounded-md border border-gray-300 overflow-hidden shadow-sm">
			<div className="font-semibold text-gray-700 mb-2 border-b pb-1">
				Data Preview
			</div>
			<div className="overflow-auto text-sm font-mono max-h-48">
				{renderData(data)}
			</div>
		</div>
	);
}
