import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'האור שבך - פאנל ניהול',

  projectId: 'c1d4vky5', // 👈 שימי את ה-ID שלך כאן!
  dataset: 'production',
    token: 'sk301sR3TYSNIgPwjjJ4FzvdiziTmLZ4Mh2K8Fx1lG3QSz20IsmZhXwpzNkxuXBLcy6yK1N1b3KDkwfEguYPTibeMWDbx6mm4mBPDh7tdJvnmq6wkvCQasrjBJnFN4fFBgjeGYLWVoEKR9TLPInCLj6tI64NJP0prN0sgJbGk52WJj7rXCLs', // 👈 תצטרכי ליצור token

  plugins: [
    structureTool(),  // ← פשוט! בלי customization
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})