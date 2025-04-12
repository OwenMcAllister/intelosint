'use client';

import React, { useEffect, useState, useRef } from 'react';
import Start from './start';
import Graph from './graph';
import InfoDisplay from '../components/info-display';
import { Node, Edge } from '@xyflow/react';
import { createNodeFromNodeInfo } from '../util/functions';

interface QueryData {
    query: string;
}

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function Display() {
    const [queryMade, setQueryMade] = useState<boolean>(false);

    const [hoverInfo, setHoverInfo] = useState<Object | undefined>(undefined);

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const websocketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/node");
        websocketRef.current = ws;

        ws.onmessage = (message) => {
            const children: Nodes = JSON.parse(message.data);
            const parentId: string = children.parentId;

            const childrenIds: string[] = [];

            children.nodes.map((response: NodeResponse) => {
                const nodeInfo: NodeInfo = {
                    ...response,
                    onMouseEnter: () => setHoverInfo(response.info),
                    onMouseLeave: () => setHoverInfo(undefined),
                    onSearch: () => queryWebsocket(response.id),
                    position: { x: getRandomInt(100, 800), y: getRandomInt(100, 800) }
                }

                childrenIds.push(response.id);

                const node = createNodeFromNodeInfo(nodeInfo);

                console.log(node);

                setNodes(nodes => [...nodes, node])
            });

            setNodes(nodes =>
                nodes.map(node =>
                    node.id === parentId ? { ...node, data: { ...node.data, children: childrenIds } } : node
                )
            );

            setEdges(edges => [
                ...edges,
                ...childrenIds.map(childId => ({
                    id: `${parentId}-${childId}`,
                    source: parentId,
                    target: childId,
                    type: "smoothstep"
                }))
            ]);
        };

        return () => {
            ws.close();
            websocketRef.current = null;
        }
    }, [])

    const queryWebsocket = (id: string) => {
        console.log(`Querying websocket with ID ${id}`);
        if (websocketRef.current) {
            console.log("What?");
            websocketRef.current.send(id);
        } else {
            console.error("WebSocket is not connected");
        }
    }

    const handleQuery = (data: QueryData) => {
        // TODO: send req to backend

        const nodeInfo: NodeInfo = {
            id: "1",
            name: data.query,
            onMouseEnter: () => setHoverInfo({ Test: "Yay!" }),
            onMouseLeave: () => setHoverInfo(undefined),
            onSearch: () => queryWebsocket("1"),
            position: { x: 200, y: 200 }
        };

        const node = createNodeFromNodeInfo(nodeInfo);

        setNodes(nodes => [...nodes, node]);
        setQueryMade(true);
    };

    return (
        <div className="w-full h-full">
            {!queryMade ? (
                <Start onQuery={handleQuery} />
            ) : (
                <>
                    <Graph initialNodes={nodes} initialEdges={edges} />
                    <InfoDisplay data={hoverInfo} />
                </>
            )}
        </div>
    );
}
