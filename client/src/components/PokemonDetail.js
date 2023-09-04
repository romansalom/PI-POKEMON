import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function PokemonDetail() {
  const { id } = useParams(); // Obtén el ID del Pokémon de la URL
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    // Realiza una llamada a la API o consulta tus datos para obtener los detalles del Pokémon según el ID

    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3001/pokemons/${id}`);
        if (!response.ok) {
          throw new Error('No se pudo cargar el Pokémon.');
        }
        const data = await response.json();
        setPokemonData(data);
      } catch (error) {
        console.error('Error al cargar el Pokémon:', error);
      }
    }

    fetchData();
  }, [id]);

  if (!pokemonData) {
    return <div>Cargando...</div>;
  }
  
  const { name, image, health, attack, defense, types } = pokemonData;
  
  return (
    <div className="card">
      <img src={image} alt={name} onError={() => console.error('Error al cargar la imagen')} />
      
        <h3>{name}</h3>
     
      <ul>
        <p>Health: {health}</p>
        <p>Attack: {attack}</p>
        <p>Defense: {defense}</p>
        <p>Types:</p>
        <ul>
          {types.map((type) => (
            <li key={type.id}>{type.name}</li>
          ))}
        </ul>
      </ul>
    </div>
  );
}

export default PokemonDetail;
