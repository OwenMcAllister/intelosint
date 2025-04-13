import type { Edge } from '@xyflow/react';
import type { InfoNode, NewChildNode, NewChildNodesInput, NodeInfo, NodeResponse, Nodes, WebsocketMessage } from './types';

export function createNodeFromNodeInfo(info: NodeInfo): InfoNode {
    const node: InfoNode = {
        id: info.id,
        type: "custom",
        data: info,
        position: info.position || { x: 100, y: 100 }
    };

    return node;
}

export function parseMessage(message: MessageEvent): WebsocketMessage {
    const children: Nodes = JSON.parse(message.data);
    const childrenIds: string[] = [];
    const childrenIndices: number[] = [];

    return { ...children, childrenIds, childrenIndices };
}

export function createNewChildNodes(input: NewChildNodesInput): InfoNode[] {
    const newChildNodes = input.nodes.map((response: NodeResponse, arrayIndex: number) => {
        const nodeIndex: number = input.baseIndex + arrayIndex;
        input.childrenIndices.push(nodeIndex);
        input.childrenIds.push(response.id);

        return createNodeFromNodeInfo({
            ...response,
            index: nodeIndex,
            parentIndex: input.parentIndex,
            childrenIndices: [],
            onMouseEnter: () => input.onMouseEnter(response.info),
            onMouseLeave: () => input.onMouseLeave(undefined),
            onSearch: () => input.onSearch(response.id, nodeIndex),
            position: { x: getRandomInt(100, 800), y: getRandomInt(100, 800) },
        });
    });

    return newChildNodes;
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

