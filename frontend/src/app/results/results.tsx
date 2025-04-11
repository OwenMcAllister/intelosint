"use client";

import React from "react";
import { ReactFlow, Node, Edge, Background, NodeProps, useNodesState, Handle, Position } from "@xyflow/react";
import '@xyflow/react/dist/style.css';


const CustomNode = ({ data }: NodeProps<Node<Record<string, string>, string>>) => {
    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div style={{ padding: 10, border: "1px solid black", borderRadius: 5, backgroundColor: "lightblue" }}>
                <div>{data.label}</div>
                <button onClick={() => alert(`Button clicked on ${data.label}`)}>Click Me</button>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
};

// Initial Nodes and Edges
const initialNodes: Node[] = [
    { id: "1", type: "custom", data: { label: "Node 1" }, position: { x: 100, y: 100 } },
    { id: "2", type: "custom", data: { label: "Node 2" }, position: { x: 400, y: 300 } },
];

const initialEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", type: "smoothstep" },
];

export default function Results() {
    const [nodes, setNodes] = useNodesState(initialNodes);

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <ReactFlow
                nodes={nodes}
                edges={initialEdges}
                nodeTypes={{ custom: CustomNode }}
            >
                <Background />
            </ReactFlow>
        </div>
    );
}