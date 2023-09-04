import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage'; // Importa tu componente LandingPage
import Home from './components/Home'; // Importa tu componente Home
import NavBar from './components/NavBar'; // Importa tu componente NavBar

function App() {
  const { pathname } = useLocation();

  return (
    <div className="App">
      {pathname !== '/' && <NavBar />}
      
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      
    </div>
  );
}

export default App;
