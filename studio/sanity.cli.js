#!/usr/bin/env node
/** @type {import('sanity/cli').SanityCliConfig} */
const config = {
  api: {
    projectId: process.env.SANITY_PROJECT_ID || '07wnn0p1',
    dataset: process.env.SANITY_DATASET || 'production',
  },
};

module.exports = config;
