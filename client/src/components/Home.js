import React, { useEffect, useState } from 'react';
import Cards from './Cards'; // Importa el componente Cards
import axios from 'axios';

function Home() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    // Realiza una solicitud a tu API o servidor para obtener los Pokémon
    axios.get('http://localhost:3001/pokemons') // Asegúrate de ajustar la ruta de la API según tu configuración
      .then((response) => {
        setPokemons(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los Pokémon:', error);
      });
  }, []);

  return (
    <div className="home">
      <h2>Pokémon List</h2>
      <Cards pokemons={pokemons} /> {/* Renderiza el componente Cards y pasa la lista de pokémons */}
    </div>
  );
}

export default Home;
