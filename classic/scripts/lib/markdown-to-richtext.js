/**
 * MARKDOWN TO HYGRAPH RICH TEXT CONVERTER
 * Converts markdown content to Hygraph Rich Text AST format
 */

/**
 * Convert markdown to Hygraph Rich Text AST
 * @param {string} markdown - Markdown content
 * @returns {object} Hygraph Rich Text AST
 */
function markdownToRichText(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return {
      children: [
        {
          type: 'paragraph',
          children: [{ text: '' }]
        }
      ]
    };
  }

  const lines = markdown.split('\n');
  const children = [];
  let currentParagraph = [];
  let inCodeBlock = false;
  let codeBlockLines = [];
  let codeLanguage = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Code block detection
    if (trimmedLine.startsWith('```')) {
      if (!inCodeBlock) {
        // Start code block
        inCodeBlock = true;
        codeLanguage = trimmedLine.slice(3).trim() || 'text';
        codeBlockLines = [];

        // Flush current paragraph
        if (currentParagraph.length > 0) {
          children.push(createParagraph(currentParagraph.join(' ')));
          currentParagraph = [];
        }
      } else {
        // End code block
        inCodeBlock = false;
        children.push(createCodeBlock(codeBlockLines.join('\n'), codeLanguage));
        codeBlockLines = [];
        codeLanguage = '';
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Headings
    if (trimmedLine.startsWith('#')) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        children.push(createParagraph(currentParagraph.join(' ')));
        currentParagraph = [];
      }

      const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        children.push(createHeading(level, text));
      }
      continue;
    }

    // Unordered list
    if (trimmedLine.match(/^[-*+]\s+/)) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        children.push(createParagraph(currentParagraph.join(' ')));
        currentParagraph = [];
      }

      const text = trimmedLine.replace(/^[-*+]\s+/, '');
      children.push(createListItem(text, 'ul'));
      continue;
    }

    // Ordered list
    if (trimmedLine.match(/^\d+\.\s+/)) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        children.push(createParagraph(currentParagraph.join(' ')));
        currentParagraph = [];
      }

      const text = trimmedLine.replace(/^\d+\.\s+/, '');
      children.push(createListItem(text, 'ol'));
      continue;
    }

    // Empty line - paragraph break
    if (trimmedLine === '') {
      if (currentParagraph.length > 0) {
        children.push(createParagraph(currentParagraph.join(' ')));
        currentParagraph = [];
      }
      continue;
    }

    // Regular text - accumulate into paragraph
    currentParagraph.push(trimmedLine);
  }

  // Flush remaining paragraph
  if (currentParagraph.length > 0) {
    children.push(createParagraph(currentParagraph.join(' ')));
  }

  // Ensure we have at least one paragraph
  if (children.length === 0) {
    children.push({
      type: 'paragraph',
      children: [{ text: '' }]
    });
  }

  return { children };
}

/**
 * Create a paragraph node
 */
function createParagraph(text) {
  const children = parseInlineMarkdown(text);
  return {
    type: 'paragraph',
    children
  };
}

/**
 * Create a heading node
 */
function createHeading(level, text) {
  const children = parseInlineMarkdown(text);
  return {
    type: `heading-${level}`,
    children
  };
}

/**
 * Create a code block node
 */
function createCodeBlock(code, language) {
  return {
    type: 'code-block',
    children: [
      {
        text: code
      }
    ]
  };
}

/**
 * Create a list item node
 */
function createListItem(text, listType) {
  const children = parseInlineMarkdown(text);
  return {
    type: listType === 'ol' ? 'numbered-list' : 'bulleted-list',
    children: [
      {
        type: 'list-item',
        children
      }
    ]
  };
}

/**
 * Parse inline markdown (bold, italic, code, links)
 */
function parseInlineMarkdown(text) {
  const children = [];
  let currentText = '';
  let i = 0;

  while (i < text.length) {
    // Bold (**text** or __text__)
    if ((text[i] === '*' && text[i + 1] === '*') || (text[i] === '_' && text[i + 1] === '_')) {
      if (currentText) {
        children.push({ text: currentText });
        currentText = '';
      }

      const delimiter = text[i] + text[i + 1];
      const endIndex = text.indexOf(delimiter, i + 2);
      if (endIndex !== -1) {
        const boldText = text.slice(i + 2, endIndex);
        children.push({ text: boldText, bold: true });
        i = endIndex + 2;
        continue;
      }
    }

    // Italic (*text* or _text_)
    if (text[i] === '*' || text[i] === '_') {
      const delimiter = text[i];
      // Make sure it's not part of **
      if (text[i + 1] !== delimiter) {
        if (currentText) {
          children.push({ text: currentText });
          currentText = '';
        }

        const endIndex = text.indexOf(delimiter, i + 1);
        if (endIndex !== -1) {
          const italicText = text.slice(i + 1, endIndex);
          children.push({ text: italicText, italic: true });
          i = endIndex + 1;
          continue;
        }
      }
    }

    // Inline code (`code`)
    if (text[i] === '`') {
      if (currentText) {
        children.push({ text: currentText });
        currentText = '';
      }

      const endIndex = text.indexOf('`', i + 1);
      if (endIndex !== -1) {
        const codeText = text.slice(i + 1, endIndex);
        children.push({ text: codeText, code: true });
        i = endIndex + 1;
        continue;
      }
    }

    // Links [text](url)
    if (text[i] === '[') {
      const closeBracket = text.indexOf(']', i + 1);
      if (closeBracket !== -1 && text[closeBracket + 1] === '(') {
        const closeParen = text.indexOf(')', closeBracket + 2);
        if (closeParen !== -1) {
          if (currentText) {
            children.push({ text: currentText });
            currentText = '';
          }

          const linkText = text.slice(i + 1, closeBracket);
          const linkUrl = text.slice(closeBracket + 2, closeParen);
          // Note: Hygraph might handle links differently, this is a simplified version
          children.push({ text: linkText, underline: true }); // Simplified link representation
          i = closeParen + 1;
          continue;
        }
      }
    }

    currentText += text[i];
    i++;
  }

  if (currentText) {
    children.push({ text: currentText });
  }

  // Ensure we have at least one text node
  if (children.length === 0) {
    children.push({ text: '' });
  }

  return children;
}

module.exports = {
  markdownToRichText
};
