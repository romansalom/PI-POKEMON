import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage'; // Importa tu componente LandingPage
import Home from './components/Home'; // Importa tu componente Home
import NavBar from './components/NavBar'; // Importa tu componente NavBar
import PokemonDetail from './components/PokemonDetail'; 

function App() {
  const { pathname } = useLocation();

  return (
    <div className="App">
      {pathname !== '/' && <NavBar />}
      
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
      
    </div>
  );
}

export default App;
