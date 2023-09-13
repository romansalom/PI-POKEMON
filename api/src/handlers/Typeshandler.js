
const axios = require('axios');
const express = require('express');
const { Type } = require("../db"); // Importar el modelo de datos 'Type' desde el archivo '../db'

// Definir el controlador para obtener tipos de Pokémon
const getTypes = async (req, res) => {
  try {
    // Consultar la API para obtener los tipos de Pokémon
    const response = await axios.get('https://pokeapi.co/api/v2/type'); // Hacer una solicitud GET a la API de Pokémon
    const typesFromAPI = response.data.results; // Extraer la lista de tipos de la respuesta API

    // Obtener todos los tipos de la base de datos
    const allDbTypes = await Type.findAll(); // Consultar todos los tipos en la base de datos

    // Crear un conjunto de nombres de tipos en la base de datos (insensible a mayúsculas y minúsculas)
    const dbTypeNamesSet = new Set(allDbTypes.map(dbType => dbType.name.toLowerCase())); // Crear un conjunto con los nombres de tipos en la base de datos

    // Filtrar los tipos de la API para evitar duplicados y tipos ya existentes
    const uniqueTypes = typesFromAPI.filter(type => {
      const typeName = type.name.toLowerCase();
      return !dbTypeNamesSet.has(typeName); // Filtrar solo los tipos que no están en la base de datos
    });

    // Guardar los tipos únicos en la base de datos
    await Promise.all(
      uniqueTypes.map(async (type) => {
        await Type.create({
          name: type.name,
        });
      })
    );

    // Obtener todos los tipos de la base de datos después de la inserción
    const allTypes = await Type.findAll(); // Consultar todos los tipos en la base de datos después de la inserción

    res.status(200).json(allTypes); // Enviar una respuesta JSON con todos los tipos
  } catch (error) {
    res.status(500).json({ message: 'Hubo un error al obtener los tipos de Pokémon', error: error.message }); // En caso de error, enviar una respuesta de error con un mensaje y detalles del error
  }
};

module.exports = {
  getTypes,
};
