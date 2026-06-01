import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
    name: 'gwparish',
    title: 'Greenacres Walkerville Parish',
    projectId: 'gfrzqpv0',
    dataset: 'production',
    plugins: [structureTool(), visionTool()],
    schema: { types: schemaTypes },
});
