export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}

export function getFileName(path: string): string {
  return path.split(/[\\/]/).pop() || '';
}
