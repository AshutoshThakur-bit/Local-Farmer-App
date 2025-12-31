// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import axios from "axios";
import App from './App.jsx';

// Configure axios base URL
axios.defaults.baseURL = "http://localhost:5000/api";

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);
