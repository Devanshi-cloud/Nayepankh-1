import { createClient } from 'next-sanity';

/**
 * Sanity client used by the frontend to fetch published articles.
 *
 * Relies on Vite env vars:
 *   VITE_SANITY_PROJECT_ID
 *   VITE_SANITY_DATASET
 *
 * For production reads you can also set VITE_SANITY_API_TOKEN
 * (public read token) if your dataset is not publicly readable.
 */
export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '07wnn0p1',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  // token: import.meta.env.VITE_SANITY_API_TOKEN,  // optional
});

/**
 * Image URL builder for Sanity image assets.
 * Drop-in replacement: pass the Sanity image asset reference (`_ref`) from an article.
 */
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}
