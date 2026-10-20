import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import DesignReference from './DesignReference'
import DesignExport from './DesignExport'
import './index.css'

const path = window.location.pathname

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {path === '/design-reference' ? <DesignReference />
      : path === '/design-export' ? <DesignExport />
      : <App />}
  </React.StrictMode>,
)
