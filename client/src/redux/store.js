import { configureStore } from "@reduxjs/toolkit"; // Importa configureStore desde Redux Toolkit
import rootReducer from "./reducers"; // Importa tu archivo de reducers

const store = configureStore({
  reducer: rootReducer, // Pasa tu reducer principal aquí
  // Ottras opciones de configuración si las tienes
});

export default store;
