import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Extracts external <link> tags (Google Fonts preconnect/stylesheet, etc.)
// from index.html into dist/head-links.json, so loader.js can inject them
// into the host page's <head> without hardcoding anything. index.html stays
// the single source of truth — add/change a font there and it just works.
function headLinksPlugin(): Plugin {
  return {
    name: 'head-links-manifest',
    generateBundle() {
      const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8')
      const links: Array<{ rel: string; href: string; crossorigin?: string }> = []
      for (const match of html.matchAll(/<link\s+([^>]*)>/gi)) {
        const attrs = match[1]
        const href = attrs.match(/href=["']([^"']+)["']/i)?.[1]
        const rel = attrs.match(/rel=["']([^"']+)["']/i)?.[1]
        if (!href || !rel || !/^https?:\/\//i.test(href)) continue
        const crossorigin = attrs.match(/crossorigin(?:=["']([^"']*)["'])?/i)
        links.push({
          rel,
          href,
          ...(crossorigin ? { crossorigin: crossorigin[1] || 'anonymous' } : {}),
        })
      }
      this.emitFile({
        type: 'asset',
        fileName: 'head-links.json',
        source: JSON.stringify(links, null, 2),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: 'https://brewprint-app.pages.dev/',
  plugins: [react(), headLinksPlugin()],
  build: {
    manifest: true,
  },
})
