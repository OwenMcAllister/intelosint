import type { Node } from "@xyflow/react";

// biome-ignore lint/suspicious/noExplicitAny: Will depend on what backend types we decide on, can change to some basic id later
export interface NodeInfo extends Record<string, string | any | undefined> {
    id: string;
    name: string;
    index: number;
    childrenIndices: number[];
    parentIndex: number | undefined;
    parentId: string | undefined;
    level: number; // Add level property to track distance from root
    // biome-ignore lint/suspicious/noExplicitAny: Same as above
    info?: any;
    isSearched?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onSearch: () => void;
    position?: NodePosition
}

export interface NodePosition {
    x: number;
    y: number;
}

export interface NodeResponse {
    id: string;
    name: string;
    // biome-ignore lint/suspicious/noExplicitAny: Same
    info: any;
}

export interface Nodes {
    parentId: string;
    parentIndex: number;
    nodes: NodeResponse[];
}

export type InfoNode = Node<NodeInfo, string>;

export interface WebsocketMessage extends Nodes {
    childrenIds: string[];
    childrenIndices: number[];
}

export interface NewChildNodesInput {
    nodes: NodeResponse[];
    baseIndex: number;
    childrenIndices: number[];
    childrenIds: string[];
    parentIndex: number;
    parentLevel: number;
    parentId: string;

    // biome-ignore lint/suspicious/noExplicitAny: Again, depends on backend info for now
    onMouseEnter: (info: any | undefined) => void;
    // biome-ignore lint/suspicious/noExplicitAny: Same as above ^
    onMouseLeave: (info: any | undefined) => void;
    onSearch: (id: string, index: number) => void;
    positions?: NodePosition[];
}

export interface NewChildNode {
    node: NodeResponse;
    nodeIndex: number;
    parentIndex: number;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onSearch: () => void;
    position?: NodePosition;
}

export interface LayoutPosition extends NodePosition {
    available: boolean;
}

export interface Level {
    total: number;
    indices: number[];
}

export interface PositionRadius {
    endRadius: number;
    positions: LayoutPosition[];
}