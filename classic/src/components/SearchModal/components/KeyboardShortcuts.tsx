import React, { useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Keyboard } from 'lucide-react';
import styles from './KeyboardShortcuts.module.css';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  macKeys?: string[];
}

const SHORTCUTS: ShortcutItem[] = [
  {
    keys: ['Ctrl', 'K'],
    macKeys: ['⌘', 'K'],
    description: 'Open search',
  },
  {
    keys: ['Esc'],
    description: 'Close search',
  },
  {
    keys: ['↑', '↓'],
    description: 'Navigate results',
  },
  {
    keys: ['Enter'],
    description: 'Open selected result',
  },
  {
    keys: ['Tab'],
    description: 'Switch filter',
  },
];

function isMac(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps): JSX.Element | null {
  const isMacOS = useMemo(() => isMac(), []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    },
    [isOpen, onClose]
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const content = (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Keyboard size={18} strokeWidth={2} className={styles.icon} />
            <h2 className={styles.title}>Keyboard Shortcuts</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.hint}>
            {isMacOS ? (
              <span>⌘ denotes Command key on macOS</span>
            ) : (
              <span>Ctrl denotes Control key on Windows/Linux</span>
            )}
          </div>

          <ul className={styles.list}>
            {SHORTCUTS.map((shortcut, index) => {
              const displayKeys = isMacOS && shortcut.macKeys ? shortcut.macKeys : shortcut.keys;
              return (
                <li key={index} className={styles.item}>
                  <div className={styles.keys}>
                    {displayKeys.map((key, keyIndex) => (
                      <React.Fragment key={keyIndex}>
                        <kbd className={styles.key}>{key}</kbd>
                        {keyIndex < displayKeys.length - 1 && <span className={styles.plus}>+</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  <span className={styles.description}>{shortcut.description}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.footer}>
          <kbd className={styles.footerKey}>Esc</kbd>
          <span className={styles.footerText}>to close</span>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
