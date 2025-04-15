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
import { getRootPosition, layoutNodes } from "../util/layout"; // Import our new layout function
import type { InfoNode, NodeInfo, NodeResponse } from "../util/types";

const BACKEND_URL = process.env.BACKEND_URL;

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
		const ws = new WebSocket("ws://localhost:8000/ws/node/test");
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
					parentId,
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
		parentId: string,
	): InfoNode[] => {
		const baseIndex = currentNodes.length;
		const parentLevel = currentNodes[parentIndex].data.level;

		const childNodes: InfoNode[] = createNewChildNodes({
			nodes,
			baseIndex,
			childrenIds,
			childrenIndices,
			parentLevel,
			parentIndex,
			parentId,
			onMouseEnter: setHoverInfo,
			onMouseLeave: setHoverInfo,
			onSearch: queryWebsocket,
		});

		let updatedNodes = [...currentNodes];
		updatedNodes = addUniqueByID(updatedNodes, childNodes);
		updateChildrenOfParent(updatedNodes, parentIndex, childrenIndices);

		return layoutNodes(updatedNodes);
	};

	const edgeUpdate = (
		currentEdges: Edge[],
		childrenIds: string[],
		parentId: string,
	): Edge[] => {
		const newEdges = generateParentChildEdges(childrenIds, parentId);
		const combined = addUniqueByID(currentEdges, newEdges);
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
			level: 0,
			parentIndex: undefined,
			parentId: undefined,
			childrenIndices: [],
			onMouseEnter: () => setHoverInfo({ Test: "Yay!" }),
			onMouseLeave: () => setHoverInfo(undefined),
			onSearch: () => queryWebsocket("root", 0),
			position: getRootPosition(),
		};

		const node = createNodeFromNodeInfo(nodeInfo);
		setNodes([node]);
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
