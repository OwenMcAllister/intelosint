'use client';

import React, { useEffect, useState, useRef } from 'react';
import Start from './start';
import Graph from './graph';
import InfoDisplay from '../components/info-display';
import { Node, Edge } from '@xyflow/react';
import { createNodeFromNodeInfo } from '../util/functions';
import { InfoNode, NodeInfo, NodeResponse, Nodes } from '../util/types';

interface QueryData {
    query: string;
}

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function Display() {
    const [queryMade, setQueryMade] = useState<boolean>(false);

    const [hoverInfo, setHoverInfo] = useState<Object | undefined>(undefined);

    const [nodes, setNodes] = useState<InfoNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const websocketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/node");
        websocketRef.current = ws;

        ws.onmessage = (message) => {
            console.log("Received Message");
            const children: Nodes = JSON.parse(message.data);
            const parentId: string = children.parentId;
            const parentIndex: number = children.parentIndex;

            const childrenIds: string[] = [];
            let baseIndex: number;

            setNodes(currentNodes => {
                baseIndex = currentNodes.length;
                return currentNodes;
            });

            const childrenIndices: number[] = [];

            const newChildNodes = children.nodes.map((response: NodeResponse, index: number) => {
                const nodeIndex: number = baseIndex + index;
                childrenIndices.push(nodeIndex);
                childrenIds.push(response.id);

                return createNodeFromNodeInfo({
                    ...response,
                    index: nodeIndex,
                    parentIndex,
                    childrenIndices: [],
                    onMouseEnter: () => setHoverInfo(response.info),
                    onMouseLeave: () => setHoverInfo(undefined),
                    onSearch: () => queryWebsocket(response.id, nodeIndex),
                    position: { x: getRandomInt(100, 800), y: getRandomInt(100, 800) }
                });
            });

            setNodes(nodes => {
                const updatedNodes = [...nodes];

                updatedNodes.push(...newChildNodes);

                const parentNodeIndex = updatedNodes.findIndex(node => node.id === parentId);
                if (parentNodeIndex !== -1) {
                    updatedNodes[parentNodeIndex].data.childrenIndices = childrenIndices;
                }

                return updatedNodes;
            });

            setEdges(edges => [
                ...edges,
                ...childrenIds.map(id => ({
                    id: `${parentId}-${id}`,
                    source: parentId,
                    target: id,
                    type: "smoothstep"
                }))
            ]);
        };

        return () => {
            ws.close();
            websocketRef.current = null;
        }
    }, [])

    const queryWebsocket = (id: string, index: number) => {
        console.log(`Querying websocket with ID ${id}`);
        if (websocketRef.current) {
            console.log("What?");
            const data = {
                id: id,
                index: index
            }
            websocketRef.current.send(JSON.stringify(data));
        } else {
            console.error("WebSocket is not connected");
        }
    }

    const handleQuery = (data: QueryData) => {

        const nodeInfo: NodeInfo = {
            id: "root",
            name: data.query,
            index: 0,
            parentIndex: undefined,
            childrenIndices: [],
            onMouseEnter: () => setHoverInfo({ Test: "Yay!" }),
            onMouseLeave: () => setHoverInfo(undefined),
            onSearch: () => queryWebsocket("root", 0),
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
