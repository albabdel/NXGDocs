import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses DOMPurify with strict allowlist
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      // Headings
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Text formatting
      'p', 'br', 'hr', 'strong', 'em', 'u', 's', 'code', 'pre',
      // Lists
      'ul', 'ol', 'li',
      // Links and media
      'a', 'img',
      // Quotes and blocks
      'blockquote',
      // Tables
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      // Containers
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'width', 'height',
      'class', 'id'
    ],
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: true
  });
}

/**
 * Sanitize rich text from Storyblok
 */
export function sanitizeRichText(richTextHTML: string): string {
  return sanitizeHTML(richTextHTML);
}





