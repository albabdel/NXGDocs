import { defineType, defineField } from 'sanity';

export const searchSynonymType = defineType({
  name: 'searchSynonym',
  title: 'Search Synonym',
  type: 'document',
  fields: [
    defineField({
      name: 'term',
      type: 'string',
      title: 'Primary Term',
      description: 'The main term that triggers synonym expansion',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'synonyms',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Synonyms',
      description: 'Alternative terms that should also match when the primary term is searched',
    }),
    defineField({
      name: 'enabled',
      type: 'boolean',
      title: 'Enabled',
      description: 'Toggle synonym expansion on/off',
      initialValue: true,
    }),
    defineField({
      name: 'caseSensitive',
      type: 'boolean',
      title: 'Case Sensitive',
      description: 'If true, synonym matching is case-sensitive',
      initialValue: false,
    }),
    defineField({
      name: 'bidirectional',
      type: 'boolean',
      title: 'Bidirectional',
      description: 'If true, synonyms also match the primary term',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'term',
      subtitle: 'synonyms',
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: Array.isArray(subtitle) ? subtitle.join(', ') : subtitle,
      };
    },
  },
});

export default searchSynonymType;
