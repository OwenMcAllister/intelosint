import { Node } from "@xyflow/react";


export interface NodeInfo extends Record<string, string | any | undefined>{
    id: string;
    name: string;
    index: number;
    childrenIndices: number[];
    parentIndex: number | undefined;
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
    info: any;
}

export interface Nodes {
    parentId: string;
    parentIndex: number;
    nodes: NodeResponse[];
}

export type InfoNode = Node<NodeInfo, string>;