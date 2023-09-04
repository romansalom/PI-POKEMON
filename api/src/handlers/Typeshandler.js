const axios = require('axios');
const express = require('express');
const {Type} = require("../db");



const getTypes = async (req, res) => {
  try {
    // Consultar la API para obtener los tipos de Pokémon
    const response = await axios.get('https://pokeapi.co/api/v2/type');
    const typesFromAPI = response.data.results;

    // Guardar los tipos en la base de datos (solo si aún no están guardados)
   // Guardar los tipos en la base de datos (solo si aún no están guardados)
await Promise.all(
  typesFromAPI.map(async (type) => {
    // Verificar si el tipo ya existe en la base de datos
    const existingType = await Type.findOne({ where: { name: type.name } });

    if (!existingType) {
      await Type.create({
        name: type.name,
      });
    }
  })
);

    // Obtener todos los tipos de la base de datos
    const allTypes = await Type.findAll();

    res.status(200).json(allTypes);
  } catch (error) {
    res.status(500).json({ message: 'Hubo un error al obtener los tipos de Pokémon', error: error.message });
  }
};


module.exports = {
  getTypes,
};

