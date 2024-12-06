import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CaptchaPage from './components/CaptchaPage';
import MainGamePage from './components/MainGamePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CaptchaPage />} />
      <Route path="/game" element={<MainGamePage />} />
    </Routes>
  );
}

export default App;
