"use client";

import { ReactFlow, Node, Edge, Background, useNodesState, useEdgesState } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import InformationNode from "../components/info-node";
import { createNodeFromNodeInfo } from "../util/functions";

interface GraphProps {
    initialNodeInfo: NodeInfo
}

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [
    // { id: "e1-2", source: "1", target: "2", type: "smoothstep" },
];

export default function Graph({ initialNodeInfo }: GraphProps) {
    initialNodes.push(createNodeFromNodeInfo(initialNodeInfo));
    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <ReactFlow
                nodes={nodes}
                edges={initialEdges}
                nodeTypes={{ custom: InformationNode }}
            >
                <Background />
            </ReactFlow>
        </div>
    );
}