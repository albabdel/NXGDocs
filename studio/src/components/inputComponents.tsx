import {useMemo, useCallback} from 'react'
import {Box, Card, Flex, Stack, Text, Badge, Button, Tooltip} from '@sanity/ui'
import {EditIcon, EyeOpenIcon, CopyIcon as CopyIconUI} from '@sanity/icons'

export function SlugPreview(props: any) {
  const {value, onChange, readOnly} = props
  
  const fullUrl = useMemo(() => {
    const baseUrl = 'https://docs.nxgen.com/'
    return `${baseUrl}${value?.current || ''}`
  }, [value])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(fullUrl)
  }, [fullUrl])

  if (!value?.current) return null

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      <Card padding={3} radius={2} tone="transparent" border>
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={2}>
            <EyeOpenIcon />
            <Text size={1} muted>
              Preview URL:
            </Text>
          </Flex>
          <Tooltip content="Copy URL">
            <Button
              mode="bleed"
              icon={CopyIconUI}
              onClick={handleCopy}
              padding={1}
            />
          </Tooltip>
        </Flex>
        <Text size={1} style={{marginTop: 8, wordBreak: 'break-all'}}>
          {fullUrl}
        </Text>
      </Card>
    </Stack>
  )
}

export function StatusBadgePreview(props: any) {
  const {value} = props
  
  const statusConfig = useMemo(() => {
    const configs: Record<string, {tone: 'primary' | 'caution' | 'positive' | 'critical', label: string}> = {
      draft: {tone: 'primary', label: 'Draft'},
      review: {tone: 'caution', label: 'In Review'},
      approved: {tone: 'positive', label: 'Approved'},
      published: {tone: 'positive', label: 'Published'},
      archived: {tone: 'critical', label: 'Archived'},
    }
    return configs[value] || {tone: 'primary', label: value || 'Unknown'}
  }, [value])

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      <Box>
        <Badge tone={statusConfig.tone} padding={2} radius={2}>
          {statusConfig.label}
        </Badge>
      </Box>
    </Stack>
  )
}

export function WordCountPreview(props: any) {
  const {value} = props
  
  const stats = useMemo(() => {
    if (!value || !Array.isArray(value)) return {words: 0, chars: 0, blocks: 0, readTime: 0}
    
    let words = 0
    let chars = 0
    const blocks = value.length
    
    for (const block of value) {
      if (block._type === 'block' && block.children) {
        for (const child of block.children) {
          const text = child.text || ''
          words += text.split(/\s+/).filter(Boolean).length
          chars += text.length
        }
      }
    }
    
    const readTime = Math.max(1, Math.ceil(words / 200))
    
    return {words, chars, blocks, readTime}
  }, [value])

  if (!value || stats.words === 0) return props.renderDefault(props)

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Card padding={3} radius={2} tone="transparent" border>
        <Flex gap={4} wrap="wrap">
          <Stack space={1}>
            <Text size={0} muted>Words</Text>
            <Text weight="semibold">{stats.words.toLocaleString()}</Text>
          </Stack>
          <Stack space={1}>
            <Text size={0} muted>Characters</Text>
            <Text weight="semibold">{stats.chars.toLocaleString()}</Text>
          </Stack>
          <Stack space={1}>
            <Text size={0} muted>Blocks</Text>
            <Text weight="semibold">{stats.blocks}</Text>
          </Stack>
          <Stack space={1}>
            <Text size={0} muted>Read Time</Text>
            <Text weight="semibold">{stats.readTime} min</Text>
          </Stack>
        </Flex>
      </Card>
    </Stack>
  )
}

export function TagInputWithSuggestions(props: any) {
  const {value, onChange, schemaType} = props
  
  const suggestions = useMemo(() => [
    'getting-started',
    'tutorial',
    'reference',
    'api',
    'configuration',
    'troubleshooting',
    'advanced',
    'security',
    'integration',
    'migration',
    'best-practices',
    'faq',
  ], [])

  const handleAddTag = useCallback((tag: string) => {
    const newValue = [...(value || []), tag]
    onChange(newValue)
  }, [value, onChange])

  const availableSuggestions = useMemo(() => {
    return suggestions.filter(s => !value?.includes(s))
  }, [suggestions, value])

  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      {availableSuggestions.length > 0 && (
        <Box>
          <Text size={0} muted style={{marginBottom: 8}}>Quick add:</Text>
          <Flex gap={1} wrap="wrap">
            {availableSuggestions.slice(0, 8).map(tag => (
              <Badge
                key={tag}
                padding={2}
                radius={2}
                style={{cursor: 'pointer'}}
                onClick={() => handleAddTag(tag)}
              >
                + {tag}
              </Badge>
            ))}
          </Flex>
        </Box>
      )}
    </Stack>
  )
}
