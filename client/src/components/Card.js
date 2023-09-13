import React from 'react';
import '../Styles/cardStyle.css'; 
import { Link } from 'react-router-dom'; 

// Definir un componente funcional llamado Card que recibe propiedades (id, name, image, health, attack, defense, types)
const Card = ({ id, name, image, health, attack, defense, types }) => (
  <div className="card"> 
    <img src={image} alt={name} />
    <Link to={`/pokemon/${id}`}> {/* Crear un enlace a la página del Pokémon específico */}
      <h3>{name}</h3>
    </Link> 
    <p>Health: {health}</p> 
    <p>Attack: {attack}</p> 
    <p>Defense: {defense}</p> 
    <p>Types:</p> 
    <ul> {/* Crear una lista no ordenada */}
      {types.map((type) => ( /* Mapear sobre los tipos del Pokémon */
        <li key={type.id}>{type.name}</li> /* Mostrar cada tipo del Pokémon */
      ))}
    </ul>
  </div>
);

export default Card; 