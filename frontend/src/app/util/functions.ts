import { Node } from '@xyflow/react';
import { InfoNode, NodeInfo } from './types';

export function createNodeFromNodeInfo(info: NodeInfo): InfoNode {
    const node: InfoNode = { 
        id: info.id, 
        type: "custom", 
        data: info, 
        position: info.position || {x: 100, y: 100}
    };

    return node;
}