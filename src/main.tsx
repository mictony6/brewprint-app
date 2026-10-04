import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PostHogProvider } from '@posthog/react'
import type { PostHogInterface } from 'posthog-js'

const options = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  defaults: '2026-05-30',
  loaded: (ph: PostHogInterface) => {
    ph.register({
      environment: import.meta.env.DEV ? 'development' : 'production',
    })
  },
} as const

createRoot(document.getElementById('brewprint-root')!).render(
  <StrictMode>
    <PostHogProvider apiKey={import.meta.env.VITE_POSTHOG_PROJECT_TOKEN} options={options}>
      <App />
    </PostHogProvider>
  </StrictMode>,
)
