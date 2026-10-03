import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Framework7 from 'framework7/lite-bundle'
import 'framework7/css/bundle'
import 'framework7-icons/css/framework7-icons.css'
import Framework7React from 'framework7-react';
Framework7.use(Framework7React);
import MyApp from './App.tsx'
import './index.css'

import { registerServiceWorker, setupOnlineStatusListener } from './serviceWorkerRegister'

// Register service worker for offline support
registerServiceWorker()

// Setup online/offline status listeners
setupOnlineStatusListener(
  () => {
    // App came online
    console.log('App regained internet connection')
  },
  () => {
    // App went offline
    console.log('App lost internet connection - offline mode activated')
  }
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MyApp />
  </StrictMode>,
)
