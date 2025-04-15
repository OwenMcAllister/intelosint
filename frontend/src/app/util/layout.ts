import type { InfoNode, LayoutPosition, Level, NodePosition, PositionRadius } from "./types";

const CENTER_X = 300;
const CENTER_Y = 400;

const BASE_RADIUS = 150;
const LEVEL_MULTIPLIER = 1.7;

const NODE_WIDTH = 112;
const NODE_HEIGHT = 80;
const SAME_LEVEL_RADII_SPACING = (NODE_HEIGHT + NODE_WIDTH) / 1.25;
const NODE_SPACING = 20;

export function layoutNodes(nodes: InfoNode[]): InfoNode[] {
    const newNodes = [...nodes];
    const levelMap: Map<number, Level> = groupNodesByLevel(newNodes);
    const nodePositions = new Map<string, NodePosition>();
    const allAvailablePositions = generatePossiblePositions(levelMap);

    for (const level of Array.from(levelMap.keys()).sort()) {
        const levelNodes = levelMap.get(level) || { total: 0, indices: [] };
        calculateLevelPositions(level, levelNodes, newNodes, nodePositions, allAvailablePositions);
    }

    return newNodes;
}

export function groupNodesByLevel(nodes: InfoNode[]) {
    const levelMap = new Map<number, Level>();

    nodes.forEach((node, index) => {
        const level = node.data.level || 0;
        if (!levelMap.has(level)) {
            levelMap.set(level, { total: 0, indices: [] });
        }

        const currentLevel = levelMap.get(level);

        if (currentLevel === undefined) {
            throw new Error(`Level object not found for level ${level}`);
        }

        currentLevel.indices.push(index);
        currentLevel.total += 1;
    });

    return levelMap;
}

function generatePossiblePositions(levelMap: Map<number, Level>): Map<number, LayoutPosition[]> {
    const positionMap: Map<number, LayoutPosition[]> = new Map();

    const rootPosition: LayoutPosition = {
        x: CENTER_X,
        y: CENTER_Y,
        available: true,
    };
    positionMap.set(0, [rootPosition]);

    let level = 1;
    let levelInfo: Level | undefined = levelMap.get(level);
    let prevNodeCount = 0;
    let prevRadius = 0;

    while (levelInfo !== undefined) {
        const radius = prevRadius + BASE_RADIUS * (LEVEL_MULTIPLIER)
        const totalPositions = getTotalPositions(level, levelInfo.total, prevNodeCount);
        prevNodeCount = totalPositions;

        const output = generatePossibleLevelPositions(level, levelInfo, radius);

        positionMap.set(level, output.positions);

        prevRadius = output.endRadius;

        level++;
        levelInfo = levelMap.get(level);
    }

    return positionMap;
}

function getTotalPositions(level: number, total: number, prev: number): number {
    if (level > 1) {
        return Math.max(total, prev * 3);
    }
    return total;
}

function generatePossibleLevelPositions(level: number, levelInfo: Level, baseRadius: number): PositionRadius {
    const positions: LayoutPosition[] = [];

    let positionsToAllocate = levelInfo.total;
    let radius = baseRadius;

    while (positionsToAllocate > 0) {
        const positionsOnCircle = calculateMaxNodesOnCircle(radius);
        let circlePositions: LayoutPosition[];
        if (positionsOnCircle > positionsToAllocate && level === 1) {
            circlePositions = generateRadialPositions(radius, positionsToAllocate);
        } else {
            circlePositions = generateRadialPositions(radius, positionsOnCircle);
        }

        positions.push(...circlePositions);
        positionsToAllocate -= positionsOnCircle;
        radius += SAME_LEVEL_RADII_SPACING;
    }

    return { endRadius: radius - SAME_LEVEL_RADII_SPACING, positions };
}

function generateRadialPositions(radius: number, totalPositions: number): LayoutPosition[] {
    const positions: LayoutPosition[] = [];

    for (let j = 0; j < totalPositions; j++) {
        const angle = -Math.PI / 2 + (j * 2 * Math.PI) / totalPositions;
        const x = CENTER_X + radius * Math.cos(angle);
        const y = CENTER_Y + radius * Math.sin(angle);
        positions.push({ x, y, available: true });
    }

    return positions;
}

export function calculateMaxNodesOnCircle(radius: number): number {
    const effectiveNodeWidth = NODE_WIDTH + NODE_SPACING;
    const circumference = 2 * Math.PI * radius;
    return Math.floor(circumference / effectiveNodeWidth);
}

function calculateLevelPositions(
    level: number,
    levelNodes: Level,
    nodes: InfoNode[],
    nodePositions: Map<string, NodePosition>,
    allAvailablePositions: Map<number, LayoutPosition[]>,
) {
    for (const nodeIndex of levelNodes.indices) {
        const node = nodes[nodeIndex];

        const parentPosition = getParentPosition(nodePositions, node.data.parentId);
        const availablePositions = getAvailableLevelPositions(allAvailablePositions, level);

        const position = calculateBestPosition(availablePositions, parentPosition);
        nodes[nodeIndex].position = position;
        nodePositions.set(node.id, position);
    }
}

function getParentPosition(nodePositions: Map<string, NodePosition>, parentId?: string): NodePosition | undefined {
    let parentPosition: NodePosition | undefined;
    if (parentId) {
        parentPosition = nodePositions.get(parentId);
    }

    return parentPosition;
}

function getAvailableLevelPositions(allAvailablePositions: Map<number, LayoutPosition[]>, level: number) {
    const availablePositions: LayoutPosition[] | undefined =
        allAvailablePositions.get(level);

    if (!availablePositions) {
        throw new Error(`No available positions found for level ${level}`);
    }

    return availablePositions;
}

export function calculateBestPosition(
    availablePositions: LayoutPosition[],
    parentPosition?: NodePosition,
): NodePosition {
    if (!parentPosition) {
        return getRootPosition();
    }

    const centeredParentPosition: NodePosition = getCenteredPosition(parentPosition);

    const bestPositionIndex = getClosestAvailablePositionIndex(centeredParentPosition, availablePositions);

    const bestPosition = availablePositions[bestPositionIndex];
    bestPosition.available = false;

    return {
        x: bestPosition.x - NODE_WIDTH / 2,
        y: bestPosition.y - NODE_HEIGHT / 2,
    };
}

export function getRootPosition(): NodePosition {
    return {
        x: CENTER_X - NODE_WIDTH / 2,
        y: CENTER_Y - NODE_HEIGHT / 2,
    };
}

function getCenteredPosition(position: NodePosition): NodePosition {
    return {
        x: position.x + NODE_WIDTH / 2,
        y: position.y + NODE_HEIGHT / 2,
    };
}

function getClosestAvailablePositionIndex(parentPosition: NodePosition, availablePositions: LayoutPosition[]): number {
    let bestPositionIndex: number | undefined;
    let bestPositionDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < availablePositions.length; i++) {
        const position = availablePositions[i];

        if (position.available) {
            const distance = getDistance(parentPosition, position);

            if (distance < bestPositionDistance) {
                bestPositionDistance = distance;
                bestPositionIndex = i;
            }
        }
    }

    if (bestPositionIndex === undefined) {
        throw new Error("Failed to find closest position index");
    }

    return bestPositionIndex;
}

function getDistance(pos1: NodePosition, pos2: NodePosition): number {
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
}
