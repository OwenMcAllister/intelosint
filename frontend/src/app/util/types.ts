

interface NodeInfo extends Record<string, string | any | undefined>{
    id: string;
    name: string;
    children?: string[];
    info?: any;
    isSearched?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onSearch: () => void;
    position?: NodePosition
}

interface NodePosition {
    x: number;
    y: number;
}

interface NodeResponse {
    id: string;
    name: string;
    info: any;
}

interface Nodes {
    parentId: string;
    nodes: NodeResponse[];
}