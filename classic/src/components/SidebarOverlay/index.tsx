import React, { useState } from 'react';
import { useCMS } from '../../contexts/CMSContext';
import { Pencil, Trash2, Plus, FolderPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import styles from './styles.module.css';

export default function SidebarOverlay() {
  const { config, renameSidebarItem, removeSidebarItem, addSidebarItem } = useCMS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddMenu, setShowAddMenu] = useState<string | null>(null);

  const handleRename = (id: string) => {
    if (editValue.trim()) {
      renameSidebarItem(id, editValue.trim());
      toast.success('Renamed');
    }
    setEditingId(null);
  };

  const handleDelete = (id: string, label: string) => {
    if (confirm(`Delete "${label}"?`)) {
      removeSidebarItem(id);
      toast.success('Deleted');
    }
  };

  const handleAddFolder = (parentId: string | null) => {
    const name = prompt('Folder name:');
    if (name?.trim()) {
      addSidebarItem(parentId, {
        id: `folder-${Date.now()}`,
        type: 'category',
        label: name.trim(),
        collapsible: true,
        collapsed: false,
        link: { type: 'generated-index' },
        items: []
      });
      toast.success('Added');
    }
    setShowAddMenu(null);
  };

  const handleAddDoc = (parentId: string | null) => {
    const name = prompt('Document name:');
    if (name?.trim()) {
      addSidebarItem(parentId, {
        id: `doc-${Date.now()}`,
        type: 'doc',
        label: name.trim(),
        href: `/docs/${name.toLowerCase().replace(/\s+/g, '-')}`
      });
      toast.success('Added');
    }
    setShowAddMenu(null);
  };

  const renderItem = (item: any, level = 0) => {
    const isEditing = editingId === item.id;
    const canHaveChildren = item.type === 'category';

    return (
      <div key={item.id} style={{ marginLeft: `${level * 16}px` }}>
        <div className={styles.sidebarItem}>
          {isEditing ? (
            <input
              className={styles.editInput}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleRename(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename(item.id);
                if (e.key === 'Escape') setEditingId(null);
              }}
              autoFocus
            />
          ) : (
            <span className={styles.label}>{item.label || item.value || 'Untitled'}</span>
          )}
          
          <div className={styles.actions}>
            {canHaveChildren && (
              <div className={styles.addMenu}>
                <button 
                  className={styles.btn}
                  onClick={() => setShowAddMenu(showAddMenu === item.id ? null : item.id)}
                  title="Add"
                >
                  <Plus size={14} />
                </button>
                {showAddMenu === item.id && (
                  <div className={styles.dropdown}>
                    <button onClick={() => handleAddFolder(item.id)}>📁 Folder</button>
                    <button onClick={() => handleAddDoc(item.id)}>📄 Doc</button>
                  </div>
                )}
              </div>
            )}
            <button 
              className={styles.btn}
              onClick={() => {
                setEditingId(item.id);
                setEditValue(item.label || '');
              }}
              title="Rename"
            >
              <Pencil size={14} />
            </button>
            <button 
              className={styles.btn}
              onClick={() => handleDelete(item.id, item.label)}
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        {item.items?.map((child: any) => renderItem(child, level + 1))}
      </div>
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <button 
          className={styles.addRoot}
          onClick={() => handleAddFolder(null)}
        >
          <FolderPlus size={16} /> Add Folder
        </button>
      </div>
      {config.sidebar.map((item) => renderItem(item))}
    </div>
  );
}
