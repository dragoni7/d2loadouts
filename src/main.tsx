import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('no root element found')

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
