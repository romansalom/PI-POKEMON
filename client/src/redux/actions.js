// actions.js

export const SET_POKEMONS = "SET_POKEMONS";
export const SET_TYPES = "SET_TYPES";
export const SET_SELECTED_TYPE = "SET_SELECTED_TYPE";
export const SET_SELECTED_TYPE_NAME = "SET_SELECTED_TYPE_NAME";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";
export const SET_SORT_DIRECTION = "SET_SORT_DIRECTION";
export const SET_SORT_BY = "SET_SORT_BY";
export const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";

export const setPokemons = (pokemons) => ({
  type: SET_POKEMONS,
  pokemons,
});

export const setTypes = (types) => ({
  type: SET_TYPES,
  types,
});

export const setSelectedType = (selectedType) => ({
  type: SET_SELECTED_TYPE,
  selectedType,
});

export const setSelectedTypeName = (selectedTypeName) => ({
  type: SET_SELECTED_TYPE_NAME,
  selectedTypeName,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  loading,
});

export const setError = (error) => ({
  type: SET_ERROR,
  error,
});

export const setSortDirection = (sortDirection) => ({
  type: SET_SORT_DIRECTION,
  sortDirection,
});

export const setSortBy = (sortBy) => ({
  type: SET_SORT_BY,
  sortBy,
});

export const setCurrentPage = (currentPage) => ({
  type: SET_CURRENT_PAGE,
  currentPage,
});
