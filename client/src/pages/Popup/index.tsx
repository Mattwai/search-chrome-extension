import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Popup';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element with id "root"');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 