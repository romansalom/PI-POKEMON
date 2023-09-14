import React, { useEffect } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import axios from "axios";
import Cards from "./Cards";
import {
  setPokemons,
  setTypes,
  setSelectedType,
  setSelectedTypeName,
  setLoading,
  setError,
  setSortDirection,
  setSortBy,
  setCurrentPage,
} from "../redux/actions";
import "../Styles/navbarStyle.css";

function Home(props) {
  // Extrae las propiedades y funciones del store de Redux
  const {
    pokemons,
    types,
    selectedType,
    selectedTypeName,
    loading,
    error,
    sortDirection,
    sortBy,
    currentPage,
    setPokemons,
    setTypes,
    setSelectedType,
    setSelectedTypeName,
    setLoading,
    setError,
    setSortDirection,
    setSortBy,
    setCurrentPage,
  } = props;

  // Efecto que se ejecuta al cargar el componente
  useEffect(() => {
    // Inicializa el estado de carga y errores
    setLoading(true);
    setError(null);

    // Realiza una solicitud GET para obtener la lista de Pokémon desde la API
    axios
      .get("http://localhost:3001/pokemons")
      .then((response) => {
        // Almacena los datos de Pokémon en el estado de Redux
        setPokemons(response.data);

        // Finaliza el estado de carga
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los Pokémon:", error);

        // Establece un mensaje de error en caso de fallo
        setError("Error al obtener los Pokémon. Inténtalo de nuevo más tarde.");

        // Finaliza el estado de carga
        setLoading(false);
      });

    // Realiza una solicitud GET para obtener los tipos de Pokémon desde la API
    axios
      .get("http://localhost:3001/type")
      .then((response) => {
        // Almacena los tipos de Pokémon en el estado de Redux
        setTypes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de Pokémon:", error);
      });
  }, [setPokemons, setTypes, setLoading, setError]);

  // Función para manejar el cambio de tipo de Pokémon seleccionado
  const handleTypeChange = (selectedOption) => {
    // Actualiza el tipo de Pokémon seleccionado en el estado de Redux
    setSelectedType(selectedOption.value);

    // Actualiza el nombre del tipo de Pokémon seleccionado en el estado de Redux
    setSelectedTypeName(selectedOption.label);

    // Establece la página actual en 1 al seleccionar un nuevo tipo
    setCurrentPage(1);
  };

  // Define las opciones de tipo para el componente Select
  const typeOptions = [
    { value: "", label: "TODOS LOS POKÉMONES" },
    ...types.map((type) => ({
      value: type.id,
      label: type.name,
    })),
  ];

  // Función para manejar el cambio en la dirección de ordenamiento
  const handleSortDirectionChange = () => {
    // Cambia la dirección de ordenamiento en el estado de Redux
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Función para manejar el cambio en la opción de ordenamiento
  const handleSortByChange = (selectedOption) => {
    // Actualiza la opción de ordenamiento en el estado de Redux
    setSortBy(selectedOption.value);

    // Establece la página actual en 1 al seleccionar una nueva opción de ordenamiento
    setCurrentPage(1);
  };

  // Función para ir a la página siguiente
  const nextPage = () => {
    if (currentPage < Math.ceil(pokemons.length / 12)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Función para ir a la página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Filtra los Pokémon según el tipo seleccionado
  const filteredPokemons =
    selectedType === ""
      ? pokemons
      : pokemons.filter((pokemon) =>
          pokemon.types.some((type) => type.id === selectedType)
        );

  // Calcula el índice de inicio y fin de la lista paginada
  const startIndex = (currentPage - 1) * 12;
  const endIndex = startIndex + 12;

  // Ordena los Pokémon según la opción de ordenamiento y dirección
  const sortedPokemons = [...filteredPokemons].sort((a, b) => {
    if (sortBy === "name") {
      return (sortDirection === "asc" ? 1 : -1) * a.name.localeCompare(b.name);
    } else if (sortBy === "attack") {
      return (sortDirection === "asc" ? 1 : -1) * (a.attack - b.attack);
    }
    return 0;
  });

  // Obtiene la lista de Pokémon paginada
  const paginatedPokemons = sortedPokemons.slice(startIndex, endIndex);

  // Calcula el número total de páginas
  const totalPages = Math.ceil(filteredPokemons.length / 12);

  // Renderiza el contenido del componente Home
  return (
    <div className="home-container">
      <h2 className="home-title">Pokémon List</h2>

      <div className="home-filters">
        {/* Componente Select para seleccionar el tipo de Pokémon */}
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

      <div className="home-sort-buttons">
        {/* Botón para cambiar la dirección de ordenamiento */}
        <button
          onClick={handleSortDirectionChange}
          className="home-sort-button"
        >
          Orden {sortDirection === "asc" ? "ascendente" : "descendente"}
        </button>
        {/* Componente Select para seleccionar la opción de ordenamiento */}
        <Select
          id="sortBy"
          name="sortBy"
          options={[
            { value: "name", label: "Nombre" },
            { value: "attack", label: "Ataque" },
          ]}
          value={{
            value: sortBy,
            label: sortBy === "name" ? "Nombre" : "Ataque",
          }}
          onChange={handleSortByChange}
          placeholder="Ordenar por"
          className="home-select"
        />
      </div>

      {!loading && !error && (
        <div className="home-card-container">
          {/* Renderiza la lista de Pokémon o un mensaje si no se encontraron Pokémon */}
          {paginatedPokemons.length > 0 ? (
            <Cards pokemons={paginatedPokemons} />
          ) : (
            <p className="home-message">
              No se encontraron Pokémon del tipo "{selectedTypeName}".
            </p>
          )}
        </div>
      )}
<div className="home-pagination">
  {/* Botón para ir a la página anterior */}
  <button onClick={prevPage} className="home-pagination-button">
    Anterior
  </button>
  {/* Renderiza los botones de paginación */}
  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      onClick={() => setCurrentPage(i + 1)}
      className={`home-pagination-button ${
        i + 1 === currentPage ? "active" : ""
      }`}
    >
      {i + 1}
    </button>
  ))}
  {/* Botón para ir a la página siguiente */}
  <button onClick={nextPage} className="home-pagination-button">
    Siguiente
  </button>

  {/* Muestra el indicador de la página actual */}
  <p className="current-page-indicator">
    Página {currentPage} de {totalPages}
  </p>
</div>


      {/* Muestra un mensaje de carga si la página está cargando */}
      {loading && <p className="home-message">Cargando...</p>}

      {/* Muestra un mensaje de error si se produce un error */}
      {error && <p className="home-message">{error}</p>}
    </div>
  );
}

// Función que mapea el estado de Redux a las propiedades del componente
const mapStateToProps = (state) => ({
  pokemons: state.pokemons,
  types: state.types,
  selectedType: state.selectedType,
  selectedTypeName: state.selectedTypeName,
  loading: state.loading,
  error: state.error,
  sortDirection: state.sortDirection,
  sortBy: state.sortBy,
  currentPage: state.currentPage,
});

// Conecta el componente Home con el store de Redux y define las acciones disponibles
const mapDispatchToProps = {
  setPokemons,
  setTypes,
  setSelectedType,
  setSelectedTypeName,
  setLoading,
  setError,
  setSortDirection,
  setSortBy,
  setCurrentPage,
};

// Exporta el componente Home conectado con Redux
export default connect(mapStateToProps, mapDispatchToProps)(Home);
