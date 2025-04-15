import type { InfoNode } from "./types";

interface ViewportControlFields {
    focusedNode: InfoNode | null;
    parentNode: InfoNode | null;
    focus: (index: number) => void;
    zoomOutAndCenter: () => void;
}

export function keyPressCases(
    event: KeyboardEvent,
    viewportFields: ViewportControlFields
) {
    switch (event.key) {
        case 'Enter':
            setFocusCurrent(viewportFields);
            break;
        case 'w':
            setFocusParent(viewportFields);
            break;
        case 'a':
            setFocusPreviousSibling(viewportFields);
            break;
        case 'd':
            setFocusNextSibling(viewportFields);
            break;
        case 's':
            setFocusFirstChild(viewportFields)
            break;
        case 'r':
            setFocusRoot(viewportFields);
            break;
        case 'q':
            setZoomOutAndCenter(viewportFields);
            break;
        default:
            break;
    }
}

function setFocusCurrent(viewportFields: ViewportControlFields) {
    const index: number = viewportFields.focusedNode?.data.index || 0;
    viewportFields.focus(index);
}

function setFocusParent(viewportFields: ViewportControlFields) {
    if (viewportFields.focusedNode) {
        const index: number | undefined = viewportFields.focusedNode.data.parentIndex;
        if (index !== undefined) {
            viewportFields.focus(index);
        }
    }
}

function setFocusPreviousSibling(viewportFields: ViewportControlFields) {
    if (viewportFields.focusedNode && viewportFields.parentNode) {
        const siblingIndices = viewportFields.parentNode.data.childrenIndices;
        const currentSiblingPosition = siblingIndices.indexOf(viewportFields.focusedNode.data.index);
        const siblingIndex = (currentSiblingPosition > 0) ?
            currentSiblingPosition - 1 : siblingIndices.length - 1;
        viewportFields.focus(siblingIndices[siblingIndex]);
    }
}

function setFocusNextSibling(viewportFields: ViewportControlFields) {
    if (viewportFields.focusedNode && viewportFields.parentNode) {
        const siblingIndices = viewportFields.parentNode.data.childrenIndices;
        const currentSiblingPosition = siblingIndices.indexOf(viewportFields.focusedNode.data.index);
        const siblingIndex = (currentSiblingPosition < siblingIndices.length - 1) ?
            currentSiblingPosition + 1 : 0;
        viewportFields.focus(siblingIndices[siblingIndex]);
    }
}

function setFocusFirstChild(viewportFields: ViewportControlFields) {
    if (viewportFields.focusedNode) {
        const childrenIndices = viewportFields.focusedNode.data.childrenIndices;
        if (childrenIndices.length > 0) {
            viewportFields.focus(childrenIndices[0]);
        }
    }
}

function setFocusRoot(viewportFields: ViewportControlFields) {
    viewportFields.focus(0);
}

function setZoomOutAndCenter(viewportFields: ViewportControlFields) {
    viewportFields.zoomOutAndCenter();
}
