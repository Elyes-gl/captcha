import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Remove StrictMode to avoid double useEffect in dev
  // <React.StrictMode>
    <Router>
      <App />
    </Router>
  // </React.StrictMode>
);
