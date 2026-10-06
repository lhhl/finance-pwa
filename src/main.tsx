import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Framework7 from 'framework7/lite-bundle'
import 'framework7/css/bundle'
import 'framework7-icons/css/framework7-icons.css'
import Framework7React from 'framework7-react';
Framework7.use(Framework7React);
import MyApp from './App.tsx'
import './index.css'

import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return
    const check = () => {
      if (navigator.onLine) registration.update()
    }
    setInterval(check, 60 * 60 * 1000)
    // Installed Android PWAs resume from background without a page load.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') check()
    })
    window.addEventListener('online', check)
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MyApp />
  </StrictMode>,
)
