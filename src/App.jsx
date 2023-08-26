import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Settings from './pages/settings';
import RandomMovie from './pages/RandomMovie';
import Watchlist from './pages/Watchlist';

const App = () => {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Settings></Settings>} />
        <Route path="/random" element={<RandomMovie></RandomMovie>} />
        <Route path="/watchlist" element={<Watchlist></Watchlist>} />
      </Routes>
    </div>
  );
}

export default App;