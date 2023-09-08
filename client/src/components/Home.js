import React, { useEffect, useState } from 'react';
import Cards from './Cards'; // Importa el componente Cards
import Select from 'react-select'; // Importa Select de react-select
import axios from 'axios';
import '../Styles/navbarStyle.css';

function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null); // Tipo de Pokémon seleccionado
  const [selectedTypeName, setSelectedTypeName] = useState(null); // Nombre del tipo seleccionado
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Mensaje de error
  const [sortDirection, setSortDirection] = useState('asc'); // Dirección de ordenamiento
  const [sortBy, setSortBy] = useState('name'); // Campo por el que se ordena
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const pokemonPerPage = 12; // Número de Pokémones por página

  useEffect(() => {
    // Inicia la carga de datos
    setLoading(true);
    setError(null);

    // Realiza una solicitud a tu API o servidor para obtener los Pokémon
    axios.get('http://localhost:3001/pokemons')
      .then((response) => {
        setPokemons(response.data);
        setLoading(false); // Finaliza la carga
      })
      .catch((error) => {
        console.error('Error al obtener los Pokémon:', error);
        setError('Error al obtener los Pokémon. Inténtalo de nuevo más tarde.');
        setLoading(false); // Finaliza la carga con error
      });

    // Realiza una solicitud para obtener los tipos de Pokémon desde la base de datos
    axios.get('http://localhost:3001/type')
      .then((response) => {
        setTypes(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los tipos de Pokémon:', error);
      });
  }, []);
  const handleTypeChange = (selectedOption) => {
    setSelectedType(selectedOption.value);
    setSelectedTypeName(selectedOption.label);
    setCurrentPage(1); // Vuelve a la página 1 al cambiar el tipo
  };

  // Agrega una opción adicional para "TODOS LOS POKÉMONES" en typeOptions
  const typeOptions = [
    { value: null, label: 'TODOS LOS POKÉMONES' }, // Opción para mostrar todos los Pokémon
    ...types.map((type) => ({
      value: type.id,
      label: type.name,
    })),
  ];

  // Función para manejar el cambio de dirección de ordenamiento
  const handleSortDirectionChange = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSortByChange = (selectedOption) => {
    setSortBy(selectedOption.value);
    setCurrentPage(1); // Vuelve a la página 1 al cambiar el campo de ordenamiento
  };
  // Función para cambiar la página actual a la siguiente
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredPokemons.length / pokemonPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Función para cambiar la página actual a la anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Filtra los Pokémon según el tipo seleccionado
  const filteredPokemons = selectedType === null
    ? pokemons
    : pokemons.filter((pokemon) =>
        pokemon.types.some((type) => type.id === selectedType)
      );

  // Calcula el índice de inicio y fin para la paginación
  const startIndex = (currentPage - 1) * pokemonPerPage;
  const endIndex = startIndex + pokemonPerPage;

  // Función para ordenar los Pokémon según el estado actual de ordenamiento
  const sortedPokemons = [...filteredPokemons].sort((a, b) => {
    // Compara los campos y la dirección de ordenamiento
    if (sortBy === 'name') {
      return (sortDirection === 'asc' ? 1 : -1) * a.name.localeCompare(b.name);
    } else if (sortBy === 'attack') {
      return (sortDirection === 'asc' ? 1 : -1) * (a.attack - b.attack);
    }
    return 0; // Orden predeterminado
  });

  // Obtiene los Pokémones para la página actual
  const paginatedPokemons = sortedPokemons.slice(startIndex, endIndex);

  // Calcula el número total de páginas
  const totalPages = Math.ceil(filteredPokemons.length / pokemonPerPage);

  return (
    <div className="home-container">
      <h2 className="home-title">Pokémon List</h2>

      {/* Filtro por tipo */}
      <div className="home-filters">
        <Select
          id="types"
          name="type"
          options={typeOptions}
          value={typeOptions.find((option) => option.value === selectedType)}
          onChange={handleTypeChange}
          placeholder="Selecciona un tipo"
          className="home-select"
        />
      </div>

      {/* Botones de ordenamiento */}
      <div className="home-sort-buttons">
        <button onClick={handleSortDirectionChange} className="home-sort-button">
          Orden {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
        </button>
        <Select
          id="sortBy"
          name="sortBy"
          options={[
            { value: 'name', label: 'Nombre' },
            { value: 'attack', label: 'Ataque' },
          ]}
          value={{ value: sortBy, label: sortBy === 'name' ? 'Nombre' : 'Ataque' }}
          onChange={handleSortByChange}
          placeholder="Ordenar por"
          className="home-select"
        />
      </div>

      {/* Renderiza el componente Cards y muestra un mensaje de error si no se encuentran Pokémon */}
      {!loading && !error && (
        <div className="home-card-container">
          {paginatedPokemons.length > 0 ? (
            <Cards pokemons={paginatedPokemons} />
          ) : (
            <p className="home-message">No se encontraron Pokémon del tipo "{selectedTypeName}".</p>
          )}
        </div>
      )}

      {/* Paginación numerada */}
      <div className="home-pagination">
        <button onClick={prevPage} className="home-pagination-button">
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`home-pagination-button ${
              i + 1 === currentPage ? 'active' : ''
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={nextPage} className="home-pagination-button">
          Siguiente
        </button>
      </div>

      {/* Muestra un mensaje de carga */}
      {loading && <p className="home-message">Cargando...</p>}

      {/* Muestra un mensaje de error si se produce un error */}
      {error && <p className="home-message">{error}</p>}
    </div>
  );
}

export default Home;