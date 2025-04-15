import type { Edge, XYPosition } from '@xyflow/react';
import type { InfoNode, NewChildNode, NewChildNodesInput, NodeInfo, NodePosition, NodeResponse, Nodes, WebsocketMessage } from './types';
import { calculateBestPosition } from './layout';

const NULL_POSITION: NodePosition = { x: 0, y: 0 };

export function createNodeFromNodeInfo(nodeInfo: NodeInfo): InfoNode {
    console.log(nodeInfo);
    return {
        id: nodeInfo.id,
        type: 'custom',
        position: positionToXY(nodeInfo.position),
        data: nodeInfo,
    };
}

function positionToXY(pos: NodePosition | undefined): XYPosition {
    if (!pos) {
        return { x: 0, y: 0 }
    }
    return (pos as XYPosition)
}

export function parseMessage(message: MessageEvent): WebsocketMessage {
    const children: Nodes = JSON.parse(message.data);
    const childrenIds: string[] = [];
    const childrenIndices: number[] = [];

    return { ...children, childrenIds, childrenIndices };
}

export function createNewChildNodes(input: NewChildNodesInput): InfoNode[] {
    const childLevel = input.parentLevel + 1;

    return input.nodes.map((node, i) => {
        const position = NULL_POSITION;
        const nodeIndex = input.baseIndex + i;

        const nodeInfo: NodeInfo = {
            id: node.id,
            name: node.name,
            index: nodeIndex,
            level: childLevel,
            parentIndex: input.parentIndex,
            parentId: input.parentId,
            childrenIndices: [],
            onMouseEnter: () => input.onMouseEnter(node.info),
            onMouseLeave: () => input.onMouseLeave(undefined),
            onSearch: () => input.onSearch(node.id, nodeIndex),
            position
        };

        input.childrenIndices.push(nodeIndex);
        input.childrenIds.push(node.id);

        return createNodeFromNodeInfo(nodeInfo);
    });
}

export function updateChildrenOfParent(nodes: InfoNode[], parentIndex: number, childrenIndices: number[]) {
    if (parentIndex !== -1) {
        nodes[parentIndex].data.childrenIndices = childrenIndices;
    }
}

export function generateParentChildEdges(childrenIds: string[], parentId: string): Edge[] {
    const newEdges: Edge[] = childrenIds.map((id) => ({
        id: `${parentId}-${id}`,
        source: parentId,
        target: id,
        type: "smoothstep",
    }));

    return newEdges;
}

export function addUniqueByID<T extends { id: string }>(original: T[], extra: T[]): T[] {
    const map: Map<string, T> = new Map(original.map(item => [item.id, item]));
    for (const item of extra) {
        map.set(item.id, item);
    }
    return Array.from(map.values());
}

export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

