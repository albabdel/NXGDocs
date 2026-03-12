import {defineType, defineField} from 'sanity'

export const animatedImageType = defineType({
  name: 'animatedImage',
  title: 'Animated Image (GIF)',
  type: 'object',
  description: 'Upload animated GIFs that preserve animation. Unlike regular images, GIFs bypass Sanity image transformations.',
  fields: [
    defineField({
      name: 'file',
      title: 'GIF File',
      type: 'file',
      options: {
        accept: '.gif,image/gif',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Required for accessibility',
      validation: (rule) => rule.max(180).warning('Add alt text for accessibility before publishing.'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      description: 'Start animation automatically',
      initialValue: true,
    }),
    defineField({
      name: 'loop',
      title: 'Loop Animation',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'poster',
      title: 'Poster Frame',
      type: 'image',
      description: 'Static fallback image shown before GIF loads or when autoplay is disabled',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
      options: {
        list: [
          {title: 'Full width (100%)', value: '100%'},
          {title: 'Large (75%)', value: '75%'},
          {title: 'Medium (50%)', value: '50%'},
          {title: 'Small (33%)', value: '33%'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      initialValue: '100%',
    }),
    defineField({
      name: 'customWidth',
      title: 'Custom Width (px)',
      type: 'number',
      hidden: ({parent}) => parent?.width !== 'custom',
    }),
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
      },
      initialValue: 'center',
    }),
    defineField({
      name: 'clickToPlay',
      title: 'Click to Play/Pause',
      type: 'boolean',
      description: 'Allow users to click to toggle animation',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      alt: 'alt',
      caption: 'caption',
    },
    prepare({alt, caption}) {
      return {
        title: `🎬 ${alt || 'Animated GIF'}`,
        subtitle: caption,
      }
    },
  },
})

export const enhancedImageType = defineType({
  name: 'enhancedImage',
  title: 'Enhanced Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
        accept: 'image/*',
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Required for accessibility',
          validation: (rule) => rule.max(180).warning('Add alt text for accessibility before publishing.'),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
        defineField({
          name: 'credits',
          title: 'Credits',
          type: 'string',
          description: 'Photo credit or attribution',
        }),
        defineField({
          name: 'focalPoint',
          title: 'Focal Point',
          type: 'object',
          fields: [
            defineField({name: 'x', type: 'number', title: 'X'}),
            defineField({name: 'y', type: 'number', title: 'Y'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'isGif',
      title: 'Is Animated GIF',
      type: 'boolean',
      description: 'Enable GIF-specific optimizations',
      initialValue: false,
    }),
    defineField({
      name: 'gifSettings',
      title: 'GIF Settings',
      type: 'object',
      hidden: ({parent}) => !parent?.isGif,
      fields: [
        defineField({
          name: 'autoplay',
          title: 'Autoplay',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'loop',
          title: 'Loop',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'muted',
          title: 'Muted',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'poster',
          title: 'Poster Frame',
          type: 'image',
          description: 'Static image to show before GIF loads',
        }),
      ],
    }),
    defineField({
      name: 'filters',
      title: 'Image Filters',
      type: 'object',
      fields: [
        defineField({
          name: 'grayscale',
          title: 'Grayscale',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'sepia',
          title: 'Sepia',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'blur',
          title: 'Blur',
          type: 'number',
          description: 'Blur amount (0-20)',
          validation: (rule) => rule.min(0).max(20),
        }),
        defineField({
          name: 'brightness',
          title: 'Brightness',
          type: 'number',
          description: 'Brightness % (0-200, 100 is normal)',
          initialValue: 100,
          validation: (rule) => rule.min(0).max(200),
        }),
        defineField({
          name: 'contrast',
          title: 'Contrast',
          type: 'number',
          description: 'Contrast % (0-200, 100 is normal)',
          initialValue: 100,
          validation: (rule) => rule.min(0).max(200),
        }),
        defineField({
          name: 'saturation',
          title: 'Saturation',
          type: 'number',
          description: 'Saturation % (0-200, 100 is normal)',
          initialValue: 100,
          validation: (rule) => rule.min(0).max(200),
        }),
      ],
    }),
    defineField({
      name: 'transform',
      title: 'Transformations',
      type: 'object',
      fields: [
        defineField({
          name: 'rotate',
          title: 'Rotate',
          type: 'number',
          options: {
            list: [
              {title: '0°', value: 0},
              {title: '90°', value: 90},
              {title: '180°', value: 180},
              {title: '270°', value: 270},
            ],
          },
          initialValue: 0,
        }),
        defineField({
          name: 'flip',
          title: 'Flip',
          type: 'string',
          options: {
            list: [
              {title: 'None', value: 'none'},
              {title: 'Horizontal', value: 'horizontal'},
              {title: 'Vertical', value: 'vertical'},
              {title: 'Both', value: 'both'},
            ],
          },
          initialValue: 'none',
        }),
        defineField({
          name: 'crop',
          title: 'Crop',
          type: 'object',
          fields: [
            defineField({name: 'top', type: 'number', title: 'Top %'}),
            defineField({name: 'right', type: 'number', title: 'Right %'}),
            defineField({name: 'bottom', type: 'number', title: 'Bottom %'}),
            defineField({name: 'left', type: 'number', title: 'Left %'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'object',
      fields: [
        defineField({
          name: 'width',
          title: 'Width',
          type: 'string',
          options: {
            list: [
              {title: 'Full width (100%)', value: '100'},
              {title: 'Large (75%)', value: '75'},
              {title: 'Medium (50%)', value: '50'},
              {title: 'Small (33%)', value: '33'},
              {title: 'Extra small (25%)', value: '25'},
              {title: 'Custom', value: 'custom'},
            ],
          },
          initialValue: '100',
        }),
        defineField({
          name: 'customWidth',
          title: 'Custom Width (px or %)',
          type: 'string',
          hidden: ({parent}) => parent?.width !== 'custom',
        }),
        defineField({
          name: 'alignment',
          title: 'Alignment',
          type: 'string',
          options: {
            list: [
              {title: 'Left', value: 'left'},
              {title: 'Center', value: 'center'},
              {title: 'Right', value: 'right'},
              {title: 'Full Bleed', value: 'full'},
            ],
          },
          initialValue: 'center',
        }),
        defineField({
          name: 'float',
          title: 'Text Wrap',
          type: 'string',
          options: {
            list: [
              {title: 'None', value: 'none'},
              {title: 'Float Left', value: 'left'},
              {title: 'Float Right', value: 'right'},
            ],
          },
          initialValue: 'none',
        }),
      ],
    }),
    defineField({
      name: 'interactions',
      title: 'Interactions',
      type: 'object',
      fields: [
        defineField({
          name: 'clickAction',
          title: 'Click Action',
          type: 'string',
          options: {
            list: [
              {title: 'None', value: 'none'},
              {title: 'Open Lightbox', value: 'lightbox'},
              {title: 'Go to URL', value: 'link'},
              {title: 'Open File', value: 'file'},
            ],
          },
          initialValue: 'lightbox',
        }),
        defineField({
          name: 'linkUrl',
          title: 'Link URL',
          type: 'url',
          hidden: ({parent}) => parent?.clickAction !== 'link',
        }),
        defineField({
          name: 'linkTarget',
          title: 'Link Target',
          type: 'string',
          options: {
            list: [
              {title: 'Same window', value: '_self'},
              {title: 'New tab', value: '_blank'},
            ],
          },
          initialValue: '_blank',
          hidden: ({parent}) => parent?.clickAction !== 'link',
        }),
        defineField({
          name: 'hoverEffect',
          title: 'Hover Effect',
          type: 'string',
          options: {
            list: [
              {title: 'None', value: 'none'},
              {title: 'Zoom', value: 'zoom'},
              {title: 'Fade', value: 'fade'},
              {title: 'Overlay', value: 'overlay'},
              {title: 'Border', value: 'border'},
            ],
          },
          initialValue: 'none',
        }),
      ],
    }),
    defineField({
      name: 'lazyLoading',
      title: 'Lazy Loading',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enable Lazy Loading',
          type: 'boolean',
          description: 'Load image only when it enters viewport',
          initialValue: true,
        }),
        defineField({
          name: 'placeholder',
          title: 'Placeholder Type',
          type: 'string',
          options: {
            list: [
              {title: 'Blur hash', value: 'blurhash'},
              {title: 'Dominant color', value: 'color'},
              {title: 'Low quality image', value: 'lqip'},
              {title: 'None', value: 'none'},
            ],
          },
          initialValue: 'blurhash',
        }),
      ],
    }),
  ],
})

export const enhancedVideoType = defineType({
  name: 'enhancedVideo',
  title: 'Enhanced Video',
  type: 'object',
  fields: [
    defineField({
      name: 'videoSource',
      title: 'Video Source',
      type: 'string',
      options: {
        list: [
          {title: 'Upload File', value: 'upload'},
          {title: 'YouTube', value: 'youtube'},
          {title: 'Vimeo', value: 'vimeo'},
          {title: 'External URL', value: 'external'},
        ],
      },
      initialValue: 'upload',
    }),
    defineField({
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      hidden: ({parent}) => parent?.videoSource !== 'upload',
    }),
    defineField({
      name: 'externalUrl',
      title: 'Video URL',
      type: 'url',
      hidden: ({parent}) => parent?.videoSource !== 'external',
    }),
    defineField({
      name: 'videoId',
      title: 'Video ID',
      type: 'string',
      description: 'YouTube or Vimeo video ID',
      hidden: ({parent}) => parent?.videoSource !== 'youtube' && parent?.videoSource !== 'vimeo',
    }),
    defineField({
      name: 'title',
      title: 'Video Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'poster',
      title: 'Poster Image',
      type: 'image',
      description: 'Thumbnail/poster image for the video',
    }),
    defineField({
      name: 'playerSettings',
      title: 'Player Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'autoplay',
          title: 'Autoplay',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'muted',
          title: 'Muted',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'loop',
          title: 'Loop',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'controls',
          title: 'Show Controls',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'startTime',
          title: 'Start Time (seconds)',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'endTime',
          title: 'End Time (seconds)',
          type: 'number',
          description: 'Leave empty to play to end',
        }),
        defineField({
          name: 'playbackRate',
          title: 'Playback Speed',
          type: 'number',
          options: {
            list: [
              {title: '0.5x', value: 0.5},
              {title: '0.75x', value: 0.75},
              {title: 'Normal (1x)', value: 1},
              {title: '1.25x', value: 1.25},
              {title: '1.5x', value: 1.5},
              {title: '2x', value: 2},
            ],
          },
          initialValue: 1,
        }),
      ],
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'object',
      fields: [
        defineField({
          name: 'width',
          title: 'Width',
          type: 'number',
          description: 'Leave empty for responsive',
        }),
        defineField({
          name: 'height',
          title: 'Height',
          type: 'number',
          description: 'Leave empty for responsive',
        }),
        defineField({
          name: 'aspectRatio',
          title: 'Aspect Ratio',
          type: 'string',
          options: {
            list: [
              {title: 'Auto', value: 'auto'},
              {title: '16:9 (Widescreen)', value: '16:9'},
              {title: '4:3 (Standard)', value: '4:3'},
              {title: '1:1 (Square)', value: '1:1'},
              {title: '21:9 (Ultrawide)', value: '21:9'},
              {title: '9:16 (Vertical)', value: '9:16'},
            ],
          },
          initialValue: '16:9',
        }),
      ],
    }),
    defineField({
      name: 'subtitles',
      title: 'Subtitles / Captions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'subtitleTrack',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g., "English", "Spanish"',
            }),
            defineField({
              name: 'srclang',
              title: 'Language Code',
              type: 'string',
              description: 'e.g., "en", "es", "fr"',
            }),
            defineField({
              name: 'file',
              title: 'Subtitle File',
              type: 'file',
              options: {
                accept: '.vtt,.srt,.sub',
              },
            }),
            defineField({
              name: 'default',
              title: 'Default Track',
              type: 'boolean',
              initialValue: false,
            }),
          ],
        },
      ],
    }),
  ],
})

export const audioType = defineType({
  name: 'audio',
  title: 'Audio',
  type: 'object',
  fields: [
    defineField({
      name: 'audioFile',
      title: 'Audio File',
      type: 'file',
      options: {
        accept: 'audio/*',
      },
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'artist',
      title: 'Artist',
      type: 'string',
    }),
    defineField({
      name: 'album',
      title: 'Album',
      type: 'string',
    }),
    defineField({
      name: 'coverArt',
      title: 'Cover Art',
      type: 'image',
    }),
    defineField({
      name: 'playerSettings',
      title: 'Player Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'autoplay',
          title: 'Autoplay',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'loop',
          title: 'Loop',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'controls',
          title: 'Show Controls',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'preload',
          title: 'Preload',
          type: 'string',
          options: {
            list: [
              {title: 'None', value: 'none'},
              {title: 'Metadata', value: 'metadata'},
              {title: 'Auto', value: 'auto'},
            ],
          },
          initialValue: 'metadata',
        }),
      ],
    }),
  ],
})

export const embedType = defineType({
  name: 'embed',
  title: 'Embed Code',
  type: 'object',
  fields: [
    defineField({
      name: 'embedType',
      title: 'Embed Type',
      type: 'string',
      options: {
        list: [
          {title: 'HTML/iframe', value: 'html'},
          {title: 'Script', value: 'script'},
          {title: 'Social Media', value: 'social'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      initialValue: 'html',
    }),
    defineField({
      name: 'code',
      title: 'Embed Code',
      type: 'text',
      rows: 10,
      description: 'Paste your embed code here',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'object',
      fields: [
        defineField({
          name: 'width',
          title: 'Width',
          type: 'number',
        }),
        defineField({
          name: 'height',
          title: 'Height',
          type: 'number',
        }),
        defineField({
          name: 'responsive',
          title: 'Responsive',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'sandbox',
      title: 'Sandbox Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enable Sandbox',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'allowScripts',
          title: 'Allow Scripts',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'allowSameOrigin',
          title: 'Allow Same Origin',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
  ],
})

export const gifType = defineType({
  name: 'gif',
  title: 'GIF / Animated Image',
  type: 'object',
  description: 'Animated GIF that preserves its animation. Bypasses image transformations.',
  fields: [
    defineField({
      name: 'file',
      title: 'GIF File',
      type: 'file',
      options: {
        accept: '.gif,image/gif',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Required for accessibility - describe what the animation shows',
      validation: (rule) => rule.max(180).warning('Add alt text for accessibility before publishing.'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
      options: {
        list: [
          {title: 'Full width', value: '100%'},
          {title: 'Large (75%)', value: '75%'},
          {title: 'Medium (50%)', value: '50%'},
          {title: 'Small (33%)', value: '33%'},
        ],
      },
      initialValue: '100%',
    }),
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Center', value: 'center'},
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
      },
      initialValue: 'center',
    }),
  ],
  preview: {
    select: {
      alt: 'alt',
      caption: 'caption',
    },
    prepare({alt, caption}) {
      return {
        title: `🎬 ${alt || 'Animated GIF'}`,
        subtitle: caption,
      }
    },
  },
})

export const mediaGalleryType = defineType({
  name: 'mediaGallery',
  title: 'Media Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Gallery Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'layout',
      title: 'Gallery Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Grid', value: 'grid'},
          {title: 'Masonry', value: 'masonry'},
          {title: 'Carousel', value: 'carousel'},
          {title: 'Slider', value: 'slider'},
          {title: 'List', value: 'list'},
        ],
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'gridSettings',
      title: 'Grid Settings',
      type: 'object',
      hidden: ({parent}) => parent?.layout !== 'grid' && parent?.layout !== 'masonry',
      fields: [
        defineField({
          name: 'columns',
          title: 'Columns',
          type: 'number',
          options: {
            list: [
              {title: '2 columns', value: 2},
              {title: '3 columns', value: 3},
              {title: '4 columns', value: 4},
              {title: '5 columns', value: 5},
            ],
          },
          initialValue: 3,
        }),
        defineField({
          name: 'gap',
          title: 'Gap (px)',
          type: 'number',
          initialValue: 16,
        }),
      ],
    }),
    defineField({
      name: 'carouselSettings',
      title: 'Carousel Settings',
      type: 'object',
      hidden: ({parent}) => parent?.layout !== 'carousel' && parent?.layout !== 'slider',
      fields: [
        defineField({
          name: 'autoplay',
          title: 'Autoplay',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'interval',
          title: 'Autoplay Interval (ms)',
          type: 'number',
          initialValue: 5000,
        }),
        defineField({
          name: 'showDots',
          title: 'Show Navigation Dots',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showArrows',
          title: 'Show Navigation Arrows',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'infinite',
          title: 'Infinite Loop',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'items',
      title: 'Gallery Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'galleryItem',
          fields: [
            defineField({
              name: 'type',
              title: 'Media Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Image', value: 'image'},
                  {title: 'Video', value: 'video'},
                  {title: 'Audio', value: 'audio'},
                  {title: 'Embed', value: 'embed'},
                ],
              },
              initialValue: 'image',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              hidden: ({parent}) => parent?.type !== 'image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'video',
              title: 'Video',
              type: 'enhancedVideo',
              hidden: ({parent}) => parent?.type !== 'video',
            }),
            defineField({
              name: 'audio',
              title: 'Audio',
              type: 'audio',
              hidden: ({parent}) => parent?.type !== 'audio',
            }),
            defineField({
              name: 'embed',
              title: 'Embed',
              type: 'embed',
              hidden: ({parent}) => parent?.type !== 'embed',
            }),
            defineField({
              name: 'title',
              title: 'Item Title',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'order',
              title: 'Order',
              type: 'number',
              initialValue: 0,
            }),
          ],
          preview: {
            select: {
              type: 'type',
              title: 'title',
              caption: 'caption',
            },
            prepare({type, title, caption}) {
              const emojis: Record<string, string> = {
                image: '📷',
                video: '🎬',
                audio: '🎵',
                embed: '🔗',
              }
              return {
                title: `${emojis[type as string] || '📄'} ${title || type}`,
                subtitle: caption,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'lightbox',
      title: 'Lightbox',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Enable Lightbox',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showThumbnails',
          title: 'Show Thumbnails',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'showCounter',
          title: 'Show Image Counter',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'allowDownload',
          title: 'Allow Download',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'filters',
      title: 'Gallery Filters',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Tags for filtering gallery items',
    }),
  ],
})
