
import React from 'react';
import { Link } from 'react-router-dom'; // Si estás utilizando React Router

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="background-image">
        {/* Aquí puedes agregar una imagen de fondo */}
      </div>
      <div className="landing-content">
        <h1>Bienvenido a nuestra aplicación Pokémon</h1>
        <p>¡Encuentra y explora el mundo Pokémon!</p>
        <Link to="/home">Ingresar</Link>
      </div>
    </div>
  );
};

export default LandingPage;
