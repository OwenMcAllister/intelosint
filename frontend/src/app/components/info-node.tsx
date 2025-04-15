import { Handle, type NodeProps, Position } from "@xyflow/react";
import { useState } from "react";
import type { InfoNode } from "../util/types";

export default function InformationNode({ data }: NodeProps<InfoNode>) {
	const [searched, setSearched] = useState<boolean>(data.isSearched || false);

	function handleRequest() {
		data.onSearch();
		setSearched(true);
	}

	return (
		<>
			<Handle type="target" position={Position.Top} isConnectable={false} />
			<div
				className="p-3.5 border border-gray-300 rounded-full bg-gray-100 h-24 w-24 flex flex-col justify-center items-center"
				onMouseEnter={() => data.onMouseEnter?.()}
				onMouseLeave={() => data.onMouseLeave?.()}
			>
				<div className={`block mx-auto text-center ${searched && "text-lg"}`}>
					{data.name}
				</div>
				{!searched && (
					<button
						type="button"
						className="mx-auto block px-2 py-1 bg-gray-600 text-white text-xs rounded-full hover:bg-gray-700"
						onClick={handleRequest}
					>
						Search
					</button>
				)}
			</div>
			<Handle type="source" position={Position.Bottom} isConnectable={false} />
		</>
	);
}
