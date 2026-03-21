import sanityClient from '@sanity/client'

const SANITY_PROJECT_ID = 'orxxqp7k'
const SANITY_ORGANIZATION_ID = 'oCAJBUVjO'
const SANITY_DATASET = 'production'

export const client = sanityClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2026-03-21',
  useCdn: true,
})

export { SANITY_PROJECT_ID, SANITY_ORGANIZATION_ID, SANITY_DATASET }