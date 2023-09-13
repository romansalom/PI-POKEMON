import React from 'react'; // Importar React
import Card from './Card'; // Importar el componente Card

// Definir un componente funcional llamado Cards que recibe propiedades (pokemons)
const Cards = ({ pokemons }) => (
  <div className="cards-container"> 
    {pokemons.map((pokemon) => (
      <Card
        key={pokemon.id}
        id={pokemon.id}
        name={pokemon.name}
        image={pokemon.image}
        health={pokemon.health}
        attack={pokemon.attack}
        defense={pokemon.defense}
        types={pokemon.types} 
      />
    ))}
  </div>
);

export default Cards; 
