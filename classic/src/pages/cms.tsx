import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { CMSProvider, useCMS } from '../contexts/CMSContext';
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Search, Plus, X, Pencil, Trash2, FolderPlus, FilePlus, Square, Download, Menu, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './cms.module.css';
import indexStyles from './index.module.css';
import { getIconComponent } from '../utils/iconHelper';
import { UniversalSearchModal } from '../components/UniversalSearch';
import SidebarEditor from '../components/SidebarEditor';
import ArticleEditor from '../components/ArticleEditor';
import { marked } from 'marked';

// Card Editor Modal
function CardEditorModal({ card, onSave, onClose }: { card: any; onSave: (card: any) => void; onClose: () => void }) {
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const [link, setLink] = useState(card?.link || '');
  const [icon, setIcon] = useState(card?.icon || 'FileText');

  useEffect(() => {
    if (card) {
      setTitle(card.title || '');
      setDescription(card.description || '');
      setLink(card.link || '');
      setIcon(card.icon || 'FileText');
    }
  }, [card]);

  const handleSave = () => {
    if (!title?.trim() || !description?.trim() || !link?.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!link.startsWith('/')) {
      toast.error('Link must start with /');
      return;
    }
    onSave({ ...card, title: title.trim(), description: description.trim(), link: link.trim(), icon: icon.trim() || 'FileText' });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} data-testid="card-editor-modal-overlay" onClick={onClose}>
      <div className={styles.modal} data-testid="card-editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 data-testid="card-editor-modal-title">Edit Card</h2>
          <button className={styles.closeButton} data-testid="card-editor-close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.formField}>
            <label>Title *</label>
            <input
              type="text"
              data-testid="card-editor-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              placeholder="Card Title"
            />
          </div>
          <div className={styles.formField}>
            <label>Description *</label>
            <textarea
              data-testid="card-editor-description-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              placeholder="Card Description"
              rows={3}
            />
          </div>
          <div className={styles.formField}>
            <label>Link/URL *</label>
            <input
              type="text"
              data-testid="card-editor-link-input"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className={styles.input}
              placeholder="/docs/path/to/page"
            />
          </div>
          <div className={styles.formField}>
            <label>Icon Name</label>
            <input
              type="text"
              data-testid="card-editor-icon-input"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className={styles.input}
              placeholder="Rocket, LayoutDashboard, Server, etc."
            />
            <small>Icon name from lucide-react (e.g., Rocket, Shield, Code2)</small>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.buttonSecondary} data-testid="card-editor-cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className={styles.buttonPrimary} data-testid="card-editor-save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Sortable Card Component
function SortableCard({ card, section, isEditMode, onEdit, onDelete }: { card: any; section: string; isEditMode: boolean; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isEditMode ? 'default' : 'pointer',
  };

  const href = useBaseUrl(card.link);

  const cardContent = (
    <>
      <div className={indexStyles.cardIcon}>{getIconComponent(card.icon, 24)}</div>
      <h3 className={indexStyles.cardTitle}>{card.title}</h3>
      <p className={indexStyles.cardDesc}>{card.description}</p>
    </>
  );

  // In edit mode, prevent navigation but allow editing
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isEditMode ? styles.editableCard : ''}`}
      data-testid={`card-${card.id}`}
    >
      {isEditMode && (
        <>
          <div className={styles.cardEditOverlay}>
            <button
              className={styles.editButton}
              data-testid={`edit-card-button-${card.id}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit();
              }}
              title="Edit Card"
            >
              <Pencil size={16} />
            </button>
            <button
              className={styles.deleteButton}
              data-testid={`delete-card-button-${card.id}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              title="Delete Card"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div
            className={styles.dragHandle}
            data-testid={`card-drag-handle-${card.id}`}
            {...attributes}
            {...listeners}
            title="Drag to reorder"
          >
            <div className={styles.dragHandleIcon}>⋮⋮</div>
          </div>
        </>
      )}
      {/* Always allow navigation - cards are clickable even in edit mode */}
      <Link
        to={href}
        className={indexStyles.card}
        onClick={(e) => {
          // Only prevent if clicking the edit button or drag handle
          if ((e.target as HTMLElement).closest('.editButton, .dragHandle')) {
            e.preventDefault();
          }
        }}
      >
        {cardContent}
      </Link>
    </div>
  );
}

// Universal Search Component
function UniversalSearch({ onOpen }: { onOpen: () => void }) {
  return (
    <div className={indexStyles.searchForm} onClick={onOpen}>
      <div className={indexStyles.searchContainer}>
        <Search className={indexStyles.searchIcon} size={20} />
        <input
          type="text"
          className={indexStyles.searchInput}
          placeholder="Search documentation..."
          readOnly
        />
        <div
          aria-label="Open search with Ctrl or Command and K"
          style={{
            color: 'var(--ifm-color-emphasis-500)',
            fontSize: '0.8rem',
            border: '1px solid var(--ifm-color-emphasis-300)',
            borderRadius: '4px',
            padding: '2px 6px',
            display: 'flex',
            gap: '0.25rem',
          }}>
          <span>Ctrl</span>
          <span>/</span>
          <span>⌘</span>
          <span>+</span>
          <span>K</span>
        </div>
      </div>
    </div>
  );
}

// Main CMS Component
function VisualCMSContent() {
  const location = useLocation();
  const history = useHistory();
  const { config, isDirty, isEditMode, setEditMode, updateLandingPage, updateHeroText, updateSectionText, updateSidebar, removeSidebarItem, exportConfig, markClean } = useCMS();
  const [editingHero, setEditingHero] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSidebarEditor, setShowSidebarEditor] = useState(false);
  const [addType, setAddType] = useState<'folder' | 'article' | 'card' | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(false);
  const [articleContent, setArticleContent] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduced distance for easier drag activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Enable edit mode when on /cms route and persist across navigation
  useEffect(() => {
    if (location.pathname === '/cms' || location.pathname.startsWith('/cms/')) {
      setEditMode(true);
      localStorage.setItem('cms_edit_mode', 'true');
    }
    // Check if edit mode was previously enabled
    const savedEditMode = localStorage.getItem('cms_edit_mode') === 'true';
    if (savedEditMode && !isEditMode) {
      setEditMode(true);
    }
  }, [location.pathname, setEditMode, isEditMode]);

  // Check admin server status
  useEffect(() => {
    const checkServer = async () => {
      try {
        // Use health check endpoint first (no auth needed)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const healthResponse = await fetch('http://localhost:3001/api/health', {
          method: 'GET',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (healthResponse.ok) {
          setServerStatus('online');
          return;
        }
      } catch (error: any) {
        // If health check fails (CORS, network, etc), try login endpoint
        if (error.name !== 'AbortError') {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const response = await fetch('http://localhost:3001/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: 'admin123' }),
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            setServerStatus(response.ok ? 'online' : 'offline');
          } catch {
            setServerStatus('offline');
          }
        } else {
          setServerStatus('offline');
        }
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Keep edit mode active when navigating (persist in localStorage)
  useEffect(() => {
    const savedEditMode = localStorage.getItem('cms_edit_mode') === 'true';
    if (savedEditMode && !isEditMode) {
      setEditMode(true);
    }
  }, [isEditMode, setEditMode]);

  // Save edit mode state
  useEffect(() => {
    localStorage.setItem('cms_edit_mode', isEditMode.toString());
  }, [isEditMode]);

  // Mouse tracking for hover effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.querySelectorAll(`.${indexStyles.card}`).forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && !isSearchOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const handleDragStart = (event: any) => {
    console.log('Drag started:', event.active.id);
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    console.log('Drag ended:', { activeId: active.id, overId: over?.id });
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    // Handle sidebar reordering
    const sidebarIds = config.sidebar.map((s) => s.id);
    const sidebarOldIndex = sidebarIds.indexOf(active.id);
    const sidebarNewIndex = sidebarIds.indexOf(over.id);

    if (sidebarOldIndex !== -1 && sidebarNewIndex !== -1) {
      const newSidebar = arrayMove(config.sidebar, sidebarOldIndex, sidebarNewIndex);
      updateSidebar(newSidebar);
      toast.success('Sidebar reordered');
      setActiveId(null);
      return;
    }

    // Handle card reordering
    const cardSections: Array<keyof typeof config.landingPage> = ['coreResources', 'featuredResources', 'roleResources', 'learnMoreResources'];
    for (const section of cardSections) {
      const resources = config.landingPage[section];
      if (Array.isArray(resources)) {
        const oldIndex = resources.findIndex((r) => r.id === active.id);
        const newIndex = resources.findIndex((r) => r.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newResources = arrayMove(resources, oldIndex, newIndex);
          updateLandingPage(section, newResources);
          toast.success('Cards reordered');
          break;
        }
      }
    }

    setActiveId(null);
  };

  const handleCardEdit = (card: any, section: keyof typeof config.landingPage) => {
    setEditingCard({ ...card, section });
  };

  const handleCardSave = (updatedCard: any) => {
    const section = updatedCard.section;
    const resources = config.landingPage[section];
    const index = resources.findIndex((r) => r.id === updatedCard.id);
    if (index !== -1) {
      const newResources = [...resources];
      newResources[index] = { ...updatedCard };
      delete newResources[index].section;
      updateLandingPage(section, newResources);
      toast.success('Card updated');
    }
  };

  const handleCardDelete = (cardId: string, section: keyof typeof config.landingPage) => {
    if (confirm('Delete this card?')) {
      const sectionData = config.landingPage[section];
      if (Array.isArray(sectionData)) {
        const resources = sectionData.filter(r => r.id !== cardId);
        updateLandingPage(section, resources);
        toast.success('Card deleted');
      }
    }
  };

  const handleCardAdd = (section: keyof typeof config.landingPage) => {
    const newCard = {
      id: `${section}-${Date.now()}`,
      title: 'New Card',
      description: 'Description',
      link: '/docs/',
      icon: 'FileText'
    };
    const sectionData = config.landingPage[section];
    if (Array.isArray(sectionData)) {
      updateLandingPage(section, [...sectionData, newCard]);
      toast.success('Card added');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const API_URL = 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/cms-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });

      if (response.ok) {
        toast.success('Changes saved! Restart dev server to see updates.');
        markClean();
      } else {
        const data = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast.error(data.error || 'Failed to save');
      }
    } catch (error: any) {
      toast.error('Cannot connect to admin server. Run: npm run admin:server');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const configJson = exportConfig();
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cms-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Config exported!');
  };

  const handleExitEditMode = () => {
    setEditMode(false);
    localStorage.setItem('cms_edit_mode', 'false');
    if (location.pathname.startsWith('/cms')) {
      history.push('/');
    }
  };

  return (
    <Layout title={isEditMode ? "Visual CMS - Edit Mode" : "Documentation"} description="GCXONE Technical Documentation">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Toolbar is now in CMSOverlay component - it will show globally when in edit mode */}

        {/* Main Content */}
        <main className={indexStyles.main} style={{ marginTop: isEditMode ? '60px' : '0' }}>
          <div className={indexStyles.container}>
            {/* Hero Section */}
            <section className={indexStyles.hero}>
              {isEditMode ? (
                <div className={styles.heroEditor} data-testid="hero-editor">
                  <input
                    type="text"
                    data-testid="hero-title-input"
                    value={config.landingPage.heroTitle}
                    onChange={(e) => updateHeroText(e.target.value, config.landingPage.heroSubtitle)}
                    className={styles.heroInput}
                    placeholder="Hero Title"
                  />
                  <textarea
                    data-testid="hero-subtitle-textarea"
                    value={config.landingPage.heroSubtitle}
                    onChange={(e) => updateHeroText(config.landingPage.heroTitle, e.target.value)}
                    className={styles.heroTextarea}
                    placeholder="Hero Subtitle"
                    rows={3}
                  />
                </div>
              ) : (
                <>
                  <h1 className={indexStyles.heroTitle}>{config.landingPage.heroTitle}</h1>
                  <p className={indexStyles.heroSubtitle}>
                    {config.landingPage.heroSubtitle}
                  </p>
                </>
              )}
              <UniversalSearch onOpen={() => setIsSearchOpen(true)} />
            </section>

            {/* Section 1: Core Resources */}
            <section className={indexStyles.section}>
              {isEditMode && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className={styles.sectionLabel}>Core Resources</div>
                  <button className={styles.buttonPrimary} data-testid="add-card-button-coreResources" onClick={() => handleCardAdd('coreResources')}>
                    <Plus size={16} /> Add Card
                  </button>
                </div>
              )}
              {config.landingPage.coreResources && config.landingPage.coreResources.length > 0 ? (
                <SortableContext items={config.landingPage.coreResources.map((r) => r.id)} strategy={rectSortingStrategy}>
                  <div className={indexStyles.grid4}>
                    {config.landingPage.coreResources.map((card) => (
                      <SortableCard
                        key={card.id}
                        card={card}
                        section="coreResources"
                        isEditMode={isEditMode}
                        onEdit={() => handleCardEdit(card, 'coreResources')}
                        onDelete={() => handleCardDelete(card.id, 'coreResources')}
                      />
                    ))}
                  </div>
                </SortableContext>
              ) : (
                <div className={indexStyles.grid4}>
                  <p>No core resources configured</p>
                </div>
              )}
            </section>

            {/* Section 1.5: Featured Topics */}
            <section className={indexStyles.section}>
              {isEditMode ? (
                <div className={styles.sectionTextEditor} data-testid="section-text-editor-featured">
                  <input
                    type="text"
                    data-testid="section-heading-input-featured"
                    value={config.landingPage.featuredHeading}
                    onChange={(e) => updateSectionText('featured', e.target.value, config.landingPage.featuredSubtitle)}
                    className={styles.sectionHeadingInput}
                  />
                  <input
                    type="text"
                    data-testid="section-subtitle-input-featured"
                    value={config.landingPage.featuredSubtitle}
                    onChange={(e) => updateSectionText('featured', config.landingPage.featuredHeading, e.target.value)}
                    className={styles.sectionSubtitleInput}
                  />
                </div>
              ) : (
                <>
                  <h2 className={indexStyles.sectionHeading}>{config.landingPage.featuredHeading}</h2>
                  <p className={indexStyles.sectionSubtitle}>{config.landingPage.featuredSubtitle}</p>
                </>
              )}
              {isEditMode && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className={styles.sectionLabel}>Featured Topics</div>
                  <button className={styles.buttonPrimary} data-testid="add-card-button-featuredResources" onClick={() => handleCardAdd('featuredResources')}>
                    <Plus size={16} /> Add Card
                  </button>
                </div>
              )}
              <SortableContext items={config.landingPage.featuredResources.map((r) => r.id)} strategy={rectSortingStrategy}>
                <div className={indexStyles.grid3}>
                  {config.landingPage.featuredResources.map((card) => (
                    <SortableCard
                      key={card.id}
                      card={card}
                      section="featuredResources"
                      isEditMode={isEditMode}
                      onEdit={() => handleCardEdit(card, 'featuredResources')}
                      onDelete={() => handleCardDelete(card.id, 'featuredResources')}
                    />
                  ))}
                </div>
              </SortableContext>
            </section>

            {/* Section 2: Learn by Role */}
            <section className={indexStyles.section}>
              {isEditMode ? (
                <div className={styles.sectionTextEditor} data-testid="section-text-editor-role">
                  <input
                    type="text"
                    data-testid="section-heading-input-role"
                    value={config.landingPage.roleHeading}
                    onChange={(e) => updateSectionText('role', e.target.value, config.landingPage.roleSubtitle)}
                    className={styles.sectionHeadingInput}
                  />
                  <input
                    type="text"
                    data-testid="section-subtitle-input-role"
                    value={config.landingPage.roleSubtitle}
                    onChange={(e) => updateSectionText('role', config.landingPage.roleHeading, e.target.value)}
                    className={styles.sectionSubtitleInput}
                  />
                </div>
              ) : (
                <>
                  <h2 className={indexStyles.sectionHeading}>{config.landingPage.roleHeading}</h2>
                  <p className={indexStyles.sectionSubtitle}>{config.landingPage.roleSubtitle}</p>
                </>
              )}
              {isEditMode && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className={styles.sectionLabel}>Learn by Role</div>
                  <button className={styles.buttonPrimary} data-testid="add-card-button-roleResources" onClick={() => handleCardAdd('roleResources')}>
                    <Plus size={16} /> Add Card
                  </button>
                </div>
              )}
              <SortableContext items={config.landingPage.roleResources.map((r) => r.id)} strategy={rectSortingStrategy}>
                <div className={indexStyles.grid4}>
                  {config.landingPage.roleResources.map((card) => (
                    <SortableCard
                      key={card.id}
                      card={card}
                      section="roleResources"
                      isEditMode={isEditMode}
                      onEdit={() => handleCardEdit(card, 'roleResources')}
                      onDelete={() => handleCardDelete(card.id, 'roleResources')}
                    />
                  ))}
                </div>
              </SortableContext>
            </section>

            {/* Section 3: Learn More */}
            <section className={indexStyles.section}>
              {isEditMode ? (
                <div className={styles.sectionTextEditor} data-testid="section-text-editor-learnMore">
                  <input
                    type="text"
                    data-testid="section-heading-input-learnMore"
                    value={config.landingPage.learnMoreHeading}
                    onChange={(e) => updateSectionText('learnMore', e.target.value, config.landingPage.learnMoreSubtitle)}
                    className={styles.sectionHeadingInput}
                  />
                  <input
                    type="text"
                    data-testid="section-subtitle-input-learnMore"
                    value={config.landingPage.learnMoreSubtitle}
                    onChange={(e) => updateSectionText('learnMore', config.landingPage.learnMoreHeading, e.target.value)}
                    className={styles.sectionSubtitleInput}
                  />
                </div>
              ) : (
                <>
                  <h2 className={indexStyles.sectionHeading}>{config.landingPage.learnMoreHeading}</h2>
                  <p className={indexStyles.sectionSubtitle}>{config.landingPage.learnMoreSubtitle}</p>
                </>
              )}
              {isEditMode && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className={styles.sectionLabel}>Learn More</div>
                  <button className={styles.buttonPrimary} data-testid="add-card-button-learnMoreResources" onClick={() => handleCardAdd('learnMoreResources')}>
                    <Plus size={16} /> Add Card
                  </button>
                </div>
              )}
              <SortableContext items={config.landingPage.learnMoreResources.map((r) => r.id)} strategy={rectSortingStrategy}>
                <div className={indexStyles.grid3}>
                  {config.landingPage.learnMoreResources.map((card) => (
                    <SortableCard
                      key={card.id}
                      card={card}
                      section="learnMoreResources"
                      isEditMode={isEditMode}
                      onEdit={() => handleCardEdit(card, 'learnMoreResources')}
                      onDelete={() => handleCardDelete(card.id, 'learnMoreResources')}
                    />
                  ))}
                </div>
              </SortableContext>
            </section>
          </div>

          <UniversalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        </main>

        <DragOverlay>
          {activeId ? (
            <div className={styles.dragPreview}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={styles.dragHandleIcon}>⋮⋮</div>
                <span>Dragging: {activeId}</span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Card Editor Modal */}
      {editingCard && (
        <CardEditorModal
          card={editingCard}
          onSave={handleCardSave}
          onClose={() => setEditingCard(null)}
        />
      )}

      {/* Sidebar Editor Modal */}
      {showSidebarEditor && (
        <div className={styles.modalOverlay} data-testid="sidebar-editor-modal-overlay" onClick={() => setShowSidebarEditor(false)}>
          <div className={styles.modal} data-testid="sidebar-editor-modal" style={{ maxWidth: '800px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 data-testid="sidebar-editor-modal-title">Edit Sidebar Structure</h2>
              <button className={styles.closeButton} data-testid="sidebar-editor-close-button" onClick={() => setShowSidebarEditor(false)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalContent} style={{ maxHeight: '70vh', overflow: 'auto' }}>
              <SidebarEditor />
            </div>
          </div>
        </div>
      )}



      {/* CMSOverlay is now global in Root.tsx */}
    </Layout>
  );
}

// Main Export - Provider is already in Root.tsx
export default function VisualCMS() {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => <VisualCMSContent />}
    </BrowserOnly>
  );
}
