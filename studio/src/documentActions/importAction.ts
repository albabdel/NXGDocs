import {type DocumentActionComponent, useClient} from 'sanity'
import {useState} from 'react'

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
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        blocks.push({
          _type: 'block',
          listItem: 'bullet',
          children: [{_type: 'span', text: trimmed.slice(2), marks: []}],
          markDefs: [],
        })
      } else {
        blocks.push({
          _type: 'block',
          style: 'normal',
          children: [{_type: 'span', text: trimmed, marks: []}],
          markDefs: [],
        })
      }
    }
  }
  
  return blocks.length > 0 ? blocks : [{_type: 'block', children: [{_type: 'span', text: ''}], markDefs: []}]
}

function htmlToPortableText(html: string): any[] {
  const blocks: any[] = []
  
  if (typeof document === 'undefined') {
    return textToPortableText(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
  }
  
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  
  for (const el of Array.from(tempDiv.children)) {
    const tag = el.tagName?.toLowerCase()
    const text = el.textContent?.trim() || ''
    
    if (!text && !['img', 'br', 'hr'].includes(tag)) continue
    
    switch (tag) {
      case 'h1':
        blocks.push({_type: 'block', style: 'h1', children: [{_type: 'span', text, marks: []}], markDefs: []})
        break
      case 'h2':
        blocks.push({_type: 'block', style: 'h2', children: [{_type: 'span', text, marks: []}], markDefs: []})
        break
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        blocks.push({_type: 'block', style: 'h3', children: [{_type: 'span', text, marks: []}], markDefs: []})
        break
      case 'blockquote':
        blocks.push({_type: 'block', style: 'blockquote', children: [{_type: 'span', text, marks: []}], markDefs: []})
        break
      case 'ul':
        el.querySelectorAll('li').forEach(li => {
          const liText = li.textContent?.trim() || ''
          if (liText) {
            blocks.push({_type: 'block', listItem: 'bullet', children: [{_type: 'span', text: liText, marks: []}], markDefs: []})
          }
        })
        break
      case 'ol':
        el.querySelectorAll('li').forEach(li => {
          const liText = li.textContent?.trim() || ''
          if (liText) {
            blocks.push({_type: 'block', listItem: 'number', children: [{_type: 'span', text: liText, marks: []}], markDefs: []})
          }
        })
        break
      default:
        if (text && !['script', 'style', 'head', 'meta', 'link'].includes(tag)) {
          blocks.push({_type: 'block', style: 'normal', children: [{_type: 'span', text, marks: []}], markDefs: []})
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
  } catch (err: any) {
    throw new Error(`DOCX parsing failed: ${err.message}`)
  }
}

function parseMarkdown(content: string): ParsedContent {
  const title = extractTitle(content, 'markdown')
  return {
    title,
    body: textToPortableText(content),
    description: content.replace(/[#*`]/g, '').slice(0, 200).trim(),
  }
}

function parseHtml(content: string): ParsedContent {
  const title = extractTitle(content, 'html')
  return {
    title,
    body: htmlToPortableText(content),
    description: content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 200).trim(),
  }
}

function parseJson(content: string): ParsedContent[] {
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
  const client = useClient({apiVersion: '2024-01-01'})
  const [processing, setProcessing] = useState(false)
  
  if (type !== 'importJob') {
    return null
  }
  
  const handleImport = async () => {
    setProcessing(true)
    
    try {
      const sourceFile = (doc as any)?.sourceFile
      const fileType = (doc as any)?.fileType
      const settings = (doc as any)?.importSettings
      const targetDocType = settings?.documentType || 'doc'
      const setStatus = settings?.setStatus || 'draft'
      
      if (!sourceFile?.asset?._ref) {
        alert('Please upload a file first')
        setProcessing(false)
        return
      }
      
      if (!fileType) {
        alert('Please select a file type')
        setProcessing(false)
        return
      }
      
      await client.patch(id).set({
        status: 'processing',
        startedAt: new Date().toISOString(),
        progress: 10,
      }).commit()
      
      const assetRef = sourceFile.asset._ref
      const asset = await client.fetch(
        `*[_id == $id][0]{_id, url, originalFilename}`,
        {id: assetRef}
      )
      
      if (!asset?.url) {
        throw new Error('Could not get file URL')
      }
      
      await client.patch(id).set({progress: 20}).commit()
      
      const response = await fetch(asset.url)
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status}`)
      }
      
      const arrayBuffer = await response.arrayBuffer()
      await client.patch(id).set({progress: 30}).commit()
      
      let parsedContents: ParsedContent[] = []
      
      switch (fileType) {
        case 'docx':
          parsedContents = [await parseDocx(arrayBuffer)]
          break
        case 'pdf':
          parsedContents = [{title: 'PDF Import', body: [{_type: 'block', style: 'normal', children: [{_type: 'span', text: 'PDF requires server-side processing. Convert to DOCX or Markdown.', marks: []}], markDefs: []}], description: 'PDF file'}]
          break
        case 'markdown':
          parsedContents = [parseMarkdown(new TextDecoder().decode(arrayBuffer))]
          break
        case 'html':
          parsedContents = [parseHtml(new TextDecoder().decode(arrayBuffer))]
          break
        case 'json':
          parsedContents = parseJson(new TextDecoder().decode(arrayBuffer))
          break
        default:
          const text = new TextDecoder().decode(arrayBuffer)
          parsedContents = [{title: extractTitle(text, fileType), body: textToPortableText(text)}]
      }
      
      await client.patch(id).set({progress: 50, documentCount: parsedContents.length}).commit()
      
      const importedDocs: any[] = []
      const errors: any[] = []
      let processedCount = 0
      
      for (let i = 0; i < parsedContents.length; i++) {
        const content = parsedContents[i]
        const progress = 50 + Math.round(((i + 1) / parsedContents.length) * 40)
        
        try {
          const slug = slugify(content.title)
          
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
          
          const created = await client.create(newDoc)
          
          importedDocs.push({
            document: {_type: 'reference', _ref: created._id},
            originalName: content.title,
            status: 'success',
            message: `Created "${content.title}"`,
          })
          processedCount++
        } catch (err: any) {
          errors.push({
            timestamp: new Date().toISOString(),
            severity: 'error',
            message: err.message,
            context: content.title,
          })
          importedDocs.push({
            originalName: content.title,
            status: 'error',
            message: err.message,
          })
        }
        
        await client.patch(id).set({progress}).commit()
      }
      
      await client.patch(id).set({
        status: errors.length > 0 ? 'needs_review' : 'completed',
        completedAt: new Date().toISOString(),
        progress: 100,
        processedCount,
        errorCount: errors.length,
        importedDocuments: importedDocs,
        errors,
      }).commit()
      
      setProcessing(false)
      onComplete()
      
    } catch (err: any) {
      await client.patch(id).set({
        status: 'failed',
        completedAt: new Date().toISOString(),
        progress: 0,
        errors: [{
          timestamp: new Date().toISOString(),
          severity: 'error',
          message: err.message,
          context: 'Import',
        }],
      }).commit()
      alert(`Import failed: ${err.message}`)
      setProcessing(false)
    }
  }
  
  const sourceFile = (doc as any)?.sourceFile
  const fileType = (doc as any)?.fileType
  const status = (doc as any)?.status
  
  if (status === 'completed') {
    return {
      label: `Imported ${(doc as any)?.processedCount || 0} docs`,
      tone: 'positive' as const,
      disabled: true,
      onHandle: () => {},
    }
  }
  
  if (status === 'processing' || processing) {
    return {
      label: `Processing... ${(doc as any)?.progress || 0}%`,
      tone: 'primary' as const,
      disabled: true,
      onHandle: () => {},
    }
  }
  
  const hasFile = sourceFile?.asset?._ref
  const hasType = fileType
  
  return {
    label: processing 
      ? 'Processing...' 
      : !hasFile 
        ? 'Upload file first' 
        : !hasType 
          ? 'Select file type' 
          : 'Process Import',
    tone: hasFile && hasType ? 'positive' as const : 'default' as const,
    disabled: !hasFile || !hasType || processing,
    onHandle: handleImport,
  }
}

export const resetImportAction: DocumentActionComponent = (props) => {
  const {id, type, draft, published, onComplete} = props
  const doc = draft || published
  const client = useClient({apiVersion: '2024-01-01'})
  
  if (type !== 'importJob') {
    return null
  }
  
  const status = (doc as any)?.status
  
  if (status !== 'completed' && status !== 'failed' && status !== 'needs_review') {
    return null
  }
  
  return {
    label: 'Reset',
    tone: 'caution' as const,
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
