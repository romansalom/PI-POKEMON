import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/pokemons/nombre/${searchTerm}`);

      if (response.data) {
        const pokemonId = response.data.id;
        navigate(`/pokemon/${pokemonId}`);
        
        // Restablece el valor de la barra de búsqueda
        setSearchTerm('');
        setErrorMessage('');
      } else {
        setErrorMessage('No se encontró el Pokémon');
      }
    } catch (error) {
      console.error('Error al buscar Pokémon por nombre', error);
      setErrorMessage(`no se encontró el pokemon con nombre "${searchTerm}"`);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar Pokémon por nombre"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button onClick={handleSearchClick}>Buscar</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default SearchBar;
