import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import './styles.css';
import App from './App';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
    </Router>
  </React.StrictMode>
);
