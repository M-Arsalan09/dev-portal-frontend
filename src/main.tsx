/**
 * Application Entry Point
 * 
 * This file serves as the entry point for the React application.
 * It initializes the React root and renders the main App component
 * with React's StrictMode for enhanced development experience.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Get the root DOM element and create React root
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

// Render the application with StrictMode enabled
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
