"use client";

import { ReactFlow, Node, Edge, Background } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import InformationNode from "../components/info-node";

interface GraphProps {
    initialNodes: Node[];
    initialEdges: Edge[];
}

export default function Graph({ initialNodes, initialEdges }: GraphProps) {

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
                nodeTypes={{ custom: InformationNode }}
                nodesDraggable={false}
            >
                <Background />
            </ReactFlow>
        </div>
    );
}