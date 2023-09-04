import React from 'react';
import '../Styles/cardStyle.css'
const Card = ({ id, name, image, health, attack, defense, types }) => {
  return (
    <div className="card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>Health: {health}</p>
      <p>Attack: {attack}</p>
      <p>Defense: {defense}</p>
      <p>Types:</p>
      <ul>
        {types.map((type) => (
          <li key={type.id}>{type.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Card;