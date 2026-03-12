import {type DocumentActionComponent} from 'sanity'
import {CopyIcon, PublishIcon, TrashIcon, DownloadIcon} from '@sanity/icons'
import {useClient} from 'sanity'

export const duplicateAction: DocumentActionComponent = (props) => {
  const {id, type, draft, published, onComplete} = props

  return {
    label: 'Duplicate',
    icon: CopyIcon,
    onHandle: async () => {
      const doc = draft || published
      if (!doc) {
        onComplete()
        return
      }
      
      const client = useClient({apiVersion: '2024-01-01'})
      const slugCurrent = (doc.slug as {current?: string})?.current
      const newDoc = {
        ...doc,
        _id: undefined,
        _createdAt: undefined,
        _updatedAt: undefined,
        _rev: undefined,
        title: `${doc.title} (Copy)`,
        slug: slugCurrent ? {current: `${slugCurrent}-copy-${Date.now()}`} : undefined,
        status: 'draft',
      }
      
      try {
        await client.create(newDoc)
        onComplete()
      } catch (err) {
        console.error('Failed to duplicate:', err)
        onComplete()
      }
    },
  }
}

export const exportMarkdownAction: DocumentActionComponent = (props) => {
  const {draft, published, onComplete} = props

  return {
    label: 'Export Markdown',
    icon: DownloadIcon,
    onHandle: () => {
      const doc = draft || published
      if (!doc) {
        onComplete()
        return
      }
      
      const markdown = generateMarkdown(doc)
      const blob = new Blob([markdown], {type: 'text/markdown'})
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const slugCurrent = (doc.slug as {current?: string})?.current
      a.download = `${slugCurrent || 'document'}.md`
      a.click()
      URL.revokeObjectURL(url)
      onComplete()
    },
  }
}

export const exportJSONAction: DocumentActionComponent = (props) => {
  const {draft, published, onComplete} = props

  return {
    label: 'Export JSON',
    icon: DownloadIcon,
    onHandle: () => {
      const doc = draft || published
      if (!doc) {
        onComplete()
        return
      }
      
      const json = JSON.stringify(doc, null, 2)
      const blob = new Blob([json], {type: 'application/json'})
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const slugCurrent = (doc.slug as {current?: string})?.current
      a.download = `${slugCurrent || 'document'}.json`
      a.click()
      URL.revokeObjectURL(url)
      onComplete()
    },
  }
}

export const publishToAllAction: DocumentActionComponent = (props) => {
  const {draft, published, onComplete} = props
  const doc = draft || published
  
  if (!doc || (doc as {status?: string}).status === 'published') {
    return {label: 'Already Published', disabled: true, onHandle: () => onComplete()}
  }

  return {
    label: 'Publish & Promote',
    icon: PublishIcon,
    tone: 'positive',
    onHandle: async () => {
      const client = useClient({apiVersion: '2024-01-01'})
      
      try {
        await client
          .patch(doc._id)
          .set({status: 'published', publishedAt: new Date().toISOString()})
          .commit()
        
        onComplete()
      } catch (err) {
        console.error('Failed to publish:', err)
        onComplete()
      }
    },
  }
}

export const archiveAction: DocumentActionComponent = (props) => {
  const {draft, published, onComplete} = props
  const doc = draft || published
  
  if (!doc) {
    return {label: 'Archive', disabled: true, onHandle: () => onComplete()}
  }

  return {
    label: 'Archive',
    icon: TrashIcon,
    tone: 'critical',
    onHandle: () => {
      return {
        type: 'dialog',
        title: 'Archive Document',
        message: 'This will mark the document as archived. It can be restored later.',
        confirmText: 'Archive',
        onConfirm: async () => {
          const client = useClient({apiVersion: '2024-01-01'})
          try {
            await client
              .patch(doc._id)
              .set({status: 'archived'})
              .commit()
            onComplete()
          } catch (err) {
            console.error('Failed to archive:', err)
            onComplete()
          }
        },
      }
    },
  }
}

function generateMarkdown(doc: any): string {
  let md = `# ${doc.title || 'Untitled'}\n\n`
  
  if (doc.description) {
    md += `> ${doc.description}\n\n`
  }
  
  if (doc.body && Array.isArray(doc.body)) {
    for (const block of doc.body) {
      md += blockToMarkdown(block)
    }
  }
  
  return md
}

function blockToMarkdown(block: any): string {
  if (block._type === 'block') {
    let text = ''
    if (block.children) {
      text = block.children.map((child: any) => {
        let t = child.text || ''
        if (child.marks) {
          for (const mark of child.marks) {
            if (mark === 'strong') t = `**${t}**`
            if (mark === 'em') t = `*${t}*`
            if (mark === 'code') t = `\`${t}\``
          }
        }
        return t
      }).join('')
    }
    
    if (block.style === 'h1') return `# ${text}\n\n`
    if (block.style === 'h2') return `## ${text}\n\n`
    if (block.style === 'h3') return `### ${text}\n\n`
    if (block.style === 'h4') return `#### ${text}\n\n`
    if (block.style === 'blockquote') return `> ${text}\n\n`
    if (block.listItem === 'bullet') return `- ${text}\n`
    if (block.listItem === 'number') return `1. ${text}\n`
    
    return `${text}\n\n`
  }
  
  if (block._type === 'code') {
    return `\`\`\`${block.language || ''}\n${block.code || ''}\n\`\`\`\n\n`
  }
  
  if (block._type === 'image') {
    return `![${block.alt || 'Image'}](${block.asset?._ref || ''})\n\n`
  }
  
  if (block._type === 'divider') {
    return `---\n\n`
  }
  
  return ''
}

export const customDocumentActions = [
  duplicateAction,
  exportMarkdownAction,
  exportJSONAction,
  publishToAllAction,
  archiveAction,
]
