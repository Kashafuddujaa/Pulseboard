import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const root = createRoot(document.getElementById('root')!)

// App pulls in the env guards at module load, so a bad deployment variable
// throws before React ever mounts. Import it lazily to keep that failure
// on screen instead of leaving a blank page behind.
import('./App.tsx')
  .then(({ default: App }) => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
  .catch((error: unknown) => {
    root.render(
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>
        <h1 style={{ fontSize: '1.125rem', fontWeight: 600 }}>PulseBoard failed to start</h1>
        <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
          {error instanceof Error ? error.message : String(error)}
        </p>
      </div>,
    )
  })
