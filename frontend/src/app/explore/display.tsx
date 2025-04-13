"use client";

import React, { useEffect, useState, useRef } from "react";
import Start from "./start";
import Graph from "./graph";
import InfoDisplay from "../components/info-display";
import type { Edge } from "@xyflow/react";
import {
	addUniqueByID,
	createNewChildNodes,
	createNodeFromNodeInfo,
	generateParentChildEdges,
	parseMessage,
	updateChildrenOfParent,
} from "../util/functions";
import type { InfoNode, NodeInfo, NodeResponse } from "../util/types";

interface QueryData {
	query: string;
}

export default function Display() {
	const [queryMade, setQueryMade] = useState<boolean>(false);

	// biome-ignore lint/complexity/noBannedTypes: Arbitrary info object will depend on backend
	const [hoverInfo, setHoverInfo] = useState<Object | undefined>(undefined);

	const [nodes, setNodes] = useState<InfoNode[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	const websocketRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8000/ws/node");
		websocketRef.current = ws;

		ws.onmessage = (message) => {
			console.log("Received Message");

			const { nodes, parentId, parentIndex, childrenIds, childrenIndices } =
				parseMessage(message);

			setNodes((currentNodes) =>
				nodeUpdate(
					currentNodes,
					nodes,
					childrenIds,
					childrenIndices,
					parentIndex,
				),
			);

			setEdges((edges) => edgeUpdate(edges, childrenIds, parentId));
		};

		return () => {
			ws.close();
			websocketRef.current = null;
		};
	}, []);

	const nodeUpdate = (
		currentNodes: InfoNode[],
		nodes: NodeResponse[],
		childrenIds: string[],
		childrenIndices: number[],
		parentIndex: number,
	): InfoNode[] => {
		const baseIndex = currentNodes.length;

		const childNodes: InfoNode[] = createNewChildNodes({
			nodes,
			baseIndex,
			childrenIds,
			childrenIndices,
			parentIndex,
			onMouseEnter: setHoverInfo,
			onMouseLeave: setHoverInfo,
			onSearch: queryWebsocket,
		});

		let updatedNodes = [...currentNodes];
		updatedNodes = addUniqueByID(updatedNodes, childNodes);
		updateChildrenOfParent(updatedNodes, parentIndex, childrenIndices);

		console.log(updatedNodes);

		return updatedNodes;
	};

	const edgeUpdate = (
		currentEdges: Edge[],
		childrenIds: string[],
		parentId: string,
	): Edge[] => {
		const newEdges = generateParentChildEdges(childrenIds, parentId);
		const combined = addUniqueByID(currentEdges, newEdges);

		console.log(combined);
		return combined;
	};

	const queryWebsocket = (id: string, index: number) => {
		if (websocketRef.current) {
			const data = {
				id: id,
				index: index,
			};
			websocketRef.current.send(JSON.stringify(data));
		} else {
			console.error("WebSocket is not connected");
		}
	};

	const handleInitialQuery = (data: QueryData) => {
		const nodeInfo: NodeInfo = {
			id: "root",
			name: data.query,
			index: 0,
			parentIndex: undefined,
			childrenIndices: [],
			onMouseEnter: () => setHoverInfo({ Test: "Yay!" }),
			onMouseLeave: () => setHoverInfo(undefined),
			onSearch: () => queryWebsocket("root", 0),
			position: { x: 200, y: 200 },
		};

		const node = createNodeFromNodeInfo(nodeInfo);

		setNodes((nodes) => [...nodes, node]);
		setQueryMade(true);
	};

	return (
		<div className="w-full h-full">
			{!queryMade ? (
				<Start onQuery={handleInitialQuery} />
			) : (
				<>
					<Graph initialNodes={nodes} initialEdges={edges} />
					<InfoDisplay data={hoverInfo} />
				</>
			)}
		</div>
	);
}
