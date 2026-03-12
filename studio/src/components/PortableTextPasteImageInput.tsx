import {useCallback, useState, type ClipboardEvent} from 'react'
import {Box, Card, Flex, Spinner, Text} from '@sanity/ui'
import {ImageIcon} from '@sanity/icons'
import {
  insert,
  PatchEvent,
  setIfMissing,
  useClient,
  type ArrayOfObjectsInputProps,
} from 'sanity'
import type {Path, PathSegment} from 'sanity'

type ClipboardImage = {
  file: File
  source: 'clipboard' | 'html-data-url' | 'html-remote-url'
}

const MAX_PASTED_IMAGE_SIZE_BYTES = 25 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
])

function createKey(): string {
  return Math.random().toString(36).slice(2, 14)
}

function sanitizeFilenamePart(value: string): string {
  const normalized = value.trim().replace(/[^a-zA-Z0-9._-]+/g, '-')
  return normalized || 'pasted-image'
}

function extensionForMime(mime: string): string {
  if (mime === 'image/jpeg' || mime === 'image/jpg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/gif') return 'gif'
  if (mime === 'image/svg+xml') return 'svg'
  return 'bin'
}

function isKeyPathSegment(segment: PathSegment): segment is {_key: string} {
  return typeof segment === 'object' && segment !== null && '_key' in segment
}

function resolveFocusedArrayIndex(focusPath: Path, value: unknown): number | null {
  const currentValue = Array.isArray(value) ? value : []

  for (const segment of focusPath) {
    if (typeof segment === 'number' && Number.isInteger(segment)) {
      return segment >= 0 ? segment : null
    }

    if (isKeyPathSegment(segment)) {
      const idx = currentValue.findIndex(
        (item) =>
          typeof item === 'object' &&
          item !== null &&
          '_key' in item &&
          (item as {_key?: string})._key === segment._key
      )
      if (idx >= 0) return idx
    }
  }

  return null
}

function createRemoteFallbackBlocks(urls: string[]): Record<string, unknown>[] {
  if (urls.length === 0) return []

  const headingKey = createKey()
  const headingText = 'Some pasted images could not be imported automatically (source blocked cross-origin fetch).'
  const blocks: Record<string, unknown>[] = [
    {
      _type: 'block',
      _key: headingKey,
      style: 'blockquote',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: createKey(),
          text: headingText,
          marks: [],
        },
      ],
    },
  ]

  urls.forEach((url) => {
    const markKey = createKey()
    blocks.push({
      _type: 'block',
      _key: createKey(),
      style: 'normal',
      listItem: 'bullet',
      markDefs: [
        {
          _key: markKey,
          _type: 'link',
          href: url,
          blank: true,
        },
      ],
      children: [
        {
          _type: 'span',
          _key: createKey(),
          text: url,
          marks: [markKey],
        },
      ],
    })
  })

  return blocks
}

function dataUrlToFile(dataUrl: string, baseName: string): File | null {
  const parts = dataUrl.split(',')
  if (parts.length !== 2) return null

  const header = parts[0]
  const body = parts[1]
  const headerMatch = header.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64$/i)
  if (!headerMatch) return null

  const mimeType = headerMatch[1].toLowerCase()
  if (!ACCEPTED_IMAGE_TYPES.has(mimeType)) return null

  try {
    const binary = atob(body)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i)
    }

    const filename = `${sanitizeFilenamePart(baseName)}.${extensionForMime(mimeType)}`
    return new File([bytes], filename, {type: mimeType})
  } catch {
    return null
  }
}

function extractHtmlDataUrlImages(clipboard: DataTransfer): ClipboardImage[] {
  const html = clipboard.getData('text/html')
  if (!html) return []

  const matches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)]
  const images: ClipboardImage[] = []

  matches.forEach((match, index) => {
    const src = match[1]
    if (!src || !src.startsWith('data:image/')) return

    const file = dataUrlToFile(src, `pasted-html-image-${index + 1}`)
    if (!file) return

    images.push({file, source: 'html-data-url'})
  })

  return images
}

function extractHtmlRemoteImageUrls(clipboard: DataTransfer): string[] {
  const html = clipboard.getData('text/html')
  if (!html) return []

  const matches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)]
  const urls = matches
    .map((match) => match[1]?.trim())
    .filter((value): value is string => Boolean(value))
    .filter((value) => /^https?:\/\//i.test(value))

  return [...new Set(urls)]
}

function extractClipboardImages(clipboard: DataTransfer): ClipboardImage[] {
  const images: ClipboardImage[] = []

  const items = clipboard.items
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i]
    if (item.kind !== 'file' || !item.type.startsWith('image/')) continue
    if (!ACCEPTED_IMAGE_TYPES.has(item.type.toLowerCase())) continue

    const file = item.getAsFile()
    if (!file) continue

    images.push({file, source: 'clipboard'})
  }

  return images
}

function uniqueImages(images: ClipboardImage[]): ClipboardImage[] {
  const seen = new Set<string>()
  const deduped: ClipboardImage[] = []

  images.forEach((image) => {
    const key = `${image.file.name}-${image.file.size}-${image.file.type}`
    if (seen.has(key)) return
    seen.add(key)
    deduped.push(image)
  })

  return deduped
}

async function fetchRemoteImageAsClipboardImage(url: string, index: number): Promise<ClipboardImage | null> {
  try {
    const response = await fetch(url, {
      credentials: 'include',
      mode: 'cors',
    })
    if (!response.ok) return null

    const contentType = (response.headers.get('content-type') || '').toLowerCase()
    if (!contentType.startsWith('image/')) return null
    if (!ACCEPTED_IMAGE_TYPES.has(contentType)) return null

    const blob = await response.blob()
    if (blob.size > MAX_PASTED_IMAGE_SIZE_BYTES) return null

    const urlPath = new URL(url).pathname.split('/').pop() || `remote-image-${index + 1}`
    const baseName = sanitizeFilenamePart(urlPath.replace(/\.[a-z0-9]+$/i, ''))
    const file = new File([blob], `${baseName}.${extensionForMime(contentType)}`, {type: contentType})
    return {file, source: 'html-remote-url'}
  } catch {
    return null
  }
}

export function PortableTextPasteImageInput(props: ArrayOfObjectsInputProps) {
  const client = useClient({apiVersion: '2025-02-06'})
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLDivElement>) => {
      const clipboard = event.clipboardData
      if (!clipboard) return

      const inlinePastedImages = uniqueImages([
        ...extractClipboardImages(clipboard),
        ...extractHtmlDataUrlImages(clipboard),
      ]).filter((image) => image.file.size <= MAX_PASTED_IMAGE_SIZE_BYTES)

      const remoteImageUrls = extractHtmlRemoteImageUrls(clipboard)
      if (inlinePastedImages.length === 0 && remoteImageUrls.length === 0) return

      if (inlinePastedImages.length > 0) {
        event.preventDefault()
        event.stopPropagation()
      }

      void (async () => {
        const remoteFetchResults = await Promise.all(
          remoteImageUrls.map(async (url, index) => {
            const image = await fetchRemoteImageAsClipboardImage(url, index)
            return {url, image}
          })
        )

        const remoteImages = remoteFetchResults
          .map((result) => result.image)
          .filter((image): image is ClipboardImage => Boolean(image))
        const failedRemoteUrls = remoteFetchResults
          .filter((result) => !result.image)
          .map((result) => result.url)

        const pastedImages = uniqueImages([...inlinePastedImages, ...remoteImages]).filter(
          (image) => image.file.size <= MAX_PASTED_IMAGE_SIZE_BYTES
        )
        if (pastedImages.length === 0 && failedRemoteUrls.length === 0) return

        setIsUploading(true)
        const startStatus =
          pastedImages.length > 0
            ? `Uploading ${pastedImages.length} image${pastedImages.length === 1 ? '' : 's'}...`
            : `Unable to auto-import ${failedRemoteUrls.length} remote image${failedRemoteUrls.length === 1 ? '' : 's'}. Inserting source links...`
        setStatus(startStatus)

        try {
          const focusedIndex = resolveFocusedArrayIndex(props.focusPath, props.value)
          const insertTarget = focusedIndex == null ? [-1] : [focusedIndex]
          const blocks: Array<Record<string, unknown>> = []

          for (let i = 0; i < pastedImages.length; i += 1) {
            const image = pastedImages[i]
            const extension = extensionForMime(image.file.type)
            const filename = image.file.name || `pasted-image-${Date.now()}-${i + 1}.${extension}`

            const asset = await client.assets.upload('image', image.file, {
              filename,
            })

            blocks.push({
              _type: 'image',
              _key: createKey(),
              asset: {
                _type: 'reference',
                _ref: asset._id,
              },
              alt: sanitizeFilenamePart(filename).replace(/\.[a-z0-9]+$/i, ''),
            })
          }

          if (failedRemoteUrls.length > 0) {
            blocks.push(...createRemoteFallbackBlocks(failedRemoteUrls))
          }

          if (blocks.length === 0) return

          props.onChange(
            PatchEvent.from([setIfMissing([]), insert(blocks, 'after', insertTarget)])
          )

          if (pastedImages.length > 0 && failedRemoteUrls.length > 0) {
            setStatus(
              `Inserted ${pastedImages.length} image(s). ${failedRemoteUrls.length} blocked image link(s) were added as fallback.`
            )
          } else if (pastedImages.length > 0) {
            setStatus(`Inserted ${pastedImages.length} pasted image${pastedImages.length === 1 ? '' : 's'}.`)
          } else {
            setStatus(`Added ${failedRemoteUrls.length} blocked image source link${failedRemoteUrls.length === 1 ? '' : 's'} as fallback.`)
          }
        } catch (error) {
          console.error('[studio] Failed to paste/upload image(s):', error)
          setStatus('Failed to upload pasted image(s). Check browser console for details.')
        } finally {
          setIsUploading(false)
          setTimeout(() => setStatus(null), 4500)
        }
      })()
    },
    [client, props]
  )

  return (
    <Box onPaste={handlePaste}>
      {props.renderDefault(props)}
      {(isUploading || status) && (
        <Card
          marginTop={3}
          padding={3}
          radius={2}
          border
          tone={isUploading ? 'primary' : 'transparent'}
        >
          <Flex align="center" gap={2}>
            {isUploading ? <Spinner muted size={1} /> : <ImageIcon />}
            <Text size={1}>{status ?? 'Paste images directly from clipboard into this editor.'}</Text>
          </Flex>
        </Card>
      )}
    </Box>
  )
}
