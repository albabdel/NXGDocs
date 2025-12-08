import { SidebarItem } from '../../contexts/CMSContext';
import { arrayMove } from '@dnd-kit/sortable';

export interface FlattenedItem extends SidebarItem {
    parentId: string | null;
    depth: number;
    index: number;
}

export function flatten(
    items: SidebarItem[],
    parentId: string | null = null,
    depth = 0
): FlattenedItem[] {
    return items.reduce<FlattenedItem[]>((acc, item, index) => {
        return [
            ...acc,
            { ...item, parentId, depth, index },
            ...flatten(item.items || [], item.id, depth + 1),
        ];
    }, []);
}

export function buildTree(flattenedItems: FlattenedItem[]): SidebarItem[] {
    const root: SidebarItem = { id: 'root', items: [], type: 'category' };
    const nodes: Record<string, SidebarItem> = { [root.id]: root };
    const items = flattenedItems.map((item) => ({ ...item, items: [] }));

    for (const item of items) {
        const { id, items: oldItems, parentId, depth, index, ...rest } = item;
        const sidebarItem: SidebarItem = { id, ...rest, items: [] };
        nodes[id] = sidebarItem;

        const pId = item.parentId || 'root';
        const parent = nodes[pId] || root;

        parent.items = parent.items || [];
        parent.items.push(sidebarItem);
    }

    return root.items || [];
}

export function findItem(items: SidebarItem[], itemId: string) {
    return items.find(({ id }) => id === itemId);
}

export function findItemDeep(
    items: SidebarItem[],
    itemId: string
): SidebarItem | undefined {
    for (const item of items) {
        const { id, items: children } = item;

        if (id === itemId) {
            return item;
        }

        if (children) {
            const child = findItemDeep(children, itemId);

            if (child) {
                return child;
            }
        }
    }

    return undefined;
}

function getDragDepth(offset: number, indentationWidth: number) {
    return Math.round(offset / indentationWidth);
}

export function project(
    items: FlattenedItem[],
    activeId: string,
    overId: string,
    dragOffset: number,
    indentationWidth: number
) {
    const overItemIndex = items.findIndex(({ id }) => id === overId);
    const activeItemIndex = items.findIndex(({ id }) => id === activeId);
    const activeItem = items[activeItemIndex];
    const newItems = arrayMove(items, activeItemIndex, overItemIndex);
    const previousItem = newItems[overItemIndex - 1];
    const nextItem = newItems[overItemIndex + 1];
    const dragDepth = getDragDepth(dragOffset, indentationWidth);
    const projectedDepth = activeItem.depth + dragDepth;
    const maxDepth = previousItem ? previousItem.depth + 1 : 0;
    const minDepth = nextItem ? nextItem.depth : 0;
    let depth = projectedDepth;

    if (projectedDepth >= maxDepth) {
        depth = maxDepth;
    } else if (projectedDepth < minDepth) {
        depth = minDepth;
    }

    return { depth, maxDepth, minDepth, parentId: getParentId() };

    function getParentId() {
        if (depth === 0 || !previousItem) {
            return null;
        }

        if (depth === previousItem.depth) {
            return previousItem.parentId;
        }

        if (depth > previousItem.depth) {
            return previousItem.id;
        }

        const newParent = newItems
            .slice(0, overItemIndex)
            .reverse()
            .find((item) => item.depth === depth)?.parentId;

        return newParent ?? null;
    }
}

export function removeChildrenOf(
    items: FlattenedItem[],
    ids: string[]
) {
    const excludeParentIds = [...ids];

    return items.filter((item) => {
        if (item.parentId && excludeParentIds.includes(item.parentId)) {
            if (item.items && item.items.length) {
                excludeParentIds.push(item.id);
            }
            return false;
        }

        return true;
    });
}
