import { Node } from '@xyflow/react';

export function createNodeFromNodeInfo(info: NodeInfo): Node {
    const node: Node = { 
        id: info.id, 
        type: "custom", 
        data: { 
            label: info.name,
            info: info.info,
            onMouseEnter: info.onMouseEnter,
            onMouseLeave: info.onMouseLeave
        }, 
        position: { x: 100, y: 100 } 
    };

    return node;
}