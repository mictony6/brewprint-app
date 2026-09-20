import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only endpoint that lets the debug desk-position editor persist its
// dragged/resized layout straight to src/data/deskPositions.json, instead
// of copy-pasting exported JSON by hand.
function deskPositionsSavePlugin(): Plugin {
  const filePath = resolve(process.cwd(), 'src/data/deskPositions.json')
  return {
    name: 'desk-positions-save',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/desk-positions', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }
        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body)
            writeFileSync(filePath, JSON.stringify(parsed, null, 2) + '\n')
            res.statusCode = 200
            res.end('ok')
          } catch (err) {
            res.statusCode = 400
            res.end(String(err))
          }
        })
      })
    },
  }
}

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
  plugins: [react(), headLinksPlugin(), deskPositionsSavePlugin()],
  build: {
    manifest: true,
  },
})
