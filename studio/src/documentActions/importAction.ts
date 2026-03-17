import {type DocumentActionComponent, useClient} from 'sanity'
import {useCallback, useState} from 'react'

interface ParsedContent {
  title: string
  body: any[]
  description?: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .slice(0, 200)
}

function extractTitle(content: string, fileType: string): string {
  if (fileType === 'markdown') {
    const h1Match = content.match(/^#\s+(.+)$/m)
    if (h1Match) return h1Match[1].trim()
  }
  if (fileType === 'html') {
    const htmlH1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i)
    if (htmlH1Match) {
      return htmlH1Match[1].replace(/<[^>]+>/g, '').trim()
    }
  }
  const lines = content.split('\n').filter(l => l.trim())
  if (lines.length > 0) {
    const firstLine = lines[0].replace(/[#*_`]/g, '').trim()
    return firstLine.slice(0, 100) || 'Untitled'
  }
  return 'Untitled'
}

function textToPortableText(text: string): any[] {
  const blocks: any[] = []
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim())
  
  for (const para of paragraphs) {
    const lines = para.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      
      if (trimmed.startsWith('# ')) {
        blocks.push({
          _type: 'block',
          style: 'h1',
          children: [{_type: 'span', text: trimmed.slice(2), marks: []}],
          markDefs: [],
        })
      } else if (trimmed.startsWith('## ')) {
        blocks.push({
          _type: 'block',
          style: 'h2',
          children: [{_type: 'span', text: trimmed.slice(3), marks: []}],
          markDefs: [],
        })
      } else if (trimmed.startsWith('### ')) {
        blocks.push({
          _type: 'block',
          style: 'h3',
          children: [{_type: 'span', text: trimmed.slice(4), marks: []}],
          markDefs: [],
        })
      } else if (trimmed.startsWith('#### ')) {
        blocks.push({
          _type: 'block',
          style: 'h4',
          children: [{_type: 'span', text: trimmed.slice(5), marks: []}],
          markDefs: [],
        })
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        blocks.push({
          _type: 'block',
          listItem: 'bullet',
          children: [{_type: 'span', text: trimmed.slice(2), marks: []}],
          markDefs: [],
        })
      } else if (/^\d+\.\s/.test(trimmed)) {
        blocks.push({
          _type: 'block',
          listItem: 'number',
          children: [{_type: 'span', text: trimmed.replace(/^\d+\.\s/, ''), marks: []}],
          markDefs: [],
        })
      } else if (trimmed.startsWith('> ')) {
        blocks.push({
          _type: 'block',
          style: 'blockquote',
          children: [{_type: 'span', text: trimmed.slice(2), marks: []}],
          markDefs: [],
        })
      } else {
        const spans = parseInlineFormatting(trimmed)
        blocks.push({
          _type: 'block',
          style: 'normal',
          children: spans,
          markDefs: [],
        })
      }
    }
  }
  
  return blocks.length > 0 ? blocks : [{_type: 'block', children: [{_type: 'span', text: ''}], markDefs: []}]
}

function parseInlineFormatting(text: string): any[] {
  const spans: any[] = []
  let remaining = text
  
  const patterns = [
    {regex: /\*\*(.+?)\*\*/g, mark: 'strong'},
    {regex: /\*(.+?)\*/g, mark: 'em'},
    {regex: /`(.+?)`/g, mark: 'code'},
  ]
  
  let hasMatches = false
  for (const {regex} of patterns) {
    regex.lastIndex = 0
    if (regex.test(remaining)) {
      hasMatches = true
    }
    regex.lastIndex = 0
  }
  
  if (!hasMatches) {
    return [{_type: 'span', text, marks: []}]
  }
  
  let result = text
  for (const {regex, mark} of patterns) {
    result = result.replace(regex, `[[${mark}]]$1[[/${mark}]]`)
  }
  
  const tokenRegex = /\[\[(\w+)\]\](.*?)\[\[\/\1\]\]/g
  let lastIndex = 0
  let match
  
  while ((match = tokenRegex.exec(result)) !== null) {
    if (match.index > lastIndex) {
      spans.push({
        _type: 'span',
        text: result.slice(lastIndex, match.index),
        marks: [],
      })
    }
    spans.push({
      _type: 'span',
      text: match[2],
      marks: [match[1]],
    })
    lastIndex = match.index + match[0].length
  }
  
  if (lastIndex < result.length) {
    const remaining = result.slice(lastIndex).replace(/\[\[\/?\w+\]\]/g, '')
    if (remaining) {
      spans.push({_type: 'span', text: remaining, marks: []})
    }
  }
  
  return spans.length > 0 ? spans : [{_type: 'span', text: '', marks: []}]
}

function htmlToPortableText(html: string): any[] {
  const blocks: any[] = []
  const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null
  
  if (!tempDiv) {
    return textToPortableText(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
  }
  
  tempDiv.innerHTML = html
  const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_ELEMENT)
  const elements: Element[] = []
  
  while (walker.nextNode()) {
    const node = walker.currentNode as Element
    if (node.nodeType === Node.ELEMENT_NODE) {
      elements.push(node)
    }
  }
  
  for (const el of Array.from(tempDiv.children)) {
    const tag = el.tagName?.toLowerCase()
    const text = el.textContent?.trim() || ''
    
    if (!text && !['img', 'br', 'hr'].includes(tag)) continue
    
    switch (tag) {
      case 'h1':
        blocks.push({
          _type: 'block',
          style: 'h1',
          children: [{_type: 'span', text, marks: []}],
          markDefs: [],
        })
        break
      case 'h2':
        blocks.push({
          _type: 'block',
          style: 'h2',
          children: [{_type: 'span', text, marks: []}],
          markDefs: [],
        })
        break
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        blocks.push({
          _type: 'block',
          style: 'h3',
          children: [{_type: 'span', text, marks: []}],
          markDefs: [],
        })
        break
      case 'blockquote':
        blocks.push({
          _type: 'block',
          style: 'blockquote',
          children: [{_type: 'span', text, marks: []}],
          markDefs: [],
        })
        break
      case 'ul':
        el.querySelectorAll('li').forEach(li => {
          const liText = li.textContent?.trim() || ''
          if (liText) {
            blocks.push({
              _type: 'block',
              listItem: 'bullet',
              children: [{_type: 'span', text: liText, marks: []}],
              markDefs: [],
            })
          }
        })
        break
      case 'ol':
        el.querySelectorAll('li').forEach(li => {
          const liText = li.textContent?.trim() || ''
          if (liText) {
            blocks.push({
              _type: 'block',
              listItem: 'number',
              children: [{_type: 'span', text: liText, marks: []}],
              markDefs: [],
            })
          }
        })
        break
      case 'pre':
      case 'code':
        blocks.push({
          _type: 'code',
          code: text,
          language: 'text',
        })
        break
      case 'p':
      case 'div':
      case 'section':
      case 'article':
        if (text) {
          blocks.push({
            _type: 'block',
            style: 'normal',
            children: [{_type: 'span', text, marks: []}],
            markDefs: [],
          })
        }
        break
      default:
        if (text && !['script', 'style', 'head', 'meta', 'link'].includes(tag)) {
          blocks.push({
            _type: 'block',
            style: 'normal',
            children: [{_type: 'span', text, marks: []}],
            markDefs: [],
          })
        }
    }
  }
  
  return blocks.length > 0 ? blocks : [{_type: 'block', children: [{_type: 'span', text: ''}], markDefs: []}]
}

async function parseDocx(arrayBuffer: ArrayBuffer): Promise<ParsedContent> {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({arrayBuffer})
    const text = result.value
    const title = extractTitle(text, 'docx')
    
    return {
      title,
      body: textToPortableText(text),
      description: text.slice(0, 200).trim(),
    }
  } catch (err) {
    throw new Error('Failed to parse DOCX. Make sure mammoth is installed.')
  }
}

async function parsePdf(arrayBuffer: ArrayBuffer): Promise<ParsedContent> {
  return {
    title: 'PDF Import',
    body: [{
      _type: 'block',
      style: 'normal',
      children: [{_type: 'span', text: 'PDF import requires server-side processing. Please convert to DOCX or paste the text content.', marks: []}],
      markDefs: [],
    }],
    description: 'PDF file - requires server-side processing',
  }
}

async function parseMarkdown(content: string): Promise<ParsedContent> {
  const title = extractTitle(content, 'markdown')
  
  return {
    title,
    body: textToPortableText(content),
    description: content.replace(/[#*`]/g, '').slice(0, 200).trim(),
  }
}

async function parseHtml(content: string): Promise<ParsedContent> {
  const title = extractTitle(content, 'html')
  
  return {
    title,
    body: htmlToPortableText(content),
    description: content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 200).trim(),
  }
}

async function parseJson(content: string): Promise<ParsedContent[]> {
  const data = JSON.parse(content)
  const items: ParsedContent[] = []
  
  const parseItem = (item: any): ParsedContent => {
    const title = item.title || item.name || item.headline || 'Untitled'
    const description = item.description || item.summary || item.excerpt || ''
    let body: any[] = []
    
    if (item.body && Array.isArray(item.body)) {
      body = item.body
    } else if (item.content) {
      if (typeof item.content === 'string') {
        body = textToPortableText(item.content)
      } else if (Array.isArray(item.content)) {
        body = item.content
      }
    }
    
    return {title, body, description}
  }
  
  if (Array.isArray(data)) {
    for (const item of data) {
      items.push(parseItem(item))
    }
  } else {
    items.push(parseItem(data))
  }
  
  return items
}

export const processImportAction: DocumentActionComponent = (props) => {
  const {id, type, draft, published, onComplete} = props
  const doc = draft || published
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const client = useClient({apiVersion: '2024-01-01'})
  
  const handleImport = useCallback(async () => {
    if (!doc || type !== 'importJob') return
    
    setIsProcessing(true)
    setProgress(0)
    
    const fileType = doc.fileType as string
    const settings = doc.importSettings as any
    const targetDocType = settings?.documentType || 'doc'
    const setStatus = settings?.setStatus || 'draft'
    const createSlugs = settings?.createSlugs !== false
    
    try {
      await client.patch(id).set({
        status: 'processing',
        startedAt: new Date().toISOString(),
        progress: 0,
        errorCount: 0,
        processedCount: 0,
        importedDocuments: [],
        errors: [],
      }).commit()
      
      setProgress(10)
      
      let sourceFile = doc.sourceFile as any
      if (!sourceFile?.asset?._ref) {
        throw new Error('No source file attached')
      }
      
      const assetRef = sourceFile.asset._ref
      const assetId = assetRef.replace('file-', '').replace('-raw', '')
      const projectId = client.config().projectId
      const dataset = client.config().dataset
      
      const assetUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}`
      
      setProgress(20)
      
      const response = await fetch(assetUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`)
      }
      
      const arrayBuffer = await response.arrayBuffer()
      setProgress(30)
      
      let parsedContents: ParsedContent[] = []
      
      switch (fileType) {
        case 'docx':
          const docxResult = await parseDocx(arrayBuffer)
          parsedContents = [docxResult]
          break
        case 'pdf':
          const pdfResult = await parsePdf(arrayBuffer)
          parsedContents = [pdfResult]
          break
        case 'markdown':
          const mdText = new TextDecoder().decode(arrayBuffer)
          const mdResult = await parseMarkdown(mdText)
          parsedContents = [mdResult]
          break
        case 'html':
          const htmlText = new TextDecoder().decode(arrayBuffer)
          const htmlResult = await parseHtml(htmlText)
          parsedContents = [htmlResult]
          break
        case 'json':
          const jsonText = new TextDecoder().decode(arrayBuffer)
          parsedContents = await parseJson(jsonText)
          break
        default:
          const defaultText = new TextDecoder().decode(arrayBuffer)
          parsedContents = [{title: extractTitle(defaultText, fileType), body: textToPortableText(defaultText)}]
      }
      
      setProgress(50)
      
      await client.patch(id).set({
        documentCount: parsedContents.length,
      }).commit()
      
      const importedDocs: any[] = []
      const errors: any[] = []
      let processedCount = 0
      
      for (let i = 0; i < parsedContents.length; i++) {
        const content = parsedContents[i]
        const progressPercent = 50 + ((i + 1) / parsedContents.length) * 40;
        setProgress(Math.round(progressPercent))
        
        try {
          const slug = createSlugs ? slugify(content.title) : `import-${Date.now()}-${i}`
          
          const newDoc: any = {
            _type: targetDocType,
            title: content.title,
            slug: {current: slug, _type: 'slug'},
            status: setStatus,
            body: content.body,
          }
          
          if (content.description) {
            newDoc.description = content.description
          }
          
          if (settings?.targetFolder?._ref) {
            newDoc.folder = {_type: 'reference', _ref: settings.targetFolder._ref}
          }
          
          if (settings?.addTags && settings.addTags.length > 0) {
            newDoc.tags = settings.addTags.map((tag: any) => tag._ref)
          }
          
          const created = await client.create(newDoc)
          
          importedDocs.push({
            document: {_type: 'reference', _ref: created._id},
            originalName: content.title,
            status: 'success',
            message: `Created ${targetDocType} with slug "${slug}"`,
          })
          
          processedCount++
        } catch (err: any) {
          errors.push({
            timestamp: new Date().toISOString(),
            severity: 'error',
            message: err.message || 'Failed to create document',
            context: content.title,
          })
          
          importedDocs.push({
            originalName: content.title,
            status: 'error',
            message: err.message || 'Failed to create document',
          })
        }
      }
      
      setProgress(95)
      
      await client.patch(id).set({
        status: errors.length > 0 ? 'needs_review' : 'completed',
        completedAt: new Date().toISOString(),
        progress: 100,
        processedCount,
        errorCount: errors.length,
        importedDocuments: importedDocs,
        errors: errors,
      }).commit()
      
      setProgress(100)
      setIsProcessing(false)
      onComplete()
      
    } catch (err: any) {
      await client.patch(id).set({
        status: 'failed',
        completedAt: new Date().toISOString(),
        progress: 0,
        errors: [{
          timestamp: new Date().toISOString(),
          severity: 'error',
          message: err.message || 'Import failed',
          context: 'Import process',
        }],
      }).commit()
      
      setIsProcessing(false)
      onComplete()
    }
  }, [doc, id, type, client, onComplete])
  
  if (type !== 'importJob' || !doc) {
    return null
  }
  
  const currentStatus = (doc as any).status
  const canProcess = currentStatus === 'pending' || currentStatus === 'failed'
  
  if (!canProcess) {
    return null
  }
  
  return {
    label: isProcessing ? `Processing (${progress}%)` : 'Process Import',
    tone: 'positive',
    disabled: isProcessing,
    onHandle: handleImport,
  }
}

export const resetImportAction: DocumentActionComponent = (props) => {
  const {id, type, draft, published, onComplete} = props
  const doc = draft || published
  const client = useClient({apiVersion: '2024-01-01'})
  
  if (type !== 'importJob' || !doc) {
    return null
  }
  
  const currentStatus = (doc as any).status
  const canReset = currentStatus === 'completed' || currentStatus === 'failed' || currentStatus === 'needs_review'
  
  if (!canReset) {
    return null
  }
  
  return {
    label: 'Reset Import',
    tone: 'caution',
    onHandle: async () => {
      await client.patch(id).set({
        status: 'pending',
        progress: 0,
        startedAt: undefined,
        completedAt: undefined,
        processedCount: 0,
        errorCount: 0,
        importedDocuments: [],
        errors: [],
      }).commit()
      onComplete()
    },
  }
}
