import React, { useEffect } from "react";
import { connect } from "react-redux";
import Select from "react-select";
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

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get("http://localhost:3001/pokemons")
      .then((response) => {
        setPokemons(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los Pokémon:", error);
        setError("Error al obtener los Pokémon. Inténtalo de nuevo más tarde.");
        setLoading(false);
      });

    axios
      .get("http://localhost:3001/type")
      .then((response) => {
        setTypes(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de Pokémon:", error);
      });
  }, [setPokemons, setTypes, setLoading, setError]);

  const handleTypeChange = (selectedOption) => {
    setSelectedType(selectedOption.value);
    setSelectedTypeName(selectedOption.label);
    setCurrentPage(1);
  };

  const typeOptions = [
    { value: null, label: "TODOS LOS POKÉMONES" },
    ...types.map((type) => ({
      value: type.id,
      label: type.name,
    })),
  ];

  const handleSortDirectionChange = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleSortByChange = (selectedOption) => {
    setSortBy(selectedOption.value);
    setCurrentPage(1);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(pokemons.length / 12)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredPokemons = selectedType === null
    ? pokemons
    : pokemons.filter((pokemon) =>
        pokemon.types.some((type) => type.id === selectedType)
      );

  const startIndex = (currentPage - 1) * 12;
  const endIndex = startIndex + 12;

  const sortedPokemons = [...filteredPokemons].sort((a, b) => {
    if (sortBy === "name") {
      return (sortDirection === "asc" ? 1 : -1) * a.name.localeCompare(b.name);
    } else if (sortBy === "attack") {
      return (sortDirection === "asc" ? 1 : -1) * (a.attack - b.attack);
    }
    return 0;
  });

  const paginatedPokemons = sortedPokemons.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPokemons.length / 12);

  return (
    <div className="home-container">
      <h2 className="home-title">Pokémon List</h2>

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

      <div className="home-sort-buttons">
        <button onClick={handleSortDirectionChange} className="home-sort-button">
          Orden {sortDirection === "asc" ? "Ascendente" : "Descendente"}
        </button>
        <Select
          id="sortBy"
          name="sortBy"
          options={[
            { value: "name", label: "Nombre" },
            { value: "attack", label: "Ataque" },
          ]}
          value={{ value: sortBy, label: sortBy === "name" ? "Nombre" : "Ataque" }}
          onChange={handleSortByChange}
          placeholder="Ordenar por"
          className="home-select"
        />
      </div>

      {!loading && !error && (
        <div className="home-card-container">
          {paginatedPokemons.length > 0 ? (
            <Cards pokemons={paginatedPokemons} />
          ) : (
            <p className="home-message">No se encontraron Pokémon del tipo "{selectedTypeName}".</p>
          )}
        </div>
      )}

      <div className="home-pagination">
        <button onClick={prevPage} className="home-pagination-button">
          Anterior
        </button>
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
        <button onClick={nextPage} className="home-pagination-button">
          Siguiente
        </button>
      </div>

      {loading && <p className="home-message">Cargando...</p>}

      {error && <p className="home-message">{error}</p>}
    </div>
  );
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
