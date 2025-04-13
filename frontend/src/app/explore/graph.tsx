"use client";

import { ReactFlow, Edge, Background, useReactFlow, ReactFlowProvider } from "@xyflow/react";
import { useEffect, useState, useCallback } from "react";
import '@xyflow/react/dist/style.css';
import InformationNode from "../components/info-node";
import { InfoNode } from "../util/types";
import { keyPressCases } from "../util/controls";

interface GraphProps {
    initialNodes: InfoNode[];
    initialEdges: Edge[];
}

export default function Graph({ initialNodes, initialEdges }: GraphProps) {
    return (
        <ReactFlowProvider>
            <InternalGraph initialNodes={initialNodes} initialEdges={initialEdges} />
        </ReactFlowProvider>
    );
}

function InternalGraph({ initialNodes, initialEdges }: GraphProps) {

    const [parentNode, setParentNode] = useState<InfoNode | null>(null);
    const [focusedNode, setFocusedNode] = useState<InfoNode | null>(null);
    const reactFlow = useReactFlow();

    const focusNode = useCallback((index: number) => {
        if (index >= 0 && index < initialNodes.length) {
            const node = initialNodes[index];
            handleSetFocus(node);
            handleSetParent(initialNodes, node);
        }
    }, [initialNodes, reactFlow]);

    const handleSetFocus = (node: InfoNode) => {
        reactFlow.setCenter(node.position.x + 50, node.position.y + 30, { zoom: 1.5, duration: 800 });
        setFocusedNode(node);
    }

    const handleSetParent = (nodes: InfoNode[], child: InfoNode) => {
        const parentIndex: number | undefined = child.data.parentIndex;
        let parent: InfoNode | null = null;
        if (parentIndex !== undefined) {
            parent = nodes[parentIndex];
        }
        setParentNode(parent);
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            keyPressCases(event, {
                focusedNode,
                parentNode,
                focus: focusNode
            });
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [focusedNode, initialNodes, focusNode]);

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