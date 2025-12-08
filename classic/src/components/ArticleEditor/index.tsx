import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Video } from './VideoExtension';
import { 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, 
  Link as LinkIcon, Image as ImageIcon, Video as VideoIcon, 
  Save, X, Code, Quote, Minus, Undo, Redo
} from 'lucide-react';
import styles from './styles.module.css';

interface ArticleEditorProps {
  content: string;
  onSave: (content: string) => void;
  onCancel: () => void;
  title?: string;
  onTitleChange?: (title: string) => void;
}

export default function ArticleEditor({ content, onSave, onCancel, title, onTitleChange }: ArticleEditorProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: 'code-block',
          },
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Video.configure({
        HTMLAttributes: {
          controls: true,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'link',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || '<p></p>', // Always provide some content
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            handleFileUpload(file);
            return true;
          }
        }
        return false;
      },
      handleDOMEvents: {
        dragover: (view, event) => {
          event.preventDefault();
          setIsDragOver(true);
          return false;
        },
        dragleave: (view, event) => {
          const target = event.relatedTarget as Node | null;
          if (event.currentTarget && target && !(event.currentTarget as HTMLElement).contains(target)) {
            setIsDragOver(false);
          }
          return false;
        },
        drop: (view, event) => {
          setIsDragOver(false);
          return false;
        },
      },
    },
  });

  useEffect(() => {
    if (editor) {
      const currentContent = editor.getHTML();
      // Always update if content is provided and different (even if empty)
      if (content !== undefined && content !== currentContent) {
        console.log('Updating editor content, length:', content.length, 'current:', currentContent.length);
        // Use a small delay to ensure editor is ready
        setTimeout(() => {
          if (editor && !editor.isDestroyed) {
            editor.commands.setContent(content || '<p></p>');
          }
        }, 100);
      }
    }
  }, [content, editor]);

  const handleSave = () => {
    if (editor) {
      onSave(editor.getHTML());
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file && editor) {
      // Compress image if needed
      try {
        const { default: imageCompression } = await import('browser-image-compression');
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          editor.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        // Fallback to original file if compression fails
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          editor.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleFileUpload(file);
      }
    };
    input.click();
  };

  const handleVideoUpload = () => {
    const url = window.prompt('Enter video URL (YouTube, Vimeo, or direct video URL):');
    if (url && editor) {
      editor.chain().focus().setVideo({ src: url }).run();
    }
  };

  const handleAddLink = () => {
    if (editor) {
      const url = window.prompt('Enter URL:');
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className={styles.articleEditor} data-testid="article-editor">
      <div className={styles.editorHeader}>
        <div className={styles.editorTitle}>
          {onTitleChange ? (
            <input
              type="text"
              data-testid="article-title-input"
              value={title || ''}
              onChange={(e) => onTitleChange(e.target.value)}
              className={styles.titleInput}
              placeholder="Article Title"
            />
          ) : (
            <h2>{title || 'Edit Article'}</h2>
          )}
        </div>
        <div className={styles.editorActions}>
          <button className={styles.saveButton} data-testid="article-save-button" onClick={handleSave}>
            <Save size={16} />
            Save
          </button>
          <button className={styles.cancelButton} data-testid="article-cancel-button" onClick={onCancel}>
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>

      <div className={styles.toolbar} data-testid="article-editor-toolbar">
        {/* Text Formatting */}
        <button
          className={`${styles.toolbarButton} ${editor.isActive('bold') ? styles.active : ''}`}
          data-testid="bold-button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <Bold size={18} />
        </button>
        <button
          className={`${styles.toolbarButton} ${editor.isActive('italic') ? styles.active : ''}`}
          data-testid="italic-button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <Italic size={18} />
        </button>
        <button
          className={`${styles.toolbarButton} ${editor.isActive('code') ? styles.active : ''}`}
          data-testid="code-button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline Code"
        >
          <Code size={18} />
        </button>
        <div className={styles.toolbarDivider} />
        
        {/* Headings */}
        <button
          className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 1 }) ? styles.active : ''}`}
          data-testid="heading1-button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 2 }) ? styles.active : ''}`}
          data-testid="heading2-button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <button
          className={`${styles.toolbarButton} ${editor.isActive('heading', { level: 3 }) ? styles.active : ''}`}
          data-testid="heading3-button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        >
          <Heading2 size={16} style={{ opacity: 0.7 }} />
        </button>
        <div className={styles.toolbarDivider} />
        
        {/* Lists */}
        <button
          className={`${styles.toolbarButton} ${editor.isActive('bulletList') ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          className={`${styles.toolbarButton} ${editor.isActive('orderedList') ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>
        <button
          className={`${styles.toolbarButton} ${editor.isActive('blockquote') ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <Quote size={18} />
        </button>
        <button
          className={`${styles.toolbarButton} ${editor.isActive('codeBlock') ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
        >
          <Code size={18} />
        </button>
        <div className={styles.toolbarDivider} />
        
        {/* Media */}
        <button
          className={`${styles.toolbarButton} ${editor.isActive('link') ? styles.active : ''}`}
          onClick={handleAddLink}
          title="Add Link"
        >
          <LinkIcon size={18} />
        </button>
        <button className={styles.toolbarButton} onClick={handleImageUpload} title="Upload Image">
          <ImageIcon size={18} />
        </button>
        <button className={styles.toolbarButton} onClick={handleVideoUpload} title="Add Video">
          <VideoIcon size={18} />
        </button>
        <div className={styles.toolbarDivider} />
        
        {/* Table */}
        <button
          className={styles.toolbarButton}
          data-testid="table-button"
          onClick={() => {
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
          }}
          title="Insert Table"
        >
          <Minus size={18} />
        </button>
        {editor.isActive('table') && (
          <>
            <button
              className={styles.toolbarButton}
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              title="Add Column Before"
            >
              +
            </button>
            <button
              className={styles.toolbarButton}
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="Add Column After"
            >
              +
            </button>
            <button
              className={styles.toolbarButton}
              onClick={() => editor.chain().focus().deleteColumn().run()}
              title="Delete Column"
            >
              −
            </button>
            <button
              className={styles.toolbarButton}
              onClick={() => editor.chain().focus().addRowBefore().run()}
              title="Add Row Before"
            >
              +
            </button>
            <button
              className={styles.toolbarButton}
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="Add Row After"
            >
              +
            </button>
            <button
              className={styles.toolbarButton}
              onClick={() => editor.chain().focus().deleteRow().run()}
              title="Delete Row"
            >
              −
            </button>
            <button
              className={styles.toolbarButton}
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="Delete Table"
            >
              ×
            </button>
          </>
        )}
        <div className={styles.toolbarDivider} />
        
        {/* Undo/Redo */}
        <button
          className={styles.toolbarButton}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo size={18} />
        </button>
        <button
          className={styles.toolbarButton}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo size={18} />
        </button>
      </div>

      <div className={`${styles.editorContainer} ${isDragOver ? styles.dragOver : ''}`} data-testid="article-editor-content">
        <EditorContent editor={editor} />
        {isDragOver && (
          <div className={styles.dragOverlay}>
            <div className={styles.dragMessage}>
              <ImageIcon size={48} />
              <p>Drop image here to upload</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

