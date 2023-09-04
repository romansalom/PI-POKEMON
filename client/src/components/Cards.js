
// Cards.js
import React from 'react';
import Card from './Card';


const Cards = ({ pokemons }) => {
  return (
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
};

export default Cards;
