import React, { useState } from 'react';
import { useCMS, SidebarItem } from '../../contexts/CMSContext';
import { Pencil, Trash2, ChevronRight, ChevronDown, FolderPlus, Plus, GripVertical } from 'lucide-react';
import { toast } from 'react-toastify';
import styles from './styles.module.css';

function SidebarItemComponent({ item, level = 0, onUpdate }: { item: SidebarItem; level?: number; onUpdate: () => void }) {
  const { renameSidebarItem, removeSidebarItem, addSidebarItem, moveSidebarItem } = useCMS();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newLabel, setNewLabel] = useState(item.label || '');
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

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

  const hasChildren = item.items && item.items.length > 0;
  const canHaveChildren = item.type === 'category';

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!canHaveChildren) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && draggedId !== item.id && canHaveChildren) {
      moveSidebarItem(draggedId, item.id);
      toast.success('Moved');
      onUpdate();
    }
  };

  return (
    <div className={`${styles.sidebarItem} ${isDragOver ? styles.dragOver : ''}`}>
      <div 
        className={styles.sidebarItemRow} 
        style={{ paddingLeft: `${level * 20}px` }}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={styles.dragHandle}>
          <GripVertical size={12} />
        </div>
        {hasChildren && (
          <button className={styles.expandButton} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        {!hasChildren && <div style={{ width: '14px' }} />}

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
          />
        ) : (
          <span className={styles.itemLabel}>{item.label || item.value || 'Untitled'}</span>
        )}

        <div className={styles.itemActions}>
          {canHaveChildren && (
            <div className={styles.addMenu}>
              <button className={styles.actionButton} onClick={() => setShowAddMenu(!showAddMenu)} title="Add">
                <Plus size={14} />
              </button>
              {showAddMenu && (
                <div className={styles.addMenuDropdown}>
                  <button onClick={handleAddFolder}>📁 Folder</button>
                  <button onClick={handleAddDoc}>📄 Document</button>
                </div>
              )}
            </div>
          )}
          <button className={styles.actionButton} onClick={() => setIsRenaming(true)} title="Rename">
            <Pencil size={14} />
          </button>
          <button className={styles.actionButton} onClick={handleDelete} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className={styles.childrenContainer}>
          {item.items!.map((child) => (
            <SidebarItemComponent key={child.id} item={child} level={level + 1} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SidebarEditor() {
  const { config, addSidebarItem } = useCMS();
  const [updateKey, setUpdateKey] = useState(0);

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
    <div className={styles.sidebarEditor}>
      <div className={styles.header}>
        <h3>Sidebar Structure</h3>
        <button className={styles.addRootButton} onClick={handleAddRootFolder}>
          <FolderPlus size={16} /> Add Root Folder
        </button>
      </div>
      <div className={styles.content} key={updateKey}>
        {config.sidebar.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
            No items. Click "Add Root Folder" to start.
          </p>
        ) : (
          config.sidebar.map((item) => (
            <SidebarItemComponent key={item.id} item={item} onUpdate={() => setUpdateKey(k => k + 1)} />
          ))
        )}
      </div>
    </div>
  );
}
