"use client";

import { ReactFlow, Node, Edge, Background, useReactFlow, ReactFlowProvider } from "@xyflow/react";
import { useEffect, useState, useCallback } from "react";
import '@xyflow/react/dist/style.css';
import InformationNode from "../components/info-node";
import { InfoNode } from "../util/types";

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
            reactFlow.setCenter(node.position.x + 50, node.position.y + 30, { zoom: 1.5, duration: 800 });
            setFocusedNode(node);

            const parentIndex: number | undefined = node.data.parentIndex;
            let parent: InfoNode | null = null;
            if (parentIndex !== undefined) {
                parent = initialNodes[parentIndex];
            }
            setParentNode(parent);
        }
    }, [initialNodes, reactFlow]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'Enter':
                    const index = focusedNode?.data.index || 0;
                    focusNode(index);
                    break;
                case 'w':
                    console.log(focusedNode);
                    if (focusedNode) {
                        const index: number | undefined = focusedNode.data.parentIndex;
                        console.log(index);
                        if (index !== undefined) {
                            focusNode(index);
                        }
                    }
                    break;

                case 'a':
                    console.log(focusedNode)
                    console.log(parentNode)
                    if (focusedNode && parentNode) {
                        const siblingIndices = parentNode.data.childrenIndices;
                        const currentSiblingPosition = siblingIndices.indexOf(focusedNode.data.index);
                        const siblingIndex = (currentSiblingPosition > 0) ?
                            currentSiblingPosition - 1 : siblingIndices.length - 1;
                        focusNode(siblingIndices[siblingIndex]);
                    }
                    break;

                case 'd':
                    if (focusedNode && parentNode) {
                        const siblingIndices = parentNode.data.childrenIndices;
                        const currentSiblingPosition = siblingIndices.indexOf(focusedNode.data.index);
                        const siblingIndex = (currentSiblingPosition < siblingIndices.length - 1) ?
                            currentSiblingPosition + 1 : 0;
                        focusNode(siblingIndices[siblingIndex]);
                    }
                    break;

                case 's':
                    console.log(focusedNode);
                    if (focusedNode) {
                        const childrenIndices = focusedNode.data.childrenIndices;

                        if (childrenIndices.length > 0) {
                            focusNode(childrenIndices[0]);
                        }
                    }
                    break;

                case 'r':
                    focusNode(0);
                    break;

                default:
                    break;
            }
        };

        // Add event listener
        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener on cleanup
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