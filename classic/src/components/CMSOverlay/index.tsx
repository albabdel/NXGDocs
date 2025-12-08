import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from '@docusaurus/router';
import { useCMS } from '../../contexts/CMSContext';
import { Pencil, X, Edit, Menu, Plus, Save, Download } from 'lucide-react';
import ArticleEditor from '../ArticleEditor';
import { ToastContainer, toast } from 'react-toastify';
import SidebarEditor from '../SidebarEditor';
import { SkeletonEditor } from '../Skeleton';
import '../../css/sidebar-edit.css';
import styles from './styles.module.css';
import cmsStyles from '../../pages/cms.module.css';

const API_URL = 'http://localhost:3001/api';

export default function CMSOverlay() {
  const location = useLocation();
  const history = useHistory();
  const { isEditMode, setEditMode, config, updateArticle, isDirty, markClean, exportConfig } = useCMS();
  const [showArticleEditor, setShowArticleEditor] = useState(false);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [articleContent, setArticleContent] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [loadingArticle, setLoadingArticle] = useState(false);
  const [actualFilePath, setActualFilePath] = useState<string | null>(null);
  const [originalFrontmatter, setOriginalFrontmatter] = useState<any>({});
  const [showSidebarEditor, setShowSidebarEditor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showNewArticleModal, setShowNewArticleModal] = useState(false);
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticlePath, setNewArticlePath] = useState('');
  const [availableFolders, setAvailableFolders] = useState<string[]>([]);

  // Detect if we're on a doc page
  const isDocPage = location.pathname.startsWith('/docs/') && location.pathname !== '/docs';

  // Persist edit mode when navigating - check if we're coming from /cms route
  useEffect(() => {
    // If on /cms route, ensure edit mode is on
    if (location.pathname === '/cms' || location.pathname.startsWith('/cms/')) {
      if (!isEditMode) {
        setEditMode(true);
      }
      localStorage.setItem('cms_edit_mode', 'true');
    }
    // If edit mode is on but we're not on /cms, keep it on (for navigation)
    else if (isEditMode) {
      // Keep edit mode active when navigating between pages
      localStorage.setItem('cms_edit_mode', 'true');
    }
  }, [location.pathname, isEditMode, setEditMode]);

  useEffect(() => {
    // Only use isEditMode from context - proper separation between CMS and normal mode
    if (isDocPage && isEditMode) {
      // Extract doc ID from path
      const docId = location.pathname.replace('/docs/', '').replace(/\/$/, '');
      setCurrentDocId(docId);
    } else {
      setCurrentDocId(null);
      setShowArticleEditor(false);
    }
  }, [location.pathname, isDocPage, isEditMode]);

  // Check admin server status
  useEffect(() => {
    if (!isEditMode) return;

    const checkServer = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const response = await fetch('http://localhost:3001/api/health', { signal: controller.signal });
        clearTimeout(timeoutId);
        setServerStatus(response.ok ? 'online' : 'offline');
      } catch {
        setServerStatus('offline');
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, [isEditMode]);

  // Load available folders for new article
  useEffect(() => {
    if (showNewArticleModal) {
      const loadFolders = async () => {
        try {
          const response = await fetch(`${API_URL}/docs`);
          if (response.ok) {
            const files = await response.json();
            const extractFolders = (nodes: any[], prefix = ''): string[] => {
              const folders: string[] = [];
              for (const node of nodes) {
                if (node.type === 'folder') {
                  const folderPath = prefix ? `${prefix}/${node.name}` : node.name;
                  folders.push(folderPath);
                  if (node.children) {
                    folders.push(...extractFolders(node.children, folderPath));
                  }
                }
              }
              return folders;
            };
            setAvailableFolders(extractFolders(files));
          }
        } catch (error) {
          console.error('Error loading folders:', error);
        }
      };
      loadFolders();
    }
  }, [showNewArticleModal]);

  // Add data attribute to document for CSS targeting - ONLY when in CMS mode
  useEffect(() => {
    if (isEditMode) {
      document.documentElement.setAttribute('data-cms-mode', 'true');
      document.body.style.paddingTop = '60px';

      // Debounce to prevent infinite loop from MutationObserver
      let debounceTimer: ReturnType<typeof setTimeout> | null = null;
      const debouncedAddButtons = () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          addSidebarEditButtons();
        }, 500);
      };

      addSidebarEditButtons();
      const observer = new MutationObserver((mutations) => {
        // Only run if mutations are NOT from our own edit buttons
        const isOwnMutation = mutations.some(m =>
          (m.target as HTMLElement)?.classList?.contains('sidebar-edit-buttons') ||
          (m.target as HTMLElement)?.closest?.('.sidebar-edit-buttons')
        );
        if (!isOwnMutation) {
          debouncedAddButtons();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      return () => {
        observer.disconnect();
        if (debounceTimer) clearTimeout(debounceTimer);
      };
    } else {
      document.documentElement.removeAttribute('data-cms-mode');
      document.body.style.paddingTop = '';
      removeSidebarEditButtons();
    }
  }, [isEditMode]);

  const addSidebarEditButtons = () => {
    setTimeout(() => {
      const links = document.querySelectorAll('.menu__link');

      links.forEach((link) => {
        if (link.querySelector('.sidebar-edit-buttons')) return;

        const label = link.textContent?.trim();
        const buttons = document.createElement('div');
        buttons.className = 'sidebar-edit-buttons';
        buttons.style.cssText = 'display:none;position:absolute;right:8px;top:50%;transform:translateY(-50%);gap:4px;z-index:10;';
        buttons.innerHTML = `
          <button class="sidebar-edit-btn" style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;background:white;border:1px solid #d2d2d7;border-radius:4px;cursor:pointer;color:#6e6e73;padding:0;" data-action="rename" title="Rename">✏️</button>
          <button class="sidebar-edit-btn" style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;background:white;border:1px solid #d2d2d7;border-radius:4px;cursor:pointer;color:#6e6e73;padding:0;" data-action="delete" title="Delete">🗑️</button>
        `;

        const parent = link.parentElement;
        if (parent) {
          parent.style.position = 'relative';
          parent.addEventListener('mouseenter', () => {
            buttons.style.display = 'flex';
          });
          parent.addEventListener('mouseleave', () => {
            buttons.style.display = 'none';
          });
        }

        buttons.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          const target = e.target as HTMLElement;
          const btn = target.closest('.sidebar-edit-btn') as HTMLElement;
          if (!btn) return;

          const action = btn.dataset.action;
          if (action === 'rename') {
            const newLabel = prompt('New name:', label);
            if (newLabel?.trim()) {
              const textNode = Array.from(link.childNodes).find(n => n.nodeType === 3);
              if (textNode) textNode.textContent = newLabel.trim();
              toast.success('Renamed (save to persist)');
            }
          } else if (action === 'delete') {
            if (confirm(`Delete "${label}"?`)) {
              parent?.remove();
              toast.success('Deleted (save to persist)');
            }
          }
        });

        link.appendChild(buttons);
      });
    }, 1000);
  };

  const removeSidebarEditButtons = () => {
    document.querySelectorAll('.sidebar-edit-buttons').forEach(el => el.remove());
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/cms-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });

      if (response.ok) {
        toast.success('Saved! Restart dev server to see changes.');
        markClean();
      } else {
        const data = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast.error('Failed: ' + data.error);
      }
    } catch (error: any) {
      toast.error('Cannot connect. Run: npm run admin:server');
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

  // Only render CMS overlay when explicitly in edit mode
  if (!isEditMode) return null;

  // Load article content when opening editor
  const loadArticleContent = async (docId: string) => {
    setLoadingArticle(true);
    setArticleContent('');
    setArticleTitle('');

    try {
      // First, try to get rendered content from current page
      const articleElement = document.querySelector('article') || document.querySelector('.markdown') || document.querySelector('[class*="docItemContainer"]');
      if (articleElement) {
        const clonedArticle = articleElement.cloneNode(true) as HTMLElement;
        // Remove navigation elements
        clonedArticle.querySelectorAll('.pagination-nav, .theme-doc-footer, .theme-doc-breadcrumbs, nav, .tocCollapsible').forEach(el => el.remove());
        const renderedHtml = clonedArticle.innerHTML;
        if (renderedHtml.trim()) {
          console.log('Loaded rendered content, length:', renderedHtml.length);
          setArticleContent(renderedHtml);
          const titleElement = document.querySelector('h1');
          setArticleTitle(titleElement?.textContent || docId);
          setLoadingArticle(false);
          return;
        }
      }
      console.log('No article element found on page');

      // Fallback: Convert doc ID to possible file paths
      // e.g., "platform-fundamentals/what-is-gcxone-GCXONE" -> multiple path patterns
      const pathParts = docId.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const folderName = pathParts[0];

      // Try various path patterns
      const possiblePaths = [
        `docs/${docId}.md`, // Direct path
        `docs/${folderName}/${fileName}.md`, // Simple folder/file
        `docs/${folderName}/01-${fileName}.md`, // Numbered prefix
        `docs/${folderName}/${fileName.replace(/-/g, '-')}.md`, // With dashes
      ];

      // Also try with numbered folder names
      if (folderName && !folderName.match(/^\d{2}-/)) {
        possiblePaths.push(
          `docs/01-${folderName}/${fileName}.md`,
          `docs/01-${folderName}/01-${fileName}.md`
        );
      }

      // Try each possible path
      let fileData = null;
      let foundFilePath: string | null = null;

      for (const filePath of possiblePaths) {
        try {
          const response = await fetch(`${API_URL}/file?path=${encodeURIComponent(filePath)}`);
          if (response.ok) {
            fileData = await response.json();
            foundFilePath = filePath;
            break;
          }
        } catch (e) {
          // Try next path
        }
      }

      // If not found, search in docs directory
      if (!fileData) {
        try {
          const filesResponse = await fetch(`${API_URL}/docs`);
          if (filesResponse.ok) {
            const files = await filesResponse.json();
            const findFile = (nodes: any[]): string | null => {
              for (const node of nodes) {
                if (node.type === 'file') {
                  const nodePath = node.path.replace(/\\/g, '/');
                  if (nodePath.includes(fileName) || nodePath.includes(docId.replace(/\//g, '-'))) {
                    return node.path;
                  }
                }
                if (node.children) {
                  const found = findFile(node.children);
                  if (found) return found;
                }
              }
              return null;
            };
            const foundPath = findFile(files);
            if (foundPath) {
              const response = await fetch(`${API_URL}/file?path=${encodeURIComponent(foundPath)}`);
              if (response.ok) {
                fileData = await response.json();
                foundFilePath = foundPath;
              }
            }
          }
        } catch (e) {
          console.error('Error searching files:', e);
        }
      }

      // Store the actual file path for saving
      if (foundFilePath) {
        setActualFilePath(foundFilePath);
      }

      if (fileData) {
        // Store original frontmatter
        setOriginalFrontmatter(fileData.frontmatter || {});

        // Convert markdown body to HTML for TipTap
        const { marked } = await import('marked');
        const markdownContent = fileData.body || fileData.content || '';
        console.log('File data received, markdown length:', markdownContent.length);

        if (markdownContent && markdownContent.trim()) {
          try {
            const html = await marked.parse(markdownContent);
            console.log('Converted to HTML, length:', html.length, 'preview:', html.substring(0, 200));
            setArticleContent(html);
          } catch (parseError) {
            console.error('Error parsing markdown:', parseError);
            toast.error('Error parsing markdown content');
            setArticleContent('<p></p>');
          }
        } else {
          console.warn('Article file found but content is empty');
          toast.warning('Article file found but content is empty.');
          setArticleContent('<p></p>');
        }
        setArticleTitle(fileData.frontmatter?.title || docId);
      } else {
        console.warn('Article file not found for docId:', docId, 'Tried paths:', possiblePaths);
        toast.warning(`Article file not found for "${docId}". You can create new content.`);
        setArticleContent('<p></p>');
        setArticleTitle(docId);
        setOriginalFrontmatter({});
        // Try to construct a default path for new files
        const defaultPath = `docs/${folderName}/${fileName}.md`;
        setActualFilePath(defaultPath);
      }
    } catch (error: any) {
      console.error('Error loading article:', error);
      toast.error('Error loading article: ' + (error.message || 'Unknown error'));
      setArticleContent('');
      setArticleTitle(currentDocId || '');
    } finally {
      setLoadingArticle(false);
    }
  };

  const handleOpenEditor = () => {
    if (currentDocId) {
      setShowArticleEditor(true);
      loadArticleContent(currentDocId);
    }
  };

  const handleSaveArticle = async (content: string) => {
    if (!currentDocId) {
      toast.error('No article selected');
      return;
    }

    try {
      // Convert HTML back to markdown
      const { TurndownService } = await import('turndown');
      const turndown = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
      });

      // Configure turndown to handle images
      turndown.addRule('image', {
        filter: 'img',
        replacement: (content, node: any) => {
          const src = node.getAttribute('src') || '';
          const alt = node.getAttribute('alt') || '';
          return `![${alt}](${src})`;
        },
      });

      const markdown = turndown.turndown(content);

      // Use the actual file path we found, or construct one
      let filePath = actualFilePath;
      if (!filePath) {
        const pathParts = currentDocId.split('/');
        const fileName = pathParts[pathParts.length - 1];
        const folderName = pathParts[0];
        filePath = `docs/${folderName}/${fileName}.md`;
      }

      // Merge frontmatter with title
      const frontmatter = {
        ...originalFrontmatter,
        title: articleTitle || originalFrontmatter.title || currentDocId,
      };

      // Construct the full markdown with frontmatter
      const frontmatterYaml = Object.entries(frontmatter)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
          }
          return `${key}: "${String(value).replace(/"/g, '\\"')}"`;
        })
        .join('\n');

      const fullContent = `---\n${frontmatterYaml}\n---\n\n${markdown}`;

      const response = await fetch(`${API_URL}/file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath,
          content: fullContent,
          frontmatter,
        }),
      });

      if (response.ok) {
        // Save to CMS context
        updateArticle(currentDocId, {
          docId: currentDocId,
          title: articleTitle || currentDocId,
          content,
          frontmatter,
        });

        toast.success('Article saved successfully!');
        setShowArticleEditor(false);
        setArticleContent('');
        setArticleTitle('');
        setActualFilePath(null);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        toast.error('Failed to save: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast.error('Error saving article: ' + (error.message || 'Unknown error'));
    }
  };

  const handleCreateNewArticle = () => {
    setShowNewArticleModal(true);
    setNewArticleTitle('');
    setNewArticlePath('');
  };

  const handleNewArticleSubmit = async () => {
    if (!newArticleTitle.trim()) {
      toast.error('Please enter an article title');
      return;
    }

    // Generate a slug from the title
    const slug = newArticleTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Construct the file path (with numbered prefix for file system)
    let filePath: string;
    let docId: string; // URL path without numbered prefix
    
    if (newArticlePath) {
      // Remove numbered prefix from folder name for docId (e.g., "01-platform-fundamentals" -> "platform-fundamentals")
      const folderWithoutPrefix = newArticlePath.replace(/^\d{2}-/, '');
      docId = `${folderWithoutPrefix}/${slug}`;
      filePath = `docs/${newArticlePath}/${slug}.md`;
    } else {
      // Default to platform-fundamentals if no path specified
      docId = `platform-fundamentals/${slug}`;
      filePath = `docs/01-platform-fundamentals/${slug}.md`;
    }

    // Set up the new article editor
    setCurrentDocId(docId);
    setArticleTitle(newArticleTitle);
    setArticleContent('<p></p>');
    setActualFilePath(filePath);
    setOriginalFrontmatter({ title: newArticleTitle });
    setShowNewArticleModal(false);
    setShowArticleEditor(true);
    setNewArticleTitle('');
    setNewArticlePath('');
  };

  return (
    <>
      {/* Global CMS Toolbar - Always visible when in edit mode */}
      <div className={cmsStyles.cmsToolbar} data-testid="cms-toolbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
        <div className={cmsStyles.toolbarLeft}>
          <h2 data-testid="cms-toolbar-title">🎨 Visual CMS - Edit Mode</h2>
          {isDirty && <span className={cmsStyles.dirtyIndicator} data-testid="dirty-indicator">• Unsaved changes</span>}
          {serverStatus === 'offline' && (
            <span className={cmsStyles.serverOffline} data-testid="server-offline-indicator" title="Admin server not running. Start it with: npm run admin:server">
              ⚠️ Admin server offline
            </span>
          )}
          {serverStatus === 'online' && (
            <span className={cmsStyles.serverOnline} data-testid="server-online-indicator">✓ Admin server online</span>
          )}
        </div>
        <div className={cmsStyles.toolbarRight}>
          <button className={cmsStyles.toolbarButton} data-testid="create-article-button" onClick={handleCreateNewArticle}>
            <Plus size={16} />
            Create New Article
          </button>
          <button className={cmsStyles.toolbarButton} data-testid="edit-sidebar-button" onClick={() => setShowSidebarEditor(true)}>
            <Menu size={16} />
            Edit Sidebar
          </button>
          <button
            className={`${cmsStyles.toolbarButton} ${cmsStyles.saveButton} ${isDirty ? cmsStyles.saveButtonActive : ''}`}
            data-testid="save-button"
            onClick={handleSave}
            disabled={saving || !isDirty}
          >
            <Save size={16} />
            {saving ? 'Saving...' : isDirty ? 'Save Changes' : 'Saved'}
          </button>
          <button className={cmsStyles.toolbarButton} data-testid="export-button" onClick={handleExport}>
            <Download size={16} />
            Export Config
          </button>
          <button className={cmsStyles.toolbarButton} data-testid="exit-edit-mode-button" onClick={handleExitEditMode}>
            <X size={16} />
            Exit Edit Mode
          </button>
        </div>
      </div>



      {/* Floating Edit Button on Doc Pages - Only show in CMS edit mode */}
      {isDocPage && !showArticleEditor && isEditMode && (
        <div className={styles.floatingEditButton} data-testid="floating-edit-button-container">
          <button
            className={styles.editButton}
            data-testid="edit-article-button"
            onClick={handleOpenEditor}
            title="Edit Article Content"
          >
            <Edit size={20} />
            <span>Edit Article</span>
          </button>
        </div>
      )}

      {/* Article Editor Modal */}
      {showArticleEditor && currentDocId && (
        <div className={styles.editorModal} data-testid="article-editor-modal">
          <div className={styles.editorModalContent} data-testid="article-editor-modal-content">
            <button
              className={styles.closeButton}
              data-testid="article-editor-close-button"
              onClick={() => {
                setShowArticleEditor(false);
                setArticleContent('');
                setArticleTitle('');
              }}
            >
              <X size={20} />
            </button>
            {loadingArticle ? (
              <div style={{ padding: '2rem' }}>
                <SkeletonEditor />
                <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--ifm-color-content-secondary)', fontSize: '0.875rem' }}>
                  Loading article content...
                </p>
              </div>
            ) : articleContent ? (
              <ArticleEditor
                key={`${currentDocId}-${articleContent.substring(0, 50)}`} // Force re-render when content changes
                content={articleContent}
                title={articleTitle || currentDocId || ''}
                onSave={handleSaveArticle}
                onCancel={() => {
                  setShowArticleEditor(false);
                  setArticleContent('');
                  setArticleTitle('');
                  setActualFilePath(null);
                  setOriginalFrontmatter({});
                }}
                onTitleChange={(title) => {
                  setArticleTitle(title);
                }}
              />
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ifm-color-content)' }}>
                <p>No content found. You can start editing to create new content.</p>
                <ArticleEditor
                  key={currentDocId}
                  content="<p></p>"
                  title={articleTitle || currentDocId || ''}
                  onSave={handleSaveArticle}
                  onCancel={() => {
                    setShowArticleEditor(false);
                    setArticleContent('');
                    setArticleTitle('');
                  }}
                  onTitleChange={(title) => {
                    setArticleTitle(title);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {/* New Article Modal */}
      {showNewArticleModal && (
        <div className={cmsStyles.modalOverlay} data-testid="new-article-modal-overlay" onClick={() => {
          setShowNewArticleModal(false);
          setNewArticleTitle('');
          setNewArticlePath('');
        }}>
          <div className={cmsStyles.modal} data-testid="new-article-modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className={cmsStyles.modalHeader}>
              <h2 data-testid="new-article-modal-title">Create New Article</h2>
              <button
                className={styles.closeButton}
                data-testid="new-article-modal-close-button"
                onClick={() => {
                  setShowNewArticleModal(false);
                  setNewArticleTitle('');
                  setNewArticlePath('');
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className={cmsStyles.modalContent} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--nxgen-text)' }}>
                  Article Title *
                </label>
                <input
                  type="text"
                  data-testid="new-article-title-input"
                  value={newArticleTitle}
                  onChange={(e) => setNewArticleTitle(e.target.value)}
                  className={cmsStyles.input}
                  placeholder="e.g., Getting Started with GCXONE"
                  style={{ width: '100%' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleNewArticleSubmit();
                    }
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--nxgen-text)' }}>
                  Folder Path (optional)
                </label>
                <select
                  data-testid="new-article-path-select"
                  value={newArticlePath}
                  onChange={(e) => setNewArticlePath(e.target.value)}
                  className={cmsStyles.input}
                  style={{ width: '100%' }}
                >
                  <option value="">01-platform-fundamentals (default)</option>
                  {availableFolders.map((folder) => (
                    <option key={folder} value={folder}>
                      {folder}
                    </option>
                  ))}
                </select>
                <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--nxgen-text-secondary)' }}>
                  The article will be created in the selected folder. If no folder is selected, it will be created in the default folder.
                </small>
              </div>
            </div>
            <div className={cmsStyles.modalFooter}>
              <button
                className={cmsStyles.buttonSecondary}
                data-testid="new-article-cancel-button"
                onClick={() => {
                  setShowNewArticleModal(false);
                  setNewArticleTitle('');
                  setNewArticlePath('');
                }}
              >
                Cancel
              </button>
              <button
                className={cmsStyles.buttonPrimary}
                data-testid="new-article-create-button"
                onClick={handleNewArticleSubmit}
                disabled={!newArticleTitle.trim()}
              >
                Create Article
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" theme="dark" />
    </>
  );
}
