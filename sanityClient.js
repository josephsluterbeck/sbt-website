// sanityClient.js
import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'YOUR_PROJECT_ID', // find in sanity.json or on sanity.io/manage
  dataset: 'production',        // or your dataset name
  apiVersion: '2026-03-21',     // use today's date
  useCdn: true,                 // `false` if you want latest content always
})