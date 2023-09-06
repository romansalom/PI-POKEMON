import React,{ useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage'; // Importa tu componente LandingPage
import Home from './components/Home'; // Importa tu componente Home
import NavBar from './components/NavBar'; // Importa tu componente NavBar
import PokemonDetail from './components/PokemonDetail'; 
 import CreatePokemonForm from '../src/components/Form'

function App() {
  const { pathname } = useLocation();
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchResult = (results) => {
    setSearchResults(results);}

    
  return (
    <div className="App">
      {pathname !== '/' && <NavBar onSearchResult={handleSearchResult}   />}
      
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
          <Route path="/form" element = {<CreatePokemonForm />}  />   

        </Routes>
      
    </div>
  );
}

export default App;
