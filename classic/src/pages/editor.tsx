import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '@theme/Layout';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marked } from 'marked';
import TurndownService from 'turndown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import imageCompression from 'browser-image-compression';
import { SkeletonEditor } from '@site/src/components/Skeleton';
import styles from './editor.module.css';

const API_URL = 'http://localhost:3001/api';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const MAX_IMAGE_SIZE_MB = 5;

interface FileNode {
  name: string;
  displayName?: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
}

// Initialize markdown converter
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

export default function EditorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [files, setFiles] = useState<FileNode[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [frontmatter, setFrontmatter] = useState<any>({});
  const [sidebarLabel, setSidebarLabel] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [categories, setCategories] = useState<Array<{label: string; value: string}>>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionHistory, setVersionHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [viewingVersion, setViewingVersion] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      // Convert HTML to markdown whenever content changes
      const html = editor.getHTML();
      const markdown = turndownService.turndown(html);
      setMarkdownContent(markdown);
      setHasUnsavedChanges(markdown !== originalContent);
    },
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges && selectedFile) {
          saveFile();
        }
      }

      // Ctrl+B or Cmd+B for bold
      if ((e.ctrlKey || e.metaKey) && e.key === 'b' && editor) {
        e.preventDefault();
        editor.chain().focus().toggleBold().run();
      }

      // Ctrl+I or Cmd+I for italic
      if ((e.ctrlKey || e.metaKey) && e.key === 'i' && editor) {
        e.preventDefault();
        editor.chain().focus().toggleItalic().run();
      }

      // Ctrl+K or Cmd+K for link
      if ((e.ctrlKey || e.metaKey) && e.key === 'k' && editor) {
        e.preventDefault();
        const url = window.prompt('Enter link URL:');
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      }

      // Ctrl+Shift+P or Cmd+Shift+P to toggle preview
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        setShowPreview(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, hasUnsavedChanges, selectedFile]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Auto-save
  useEffect(() => {
    if (hasUnsavedChanges && selectedFile && isAuthenticated) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        saveFile(true); // true indicates auto-save
      }, AUTO_SAVE_INTERVAL);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [hasUnsavedChanges, markdownContent, selectedFile]);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFiles(files);
      return;
    }

    const filterFiles = (nodes: FileNode[]): FileNode[] => {
      return nodes.reduce((acc: FileNode[], node) => {
        if (node.type === 'folder' && node.children) {
          const filteredChildren = filterFiles(node.children);
          if (filteredChildren.length > 0) {
            acc.push({ ...node, children: filteredChildren });
          }
        } else if (node.type === 'file') {
          const searchLower = searchQuery.toLowerCase();
          const nameMatch = node.name.toLowerCase().includes(searchLower);
          const displayNameMatch = node.displayName?.toLowerCase().includes(searchLower);
          if (nameMatch || displayNameMatch) {
            acc.push(node);
          }
        }
        return acc;
      }, []);
    };

    setFilteredFiles(filterFiles(files));
  }, [searchQuery, files]);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      loadFiles(savedToken);
      loadCategories(savedToken);
    }
  }, []);

  // Drag and drop for images
  useEffect(() => {
    if (!editorRef.current) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer?.files;
      if (!files || files.length === 0 || !editor) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          await compressAndInsertImage(file);
        }
      }
    };

    const editorEl = editorRef.current;
    editorEl.addEventListener('dragover', handleDragOver);
    editorEl.addEventListener('drop', handleDrop);

    return () => {
      editorEl.removeEventListener('dragover', handleDragOver);
      editorEl.removeEventListener('drop', handleDrop);
    };
  }, [editor]);

  // Handle image paste from clipboard with compression
  useEffect(() => {
    if (!editor) return;

    const handlePaste = async (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          event.preventDefault();
          const blob = items[i].getAsFile();
          if (blob) {
            await compressAndInsertImage(blob);
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [editor]);

  const compressAndInsertImage = async (file: File) => {
    if (!editor) return;

    try {
      setUploadProgress(10);
      toast.info('Compressing image...');

      const options = {
        maxSizeMB: MAX_IMAGE_SIZE_MB,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        onProgress: (progress: number) => {
          setUploadProgress(progress);
        }
      };

      setUploadProgress(30);
      const compressedFile = await imageCompression(file, options);

      setUploadProgress(60);
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        editor.chain().focus().setImage({ src: base64 }).run();
        setUploadProgress(100);
        toast.success(`Image inserted (${(compressedFile.size / 1024).toFixed(0)}KB)`);
        setTimeout(() => setUploadProgress(0), 1000);
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
      toast.error('Failed to compress image');
      setUploadProgress(0);
    }
  };

  const checkDuplicateTitle = async (title: string): Promise<boolean> => {
    if (!title.trim()) return false;

    const checkNode = (nodes: FileNode[]): boolean => {
      for (const node of nodes) {
        if (node.type === 'folder' && node.children) {
          if (checkNode(node.children)) return true;
        } else if (node.type === 'file') {
          const nodeTitle = node.displayName || node.name;
          const currentFileName = selectedFile?.split(/[\\\/]/).pop();
          const nodeFileName = node.name;

          // Skip if it's the same file
          if (currentFileName === nodeFileName) continue;

          if (nodeTitle.toLowerCase().trim() === title.toLowerCase().trim()) {
            return true;
          }
        }
      }
      return false;
    };

    return checkNode(files);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        loadFiles(data.token);
        loadCategories(data.token);
      } else {
        toast.error('Invalid password');
      }
    } catch (error) {
      toast.error('Error connecting to admin server');
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/files`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      setFiles(data);
      setFilteredFiles(data);
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error(`Error loading file tree: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/sidebar-categories`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const createCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/sidebar-category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryLabel: newCategoryName,
          categoryDescription: newCategoryDescription || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Category created successfully');
        setShowNewCategoryModal(false);
        setNewCategoryName('');
        setNewCategoryDescription('');
        loadCategories(token);
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      toast.error('Error creating category');
    } finally {
      setLoading(false);
    }
  };

  const loadFile = async (filePath: string) => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Do you want to discard them?');
      if (!confirm) return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/file?path=${encodeURIComponent(filePath)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      // Store frontmatter and full content
      setFrontmatter(data.frontmatter || {});
      setSidebarLabel(data.frontmatter?.sidebar_label || '');
      setDocTitle(data.frontmatter?.title || '');
      setSelectedCategory(data.frontmatter?.sidebar_category || '');
      setTags(data.frontmatter?.tags || []);
      setMarkdownContent(data.content);
      setOriginalContent(data.content);
      setHasUnsavedChanges(false);

      // Convert body (content without frontmatter) to HTML for TipTap
      const html = await marked.parse(data.body || data.content);
      editor?.commands.setContent(html);

      setSelectedFile(filePath);
      toast.success('File loaded');
    } catch (error) {
      toast.error('Error loading file');
    } finally {
      setLoading(false);
    }
  };

  const saveFile = async (isAutoSave = false) => {
    if (!selectedFile) return;

    // Check for duplicate titles
    if (sidebarLabel && !isAutoSave) {
      const isDuplicate = await checkDuplicateTitle(sidebarLabel);
      if (isDuplicate) {
        const confirm = window.confirm(
          `A document with the title "${sidebarLabel}" already exists. Do you want to continue saving?`
        );
        if (!confirm) return;
      }
    }

    setSaving(true);
    try {
      // Update frontmatter with current values
      const updatedFrontmatter = {
        ...frontmatter,
        title: docTitle,
        sidebar_label: sidebarLabel,
        sidebar_category: selectedCategory || undefined,
        tags: tags.length > 0 ? tags : undefined,
      };

      const response = await fetch(`${API_URL}/file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          filePath: selectedFile,
          content: markdownContent,
          frontmatter: updatedFrontmatter
        }),
      });

      if (response.ok) {
        setOriginalContent(markdownContent);
        setHasUnsavedChanges(false);

        // If a category is selected, add document to sidebar
        if (selectedCategory && sidebarLabel && !isAutoSave) {
          const docId = selectedFile.replace(/^docs[\\\/]/, '').replace(/\.(md|mdx)$/, '');

          const sidebarResponse = await fetch(`${API_URL}/sidebar-add-doc`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              docId: docId,
              docLabel: sidebarLabel,
              categoryLabel: selectedCategory,
            }),
          });

          if (sidebarResponse.ok) {
            toast.success(isAutoSave ? 'Auto-saved' : 'Saved and added to sidebar');
          } else {
            toast.success(isAutoSave ? 'Auto-saved' : 'Saved (sidebar update may have failed)');
          }
        } else {
          toast.success(isAutoSave ? 'Auto-saved' : 'Saved successfully');
        }
      } else {
        const errorText = await response.text();
        console.error('Server error:', response.status, errorText);
        toast.error(`Error: ${response.status} - ${errorText || response.statusText}`);
      }
    } catch (error) {
      console.error('Network/Save error:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      await compressAndInsertImage(file);
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.path} style={{ paddingLeft: `${level * 16}px` }}>
        {node.type === 'folder' ? (
          <div className={styles.folder}>
            <span className={styles.folderIcon}>📁</span>
            <span className={styles.folderName}>{node.name}</span>
            {node.children && renderFileTree(node.children, level + 1)}
          </div>
        ) : (
          <div
            className={`${styles.file} ${selectedFile === node.path ? styles.fileActive : ''
              }`}
            onClick={() => loadFile(node.path)}
          >
            <span className={styles.fileIcon}>📄</span>
            <span className={styles.fileName}>{node.displayName || node.name}</span>
          </div>
        )}
      </div>
    ));
  };

  // Load available tags from search index
  useEffect(() => {
    const loadAvailableTags = async () => {
      try {
        const response = await fetch('/search-index.json');
        const searchIndex = await response.json();

        const tagSet = new Set<string>();
        searchIndex.forEach((item: any) => {
          if (item.tags && Array.isArray(item.tags)) {
            item.tags.forEach((tag: string) => tagSet.add(tag));
          }
        });

        setAvailableTags(Array.from(tagSet).sort());
      } catch (error) {
        console.error('Failed to load available tags:', error);
      }
    };

    loadAvailableTags();
  }, []);

  // Tag management functions
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setHasUnsavedChanges(true);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setHasUnsavedChanges(true);
  };

  const handleAddNewTag = () => {
    if (newTagInput.trim()) {
      addTag(newTagInput);
      setNewTagInput('');
    }
  };

  const handleAddExistingTag = (tag: string) => {
    addTag(tag);
  };

  // Version history functions
  const loadVersionHistory = async () => {
    if (!selectedFile) return;

    setLoadingHistory(true);
    try {
      const response = await fetch(
        `${API_URL}/file-history?path=${encodeURIComponent(selectedFile)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const history = await response.json();
        setVersionHistory(history);
        setShowVersionHistory(true);
      } else {
        toast.error('Failed to load version history');
      }
    } catch (error) {
      toast.error('Error loading version history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const viewVersion = async (commit: string) => {
    if (!selectedFile) return;

    try {
      const response = await fetch(
        `${API_URL}/file-version?path=${encodeURIComponent(selectedFile)}&commit=${commit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const html = await marked.parse(data.body || data.content);
        editor?.commands.setContent(html);
        setViewingVersion(commit);
        toast.info('Viewing historical version (read-only)');
      } else {
        toast.error('Failed to load version');
      }
    } catch (error) {
      toast.error('Error loading version');
    }
  };

  const restoreVersion = async (commit: string) => {
    if (!selectedFile) return;

    const confirmed = window.confirm(
      'Are you sure you want to restore this version? This will replace your current content.'
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/file-restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          filePath: selectedFile,
          commit: commit,
          author: 'Admin',
        }),
      });

      if (response.ok) {
        toast.success('Version restored successfully');
        setShowVersionHistory(false);
        setViewingVersion(null);
        // Reload the file to show the restored version
        loadFile(selectedFile);
      } else {
        toast.error('Failed to restore version');
      }
    } catch (error) {
      toast.error('Error restoring version');
    }
  };

  const exitVersionView = () => {
    if (!selectedFile) return;
    setViewingVersion(null);
    loadFile(selectedFile);
    toast.info('Returned to current version');
  };

  if (!isAuthenticated) {
    return (
      <Layout title="Admin Login">
        <div className={styles.loginContainer}>
          <div className={styles.loginBox}>
            <div className={styles.loginHeader}>
              <h1>🔒 NXGEN Documentation Admin</h1>
              <p>Enter your password to continue</p>
            </div>
            <form onSubmit={handleLogin} className={styles.loginForm}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={styles.passwordInput}
                autoFocus
                disabled={loading}
              />
              <button type="submit" className={styles.loginButton} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className={styles.loginFooter}>
              <p>Default password: <code>admin123</code></p>
              <p className={styles.hint}>
                Change password in <code>admin-server.js</code>
              </p>
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-right" theme="dark" />
      </Layout>
    );
  }

  if (!editor) {
    return (
      <Layout title="Content Editor">
        <div className={styles.loadingContainer}>
          <SkeletonEditor />
          <p>Loading editor...</p>
        </div>
        <ToastContainer position="bottom-right" theme="dark" />
      </Layout>
    );
  }

  return (
    <Layout title="Content Editor">
      <div className={styles.editorContainer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>📝 Content Editor</h1>
            {selectedFile && (
              <span className={styles.currentFile}>
                {selectedFile}
                {hasUnsavedChanges && <span className={styles.unsavedIndicator}> • Unsaved</span>}
              </span>
            )}
          </div>
          <div className={styles.headerRight}>
            <div className={styles.shortcuts}>
              <span className={styles.shortcut} title="Save">Ctrl+S</span>
              <span className={styles.shortcut} title="Toggle Preview">Ctrl+Shift+P</span>
            </div>
            {selectedFile && (
              <button
                onClick={loadVersionHistory}
                disabled={loadingHistory}
                className={styles.versionButton}
                title="View version history"
              >
                {loadingHistory ? '⏳ Loading...' : '📋 Version History'}
              </button>
            )}
            {viewingVersion && (
              <button
                onClick={exitVersionView}
                className={styles.exitVersionButton}
                title="Return to current version"
              >
                ← Back to Current
              </button>
            )}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={styles.toggleButton}
            >
              {showPreview ? '👁️ Hide Preview' : '👁️ Show Preview'}
            </button>
            <button
              onClick={() => saveFile(false)}
              disabled={saving || !hasUnsavedChanges}
              className={`${styles.saveButton} ${hasUnsavedChanges ? styles.saveButtonActive : ''}`}
            >
              {saving ? '💾 Saving...' : hasUnsavedChanges ? '💾 Save' : '✓ Saved'}
            </button>
            <button
              onClick={() => {
                if (hasUnsavedChanges) {
                  const confirm = window.confirm('You have unsaved changes. Are you sure you want to logout?');
                  if (!confirm) return;
                }
                localStorage.removeItem('admin_token');
                setIsAuthenticated(false);
                toast.info('Logged out');
              }}
              className={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3>📁 Documentation Files</h3>
              <input
                type="text"
                placeholder="🔍 Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.fileTree}>
              {loading && files.length === 0 ? (
                <div className={styles.loadingTree}>
                  <div className={styles.spinner}></div>
                  <p>Loading files...</p>
                </div>
              ) : (
                renderFileTree(filteredFiles)
              )}
            </div>
          </div>

          {/* Editor */}
          <div className={styles.editorPane} ref={editorRef}>
            {selectedFile ? (
              <div className={styles.richEditor}>
                {/* Upload Progress Bar */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}

                {/* Document Metadata */}
                <div className={styles.metadataSection}>
                  <div className={styles.metadataField}>
                    <label htmlFor="docTitle" className={styles.metadataLabel}>
                      📝 Document Title:
                    </label>
                    <input
                      id="docTitle"
                      type="text"
                      className={styles.metadataInput}
                      value={docTitle}
                      onChange={(e) => {
                        setDocTitle(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Enter document title"
                    />
                  </div>
                  <div className={styles.metadataField}>
                    <label htmlFor="sidebarLabel" className={styles.metadataLabel}>
                      🏷️ Sidebar Label (how it appears in navigation):
                    </label>
                    <input
                      id="sidebarLabel"
                      type="text"
                      className={styles.metadataInput}
                      value={sidebarLabel}
                      onChange={(e) => {
                        setSidebarLabel(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Enter sidebar label"
                    />
                  </div>
                  <div className={styles.metadataField}>
                    <label htmlFor="sidebarCategory" className={styles.metadataLabel}>
                      📂 Sidebar Category (which section to add this document to):
                    </label>
                    <div className={styles.categoryControls}>
                      <select
                        id="sidebarCategory"
                        className={styles.metadataInput}
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setHasUnsavedChanges(true);
                        }}
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowNewCategoryModal(true)}
                        className={styles.newCategoryButton}
                        type="button"
                        title="Create new category"
                      >
                        ➕ New Category
                      </button>
                    </div>
                  </div>

                  {/* Tag Management */}
                  <div className={styles.metadataField}>
                    <label className={styles.metadataLabel}>
                      🏷️ Tags (for search and categorization):
                    </label>

                    {/* Current Tags */}
                    <div className={styles.currentTags}>
                      {tags.length === 0 ? (
                        <span className={styles.noTagsMessage}>No tags yet. Add tags below to make this article searchable.</span>
                      ) : (
                        tags.map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className={styles.tagRemove}
                              type="button"
                              title="Remove tag"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>

                    {/* Add New Tag */}
                    <div className={styles.tagInputSection}>
                      <div className={styles.tagInputGroup}>
                        <input
                          type="text"
                          className={styles.tagInput}
                          placeholder="Add a new tag (e.g., 'Nova99x', 'Bulk Import')"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddNewTag();
                            }
                          }}
                        />
                        <button
                          onClick={handleAddNewTag}
                          className={styles.addTagButton}
                          type="button"
                          disabled={!newTagInput.trim()}
                        >
                          ➕ Add Tag
                        </button>
                      </div>

                      {/* Available Tags */}
                      {availableTags.length > 0 && (
                        <div className={styles.availableTagsSection}>
                          <span className={styles.availableTagsLabel}>Or select from existing tags:</span>
                          <div className={styles.availableTags}>
                            {availableTags
                              .filter(tag => !tags.includes(tag))
                              .slice(0, 15)
                              .map((tag) => (
                                <button
                                  key={tag}
                                  onClick={() => handleAddExistingTag(tag)}
                                  className={styles.availableTag}
                                  type="button"
                                  title={`Add tag: ${tag}`}
                                >
                                  + {tag}
                                </button>
                              ))}
                            {availableTags.filter(tag => !tags.includes(tag)).length > 15 && (
                              <span className={styles.moreTagsHint}>
                                +{availableTags.filter(tag => !tags.includes(tag)).length - 15} more...
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Formatting Toolbar */}
                <div className={styles.toolbar}>
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Bold (Ctrl+B)"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Italic (Ctrl+I)"
                  >
                    <em>I</em>
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Strikethrough"
                  >
                    <s>S</s>
                  </button>
                  <div className={styles.toolbarDivider}></div>
                  <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Heading 1"
                  >
                    H1
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Heading 3"
                  >
                    H3
                  </button>
                  <div className={styles.toolbarDivider}></div>
                  <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Bullet List"
                  >
                    • List
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Numbered List"
                  >
                    1. List
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Code Block"
                  >
                    {'</>'}
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Quote"
                  >
                    " Quote
                  </button>
                  <div className={styles.toolbarDivider}></div>
                  <button
                    onClick={handleImageUpload}
                    className={styles.toolbarButton}
                    title="Upload Image (drag & drop supported)"
                  >
                    🖼️ Image
                  </button>
                  <button
                    onClick={() => {
                      const url = window.prompt('Enter link URL:');
                      if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                      }
                    }}
                    className={editor.isActive('link') ? styles.toolbarButtonActive : styles.toolbarButton}
                    title="Insert Link (Ctrl+K)"
                  >
                    🔗 Link
                  </button>
                  <button
                    onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    className={styles.toolbarButton}
                    title="Insert Table"
                  >
                    📊 Table
                  </button>
                  <div className={styles.toolbarDivider}></div>
                  <button
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className={styles.toolbarButton}
                    title="Horizontal Line"
                  >
                    ─ Line
                  </button>
                  <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className={styles.toolbarButton}
                    title="Undo (Ctrl+Z)"
                  >
                    ↶ Undo
                  </button>
                  <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className={styles.toolbarButton}
                    title="Redo (Ctrl+Y)"
                  >
                    ↷ Redo
                  </button>
                </div>

                {/* TipTap Editor */}
                <div className={styles.editorContent}>
                  <EditorContent editor={editor} />
                  <div className={styles.dropZoneHint}>
                    💡 Drag & drop images here, or paste from clipboard
                  </div>
                </div>

                {/* Hidden file input for image upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className={styles.emptyState}>
                <h2>Welcome to NXGEN Documentation Editor</h2>
                <p>Select a file from the sidebar to start editing</p>
                <div className={styles.features}>
                  <p>✨ Rich text editing with formatting toolbar</p>
                  <p>🖼️ Drag & drop or paste images directly</p>
                  <p>💾 Auto-save every 30 seconds</p>
                  <p>⌨️ Keyboard shortcuts (Ctrl+S, Ctrl+B, Ctrl+I)</p>
                  <p>📝 Write naturally like a word processor</p>
                  <p>👁️ Live markdown preview</p>
                  <p>🗜️ Automatic image compression</p>
                  <p>🔍 File tree search</p>
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          {showPreview && selectedFile && (
            <div className={styles.previewPane}>
              <div className={styles.previewHeader}>
                <h3>Preview</h3>
              </div>
              <div className={styles.preview}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownContent}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Category Modal */}
      {showNewCategoryModal && (
        <div className={styles.modalOverlay} onClick={() => setShowNewCategoryModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Create New Sidebar Category</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowNewCategoryModal(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalField}>
                <label htmlFor="newCategoryName">Category Name:</label>
                <input
                  id="newCategoryName"
                  type="text"
                  className={styles.modalInput}
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Troubleshooting"
                  autoFocus
                />
              </div>
              <div className={styles.modalField}>
                <label htmlFor="newCategoryDescription">Description (optional):</label>
                <textarea
                  id="newCategoryDescription"
                  className={styles.modalTextarea}
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Brief description of this category"
                  rows={3}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalCancelButton}
                onClick={() => setShowNewCategoryModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.modalCreateButton}
                onClick={createCategory}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionHistory && (
        <div className={styles.modalOverlay} onClick={() => setShowVersionHistory(false)}>
          <div className={styles.versionModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>📋 Version History</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowVersionHistory(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              {versionHistory.length === 0 ? (
                <div className={styles.emptyHistory}>
                  <p>No version history available for this file.</p>
                  <p className={styles.emptyHistoryHint}>
                    Version history will appear here after you save changes to this document.
                  </p>
                </div>
              ) : (
                <div className={styles.versionList}>
                  {versionHistory.map((version, index) => (
                    <div key={version.commit} className={styles.versionItem}>
                      <div className={styles.versionHeader}>
                        <div className={styles.versionInfo}>
                          <span className={styles.versionBadge}>
                            {index === 0 ? '🟢 Latest' : `v${versionHistory.length - index}`}
                          </span>
                          <span className={styles.versionDate}>
                            {new Date(version.date).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className={styles.versionAuthor}>by {version.author}</span>
                        </div>
                        <div className={styles.versionActions}>
                          <button
                            className={styles.viewVersionButton}
                            onClick={() => {
                              viewVersion(version.commit);
                              setShowVersionHistory(false);
                            }}
                            title="Preview this version"
                          >
                            👁️ View
                          </button>
                          {index !== 0 && (
                            <button
                              className={styles.restoreVersionButton}
                              onClick={() => restoreVersion(version.commit)}
                              title="Restore this version"
                            >
                              ↶ Restore
                            </button>
                          )}
                        </div>
                      </div>
                      <div className={styles.versionMessage}>{version.message}</div>
                      <div className={styles.versionCommit}>
                        Commit: <code>{version.commit.substring(0, 7)}</code>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <div className={styles.versionFooterInfo}>
                <span>💡 Tip: Click "View" to preview older versions, or "Restore" to revert to them.</span>
              </div>
              <button
                className={styles.modalCancelButton}
                onClick={() => setShowVersionHistory(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
    </Layout>
  );
}
