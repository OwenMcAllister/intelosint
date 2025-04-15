"use client";

import {
	ReactFlow,
	type Edge,
	Background,
	useReactFlow,
	ReactFlowProvider,
} from "@xyflow/react";
import { useEffect, useState, useCallback } from "react";
import "@xyflow/react/dist/style.css";
import InformationNode from "../components/info-node";
import type { InfoNode } from "../util/types";
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
	const [nodes, setNodes] = useState(initialNodes);
	const [edges, setEdges] = useState(initialEdges);
	const [parentNode, setParentNode] = useState<InfoNode | null>(null);
	const [focusedNode, setFocusedNode] = useState<InfoNode | null>(null);
	const reactFlow = useReactFlow();

	useEffect(() => {
		const updatedNodes = initialNodes.map((node) => ({
			...node,
			position: { ...node.position },
		}));
		setNodes(updatedNodes);
	}, [initialNodes]);

	useEffect(() => {
		setEdges(initialEdges);
	}, [initialEdges]);

	const focusNode = useCallback(
		(index: number) => {
			if (index >= 0 && index < nodes.length) {
				const node = nodes[index];
				handleSetFocus(node);
				handleSetParent(nodes, node);
			}
		},
		[nodes],
	);

	const handleSetFocus = (node: InfoNode) => {
		reactFlow.setCenter(node.position.x + 50, node.position.y + 30, {
			zoom: 1.5,
			duration: 800,
		});
		setFocusedNode(node);
	};

	const handleSetParent = (nodes: InfoNode[], child: InfoNode) => {
		const parentIndex: number | undefined = child.data.parentIndex;
		let parent: InfoNode | null = null;
		if (parentIndex !== undefined) {
			parent = nodes[parentIndex];
		}
		setParentNode(parent);
	};

	useEffect(() => {
		if (nodes.length > 0) {
			focusNode(0);

			if (nodes.length > 1) {
				reactFlow.fitView({ padding: 0.2, duration: 800 });
			}
		}
	}, [nodes, focusNode, reactFlow]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			keyPressCases(event, {
				focusedNode,
				parentNode,
				focus: focusNode,
			});
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [focusedNode, parentNode, focusNode]);

	return (
		<div style={{ width: "100%", height: "100vh" }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={{ custom: InformationNode }}
				nodesDraggable={false}
				fitView
				defaultViewport={{ x: 0, y: 0, zoom: 1 }}
			>
				<Background />
			</ReactFlow>
		</div>
	);
}
