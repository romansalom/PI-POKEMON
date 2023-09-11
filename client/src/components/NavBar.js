import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link
import SearchBar from './SearchBar';
import '../Styles/navbarStyle.css';

const NavBar = () => {
  const [pokemonDetails, setPokemonDetails] = useState(null);

  const handleSearchResult = (data) => {
    // Esta función recibe los resultados de la búsqueda
    // y hace algo con ellos, como guardarlos en el estado
    setPokemonDetails(data);
  };

  

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-item" >Home</Link>
        <Link to='/form' className="navbar-item">Crea tu Pokémon</Link>
       
        <SearchBar onSearchResult={handleSearchResult} />
      </div>
    </nav>
  );
};

export default NavBar;


