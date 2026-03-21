import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'orxxqp7k', 
  dataset: 'Job',        
  apiVersion: '2026-03-21',     
  useCdn: false,                 
})