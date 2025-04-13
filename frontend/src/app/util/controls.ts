import type { InfoNode } from "./types";

interface NodeFocusFields {
    focusedNode: InfoNode | null;
    parentNode: InfoNode | null;
    focus: (index: number) => void;
}

export function keyPressCases(
    event: KeyboardEvent,
    focusFields: NodeFocusFields
) {
    switch (event.key) {
        case 'Enter':
            setFocusCurrent(focusFields);
            break;
        case 'w':
            setFocusParent(focusFields);
            break;
        case 'a':
            setFocusPreviousSibling(focusFields);
            break;
        case 'd':
            setFocusNextSibling(focusFields);
            break;
        case 's':
            setFocusFirstChild(focusFields)
            break;
        case 'r':
            setFocusRoot(focusFields);
            break;
        default:
            break;
    }
}

function setFocusCurrent(focusFields: NodeFocusFields) {
    const index: number = focusFields.focusedNode?.data.index || 0;
    focusFields.focus(index);
}

function setFocusParent(focusFields: NodeFocusFields) {
    if (focusFields.focusedNode) {
        const index: number | undefined = focusFields.focusedNode.data.parentIndex;
        if (index !== undefined) {
            focusFields.focus(index);
        }
    }
}

function setFocusPreviousSibling(focusFields: NodeFocusFields) {
    if (focusFields.focusedNode && focusFields.parentNode) {
        const siblingIndices = focusFields.parentNode.data.childrenIndices;
        const currentSiblingPosition = siblingIndices.indexOf(focusFields.focusedNode.data.index);
        const siblingIndex = (currentSiblingPosition > 0) ?
            currentSiblingPosition - 1 : siblingIndices.length - 1;
        focusFields.focus(siblingIndices[siblingIndex]);
    }
}

function setFocusNextSibling(focusFields: NodeFocusFields) {
    if (focusFields.focusedNode && focusFields.parentNode) {
        const siblingIndices = focusFields.parentNode.data.childrenIndices;
        const currentSiblingPosition = siblingIndices.indexOf(focusFields.focusedNode.data.index);
        const siblingIndex = (currentSiblingPosition < siblingIndices.length - 1) ?
            currentSiblingPosition + 1 : 0;
        focusFields.focus(siblingIndices[siblingIndex]);
    }
}

function setFocusFirstChild(focusFields: NodeFocusFields) {
    if (focusFields.focusedNode) {
        const childrenIndices = focusFields.focusedNode.data.childrenIndices;
        if (childrenIndices.length > 0) {
            focusFields.focus(childrenIndices[0]);
        }
    }
}

function setFocusRoot(focusFields: NodeFocusFields) {
    focusFields.focus(0);
}
