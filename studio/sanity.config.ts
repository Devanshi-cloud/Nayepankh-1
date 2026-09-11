import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schema } from './schemas';

// https://www.sanity.io/docs/sanity-clique
// Requires `SANITY_PROJECT_ID` and `SANITY_DATASET` env vars, or defaults below.
const projectId = process.env.SANITY_PROJECT_ID || '07wnn0p1';
const dataset = process.env.SANITY_DATASET || 'production';

export default defineConfig({
  name: 'nayepankh-blog',
  title: 'NayePankh Blog Studio',

  projectId,
  dataset,

  plugins: [structureTool()],

  schema,

  basePath: '/studio',
});
