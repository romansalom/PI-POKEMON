import React from 'react';
import '../Styles/cardStyle.css'
import { Link } from 'react-router-dom';
const Card = ({ id, name, image, health, attack, defense, types }) => {
  return (
    <div className="card">
      <img src={image} alt={name} />
      <Link to={`/pokemon/${id}`}>
      <h3>{name}</h3>
      </Link> 
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