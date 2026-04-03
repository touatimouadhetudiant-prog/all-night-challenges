import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import SuccessPage from './SuccessPage';
import './index.css';
import AdminPage from "./AdminPage";
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/anc-admin-panel" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);