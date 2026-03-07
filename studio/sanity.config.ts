// studio/sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {table} from '@sanity/table'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'nxgen-docs',
  title: 'NXGEN Docs',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  plugins: [
    structureTool(),
    visionTool(),
    codeInput(),
    table(),
  ],
  schema: {
    types: schemaTypes,
  },
})
