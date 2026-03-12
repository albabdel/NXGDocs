import {useMemo} from 'react'
import {Box, Card, Flex, Stack, Text, Badge, Button} from '@sanity/ui'
import {EyeOpenIcon, DesktopIcon} from '@sanity/icons'
import {type PreviewProps} from 'sanity'

export function DocumentPreview(props: PreviewProps) {
  const {value, schemaType} = props as any
  
  const previewStats = useMemo(() => {
    const body = value?.body
    if (!body || !Array.isArray(body)) return null
    
    let words = 0
    let headings = 0
    let images = 0
    let codeBlocks = 0
    
    for (const block of body) {
      if (block._type === 'block') {
        if (block.style?.startsWith('h')) headings++
        if (block.children) {
          for (const child of block.children) {
            words += (child.text || '').split(/\s+/).filter(Boolean).length
          }
        }
      }
      if (block._type === 'image' || block._type === 'imageEnhanced') images++
      if (block._type === 'code') codeBlocks++
    }
    
    return {words, headings, images, codeBlocks}
  }, [value?.body])

  return (
    <Stack space={4}>
      <Flex align="center" gap={2}>
        <Text weight="semibold">{value?.title || 'Untitled'}</Text>
        {value?.status && (
          <Badge 
            tone={value.status === 'published' ? 'positive' : value.status === 'review' ? 'caution' : 'primary'}
          >
            {value.status}
          </Badge>
        )}
      </Flex>
      
      {previewStats && (
        <Card padding={3} radius={2} tone="transparent" border>
          <Flex gap={4}>
            <Stack space={1}>
              <Text size={0} muted>Words</Text>
              <Text>{previewStats.words}</Text>
            </Stack>
            <Stack space={1}>
              <Text size={0} muted>Headings</Text>
              <Text>{previewStats.headings}</Text>
            </Stack>
            <Stack space={1}>
              <Text size={0} muted>Images</Text>
              <Text>{previewStats.images}</Text>
            </Stack>
            <Stack space={1}>
              <Text size={0} muted>Code</Text>
              <Text>{previewStats.codeBlocks}</Text>
            </Stack>
          </Flex>
        </Card>
      )}
    </Stack>
  )
}

export function TableOfContentsPreview(props: any) {
  const {value} = props
  
  const toc = useMemo(() => {
    const body = value?.body
    if (!body || !Array.isArray(body)) return []
    
    const items: {level: number, text: string}[] = []
    
    for (const block of body) {
      if (block._type === 'block' && block.style?.startsWith('h')) {
        const level = parseInt(block.style.slice(1))
        const text = block.children?.map((c: any) => c.text).join('') || ''
        items.push({level, text})
      }
    }
    
    return items
  }, [value?.body])

  if (toc.length === 0) return null

  return (
    <Card padding={3} radius={2} tone="transparent" border>
      <Text size={1} weight="semibold" style={{marginBottom: 8}}>Table of Contents</Text>
      <Stack space={2}>
        {toc.slice(0, 10).map((item, i) => (
          <Text 
            key={i} 
            size={1} 
            muted 
            style={{paddingLeft: (item.level - 1) * 12}}
          >
            {item.text}
          </Text>
        ))}
        {toc.length > 10 && (
          <Text size={1} muted>+{toc.length - 10} more headings</Text>
        )}
      </Stack>
    </Card>
  )
}
