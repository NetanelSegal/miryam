import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ParticipantProvider } from './contexts/ParticipantContext'
import { ToastProvider } from './components/ui/Toast'
import { App } from './App'
import * as store from './lib/store'
import './index.css'

store.seedIfEmpty()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ParticipantProvider>
          <App />
        </ParticipantProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
