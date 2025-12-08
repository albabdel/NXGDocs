import type { CollectionConfig } from 'payload/types';
import { slateEditor } from '@payloadcms/richtext-slate';

const DocumentationArticle: CollectionConfig = {
  slug: 'documentation-articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'slug', 'updatedAt'],
    pagination: {
      defaultLimit: 20, // Pagination: show 20 items per page
      limits: [10, 20, 50, 100], // Options for items per page
    },
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Article title',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (auto-generated from title if not provided)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short description for SEO and previews',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: slateEditor({
        admin: {
          elements: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'ul', 'ol', 'link', 'relationship', 'upload'],
          leaves: ['bold', 'italic', 'underline', 'strikethrough', 'code'],
        },
      }),
      admin: {
        description: 'Main article content with rich text, images, and videos',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: false,
      admin: {
        description: 'Category this article belongs to',
      },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Admin', value: 'admin' },
        { label: 'Operator', value: 'operator' },
        { label: 'Installer', value: 'installer' },
        { label: 'Manager', value: 'manager' },
      ],
      defaultValue: 'all',
    },
    {
      name: 'device_type',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Hikvision', value: 'hikvision' },
        { label: 'Dahua', value: 'dahua' },
        { label: 'ADPRO', value: 'adpro' },
        { label: 'Milestone', value: 'milestone' },
        { label: 'Hanwha', value: 'hanwha' },
        { label: 'Axis', value: 'axis' },
        { label: 'Axxon', value: 'axxon' },
        { label: 'Camect', value: 'camect' },
        { label: 'Teltonika', value: 'teltonika' },
        { label: 'GCXONE Audio', value: 'gcxone_audio' },
        { label: 'Avigilon', value: 'avigilon' },
        { label: 'Innovi', value: 'innovi' },
        { label: 'Reconeyez', value: 'reconeyez' },
        { label: 'Heitel', value: 'heitel' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'none',
    },
    {
      name: 'difficulty',
      type: 'select',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
      defaultValue: 'beginner',
    },
    {
      name: 'platform',
      type: 'select',
      options: [
        { label: 'Both', value: 'both' },
        { label: 'GCXONE', value: 'gcxone' },
        { label: 'Talos', value: 'talos' },
      ],
      defaultValue: 'both',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order within category',
      },
    },
    {
      name: 'version',
      type: 'text',
      defaultValue: '1.0',
      admin: {
        description: 'Article version',
      },
    },
    {
      name: 'tags',
      type: 'json',
      admin: {
        description: 'Tags as JSON array (e.g., ["tag1", "tag2"])',
      },
    },
    {
      name: 'featured_image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image for the article',
      },
    },
    {
      name: 'screenshots',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        description: 'Screenshots for the article',
      },
    },
  ],
};

export default DocumentationArticle;
