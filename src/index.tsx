import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './App';
import {TrackerProvider} from "@/contexts/TrackerContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <TrackerProvider>
          <App />
      </TrackerProvider>
  </React.StrictMode>
);

