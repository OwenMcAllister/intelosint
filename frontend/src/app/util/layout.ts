import type { InfoNode, LayoutPosition, NodePosition } from "./types";

const CENTER_X = 300;
const CENTER_Y = 400;

const MAX_CHILD_NODES = 3;

const BASE_RADIUS = 150;
const LEVEL_MULTIPLIER = 1.3;

const NODE_WIDTH = 112;
const NODE_HEIGHT = 80;

export function getRootPosition(): NodePosition {
    return {
        x: CENTER_X - NODE_WIDTH / 2,
        y: CENTER_Y - NODE_HEIGHT / 2
    };
}

export function calculateBestPosition(
    availablePositions: LayoutPosition[],
    parentPosition?: NodePosition,
): NodePosition {
    if (!parentPosition) {
        const position = availablePositions[0];
        return {
            x: position.x - NODE_WIDTH / 2,
            y: position.y - NODE_HEIGHT / 2
        };
    }

    const centeredParentPosition: NodePosition = {
        x: parentPosition.x + NODE_WIDTH / 2,
        y: parentPosition.y + NODE_HEIGHT / 2
    };

    let bestPositionIndex: number | undefined;
    let bestPositionDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < availablePositions.length; i++) {
        const position = availablePositions[i];
        if (position.available) {
            const distance = getDistance(centeredParentPosition, position);
            if (distance < bestPositionDistance) {
                bestPositionDistance = distance;
                bestPositionIndex = i;
            }
        }
    }


    if (bestPositionIndex === undefined) {
        throw new Error("Another skill issue, this also just should never happen");
    }

    const bestPosition = availablePositions[bestPositionIndex];
    bestPosition.available = false;

    return {
        x: bestPosition.x - NODE_WIDTH / 2,
        y: bestPosition.y - NODE_HEIGHT / 2
    };
}

function getDistance(pos1: NodePosition, pos2: NodePosition): number {
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
}

function generatePossiblePositions(maxLevel: number): Map<number, LayoutPosition[]> {
    const positionMap: Map<number, LayoutPosition[]> = new Map();

    const rootPosition: LayoutPosition = { x: CENTER_X, y: CENTER_Y, available: true };
    positionMap.set(0, [rootPosition]);

    for (let i = 1; i <= maxLevel; i++) {
        const radius = BASE_RADIUS * (1 + (i - 1) * LEVEL_MULTIPLIER ** (i - 1))
        const positions: LayoutPosition[] = [];
        const totalPositions = MAX_CHILD_NODES ** i;
        for (let j = 0; j < totalPositions; j++) {
            const angle = -Math.PI / 2 + (j * 2 * Math.PI / totalPositions);
            const x = CENTER_X + radius * Math.cos(angle);
            const y = CENTER_Y + radius * Math.sin(angle);
            positions.push({ x, y, available: true });
        }
        positionMap.set(i, positions);
    }

    return positionMap;
}

export function groupNodesByLevel(nodes: InfoNode[]) {
    const levelMap = new Map<number, number[]>();

    nodes.forEach((node, index) => {
        const level = node.data.level || 0;
        if (!levelMap.has(level)) {
            levelMap.set(level, []);
        }
        levelMap.get(level)?.push(index);
    });

    return levelMap;
}

export function layoutNodes(nodes: InfoNode[]): InfoNode[] {
    const newNodes = [...nodes];
    const levelMap = groupNodesByLevel(newNodes);
    const maxLevel = Math.max(...Array.from(levelMap.keys()));
    const nodePositions = new Map<string, NodePosition>();
    const allAvailablePositions = generatePossiblePositions(maxLevel);

    for (const level of Array.from(levelMap.keys()).sort()) {
        const nodeIndices = levelMap.get(level) || [];

        for (const nodeIndex of nodeIndices) {
            const node = newNodes[nodeIndex];

            let parentPosition: NodePosition | undefined;
            if (node.data.parentId) {
                parentPosition = nodePositions.get(node.data.parentId);
            }

            const availablePositions: LayoutPosition[] | undefined = allAvailablePositions.get(level);

            if (!availablePositions) {
                throw new Error("Messed up the level logic -- this really shouldn't happen");
            }

            const position = calculateBestPosition(availablePositions, parentPosition);

            newNodes[nodeIndex].position = position;

            if (node.id) {
                nodePositions.set(node.id, position);
            }
        }
    }

    return newNodes;
}
