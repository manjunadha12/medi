import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

// Critical Polyfills for mobile environment & WebRTC libraries
if (typeof window.global === 'undefined') {
  window.global = window;
}

if (typeof window.process === 'undefined') {
  window.process = { env: { NODE_ENV: 'development' }, browser: true };
}

// Robust Buffer mock to prevent "Illegal constructor" or crashes in bundled environments
if (typeof window.Buffer === 'undefined') {
  const BufferMock = function() {
    return [];
  };
  BufferMock.isBuffer = () => false;
  BufferMock.from = () => [];
  BufferMock.alloc = () => [];
  window.Buffer = BufferMock;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" />
  </React.StrictMode>
)
