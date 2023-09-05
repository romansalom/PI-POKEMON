import React, { useState } from 'react';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom'; // Importa Link
import axios from 'axios';

const NavBar = () => {
  const [pokemonDetails, setPokemonDetails] = useState(null);

  const handleSearchResult = (data) => {
    // Esta función recibe los resultados de la búsqueda
    // y hace algo con ellos, como guardarlos en el estado
    setPokemonDetails(data);
  };

  return (
    <div>
      <SearchBar onSearchResult={handleSearchResult} />
      {/* Agrega un enlace (Link) a la página de inicio (Home) */}
      <Link to="/home">Home</Link>
    </div>
  );
};

export default NavBar;
