import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useHistory } from '@docusaurus/router';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
  Modifier,
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
  DragOverEvent,
  MeasuringStrategy,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCMS, SidebarItem } from '../../contexts/CMSContext';
import { Pencil, Trash2, ChevronRight, ChevronDown, FolderPlus, Plus, GripVertical } from 'lucide-react';
import { toast } from 'react-toastify';
import styles from './styles.module.css';
import {
  flatten,
  buildTree,
  FlattenedItem,
  project,
  removeChildrenOf,
} from './treeUtils';

const indentationWidth = 20;

function SidebarItemComponent({
  item,
  depth,
  isDragging,
  onUpdate,
  style: propStyle,
  ...props
}: {
  item: FlattenedItem;
  depth: number;
  isDragging?: boolean;
  onUpdate: () => void;
  style?: React.CSSProperties;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { renameSidebarItem, removeSidebarItem, addSidebarItem } = useCMS();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newLabel, setNewLabel] = useState(item.label || '');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const history = useHistory();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...propStyle,
  };

  const handleRename = () => {
    if (newLabel.trim() && newLabel !== item.label) {
      renameSidebarItem(item.id, newLabel.trim());
      toast.success('Renamed');
      onUpdate();
    }
    setIsRenaming(false);
  };

  const handleDelete = () => {
    if (confirm(`Delete "${item.label || 'this item'}"?`)) {
      removeSidebarItem(item.id);
      toast.success('Deleted');
      onUpdate();
    }
  };

  const handleAddFolder = () => {
    const folderName = prompt('Folder name:');
    if (folderName?.trim()) {
      const newFolder: SidebarItem = {
        id: `folder-${Date.now()}`,
        type: 'category',
        label: folderName.trim(),
        collapsible: true,
        collapsed: false,
        link: { type: 'generated-index' },
        items: []
      };
      addSidebarItem(item.id, newFolder);
      toast.success('Folder added');
      onUpdate();
    }
    setShowAddMenu(false);
  };

  const handleAddDoc = () => {
    const docName = prompt('Document name:');
    if (docName?.trim()) {
      const newDoc: SidebarItem = {
        id: `doc-${Date.now()}`,
        type: 'doc',
        label: docName.trim(),
        href: `/docs/${docName.toLowerCase().replace(/\s+/g, '-')}`
      };
      addSidebarItem(item.id, newDoc);
      toast.success('Document added');
      onUpdate();
    }
    setShowAddMenu(false);
  };

  const handleItemClick = (e: React.MouseEvent) => {
    // Navigate if it's a link or doc
    if (!isRenaming && (item.type === 'doc' || item.type === 'link') && item.href) {
      history.push(item.href);
    }
  };

  const canHaveChildren = item.type === 'category';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.sidebarItem} ${isDragging ? styles.dragging : ''}`}
      data-testid={`sidebar-item-${item.id}`}
      {...props}
    >
      <div
        className={styles.sidebarItemRow}
        style={{ paddingLeft: `${depth * indentationWidth}px` }}
        onClick={handleItemClick}
      >
        <div
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className={styles.dragHandle}
          data-testid={`sidebar-drag-handle-${item.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </div>

        <div className={styles.itemIcon}>
          {item.type === 'category' && '📁'}
          {item.type === 'link' && '🔗'}
          {item.type === 'doc' && '📄'}
          {item.type === 'html' && '📝'}
        </div>

        {isRenaming ? (
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') { setNewLabel(item.label || ''); setIsRenaming(false); }
            }}
            className={styles.renameInput}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className={styles.itemLabel}>{item.label || item.value || 'Untitled'}</span>
        )}

        <div className={styles.itemActions} onClick={(e) => e.stopPropagation()}>
          {canHaveChildren && (
            <div className={styles.addMenu}>
              <button className={styles.actionButton} data-testid={`sidebar-add-menu-button-${item.id}`} onClick={() => setShowAddMenu(!showAddMenu)} title="Add">
                <Plus size={14} />
              </button>
              {showAddMenu && (
                <div className={styles.addMenuDropdown} data-testid={`sidebar-add-menu-dropdown-${item.id}`}>
                  <button data-testid={`sidebar-add-folder-button-${item.id}`} onClick={handleAddFolder}>📁 Folder</button>
                  <button data-testid={`sidebar-add-doc-button-${item.id}`} onClick={handleAddDoc}>📄 Document</button>
                </div>
              )}
            </div>
          )}
          <button className={styles.actionButton} data-testid={`sidebar-rename-button-${item.id}`} onClick={() => setIsRenaming(true)} title="Rename">
            <Pencil size={14} />
          </button>
          <button className={styles.actionButton} data-testid={`sidebar-delete-button-${item.id}`} onClick={handleDelete} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export default function SidebarEditor() {
  const { config, updateSidebar, addSidebarItem } = useCMS();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [updateKey, setUpdateKey] = useState(0);

  // Flatten the tree for dnd-kit
  const flattenedItems = useMemo(() => {
    console.log('SidebarEditor: Flattening items...', config.sidebar);
    const flat = flatten(config.sidebar);
    console.log('SidebarEditor: Flattened items:', flat);
    return flat;
  }, [config.sidebar]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require slight movement to start drag
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);
  const activeItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setOverId(event.active.id as string);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { delta } = event;
    setOffsetLeft(delta.x);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const resetState = () => {
      setActiveId(null);
      setOverId(null);
      setOffsetLeft(0);
    };

    if (active.id && over && over.id) {
      const activeItem = flattenedItems.find(({ id }) => id === active.id);
      const overItem = flattenedItems.find(({ id }) => id === over.id);

      if (activeItem && overItem) {
        const activeIndex = flattenedItems.findIndex(({ id }) => id === active.id);
        const overIndex = flattenedItems.findIndex(({ id }) => id === over.id);

        let newItems = [...flattenedItems];

        // Calculate projected depth and parent
        const { depth, parentId } = project(
          flattenedItems,
          active.id as string,
          over.id as string,
          offsetLeft,
          indentationWidth
        );

        // Move item in the flat list
        newItems = arrayMove(newItems, activeIndex, overIndex);

        // Update the moved item's depth and parent
        const movedItem = newItems.find(item => item.id === active.id);
        if (movedItem) {
          movedItem.depth = depth;
          movedItem.parentId = parentId;
        }

        // Rebuild the tree structure
        const newSidebar = buildTree(newItems);
        updateSidebar(newSidebar);
      }
    }

    resetState();
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
    setOffsetLeft(0);
  };

  const handleAddRootFolder = () => {
    const folderName = prompt('Folder name:');
    if (folderName?.trim()) {
      const newFolder: SidebarItem = {
        id: `folder-${Date.now()}`,
        type: 'category',
        label: folderName.trim(),
        collapsible: true,
        collapsed: false,
        link: { type: 'generated-index' },
        items: []
      };
      addSidebarItem(null, newFolder);
      toast.success('Folder added');
      setUpdateKey(k => k + 1);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <div className={styles.sidebarEditor} data-testid="sidebar-editor">
        <div className={styles.header}>
          <h3 data-testid="sidebar-editor-title">Sidebar Structure</h3>
          <button className={styles.addRootButton} data-testid="sidebar-add-root-folder-button" onClick={handleAddRootFolder}>
            <FolderPlus size={16} /> Add Root Folder
          </button>
        </div>
        <div className={styles.content} data-testid="sidebar-editor-content">
          <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
            {flattenedItems.map((item) => (
              <SidebarItemComponent
                key={item.id}
                item={item}
                depth={item.id === activeId ? project(flattenedItems, activeId, overId || activeId, offsetLeft, indentationWidth).depth : item.depth}
                onUpdate={() => setUpdateKey(k => k + 1)}
              />
            ))}
          </SortableContext>
        </div>
      </div>
      {createPortal(
        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeItem ? (
            <SidebarItemComponent
              item={activeItem}
              depth={activeItem.depth}
              isDragging
              onUpdate={() => { }}
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
