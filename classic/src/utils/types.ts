export interface FileNode {
  name: string;
  displayName?: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
}

export interface Frontmatter {
  title?: string;
  sidebar_label?: string;
  sidebar_category?: string;
  tags?: string[];
  [key: string]: any;
}

export interface FileContent {
  content: string;
  body: string;
  frontmatter: Frontmatter;
}

export interface Category {
  label: string;
  value: string;
}

export interface VersionHistoryItem {
  commit: string;
  date: string;
  author: string;
  message: string;
}
