import { siteConfig } from './siteConfig.js'

function parseBoolEnv(value) {
  if (value == null || String(value).trim() === '') return null
  return ['1', 'true', 'yes'].includes(String(value).trim().toLowerCase())
}

export function hasArticles() {
  const fromEnv = parseBoolEnv(import.meta.env.VITE_HAS_ARTICLES)
  return fromEnv ?? Boolean(siteConfig.hasArticles)
}
