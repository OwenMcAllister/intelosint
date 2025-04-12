import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { useState } from "react";

interface InformationNodeData extends Record<string, string | Object | undefined> {
    label: string;
    info?: Object;
    isSearched?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export default function InformationNode({ data }: NodeProps<Node<InformationNodeData, string>>) {

    const [searched, setSearched] = useState<boolean>(data.isSearched || false);

    function handleRequest() {
        // send request to backend or something

        setSearched(true);
        console.log(`Button clicked on ${data.label}`);
    }

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div
                className="p-3.5 border border-black rounded-md bg-blue-200 space-y-1.5"
                onMouseEnter={() => data.onMouseEnter && data.onMouseEnter()}
                onMouseLeave={() => data.onMouseLeave && data.onMouseLeave()}
            >
                <div>{data.label}</div>
                {!searched &&
                    <button
                        type="button"
                        className="mx-auto block px-2 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600"
                        onClick={handleRequest}
                    >
                        Search
                    </button>
                }

            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
}