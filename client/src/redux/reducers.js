// reducers.js

import {
    SET_POKEMONS,
    SET_TYPES,
    SET_SELECTED_TYPE,
    SET_SELECTED_TYPE_NAME,
    SET_LOADING,
    SET_ERROR,
    SET_SORT_DIRECTION,
    SET_SORT_BY,
    SET_CURRENT_PAGE,
  } from "./actions";
  
  const initialState = {
    pokemons: [],
    types: [],
    selectedType: null,
    selectedTypeName: null,
    loading: false,
    error: null,
    sortDirection: "asc",
    sortBy: "name",
    currentPage: 1,
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_POKEMONS:
        return {
          ...state,
          pokemons: action.pokemons,
        };
      case SET_TYPES:
        return {
          ...state,
          types: action.types,
        };
      case SET_SELECTED_TYPE:
        return {
          ...state,
          selectedType: action.selectedType,
        };
      case SET_SELECTED_TYPE_NAME:
        return {
          ...state,
          selectedTypeName: action.selectedTypeName,
        };
      case SET_LOADING:
        return {
          ...state,
          loading: action.loading,
        };
      case SET_ERROR:
        return {
          ...state,
          error: action.error,
        };
      case SET_SORT_DIRECTION:
        return {
          ...state,
          sortDirection: action.sortDirection,
        };
      case SET_SORT_BY:
        return {
          ...state,
          sortBy: action.sortBy,
        };
      case SET_CURRENT_PAGE:
        return {
          ...state,
          currentPage: action.currentPage,
        };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  