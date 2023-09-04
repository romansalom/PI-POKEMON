const axios = require('axios');
const express = require('express');
const { Type } = require("../db");

const getTypes = async (req, res) => {
  try {
    // Consultar la API para obtener los tipos de Pokémon
    const response = await axios.get('https://pokeapi.co/api/v2/type');
    const typesFromAPI = response.data.results;

    // Obtener todos los tipos de la base de datos
    const allDbTypes = await Type.findAll();

    // Crear un conjunto de nombres de tipos en la base de datos (insensible a mayúsculas y minúsculas)
    const dbTypeNamesSet = new Set(allDbTypes.map(dbType => dbType.name.toLowerCase()));

    // Filtrar los tipos de la API para evitar duplicados y tipos ya existentes
    const uniqueTypes = typesFromAPI.filter(type => {
      const typeName = type.name.toLowerCase();
      return !dbTypeNamesSet.has(typeName);
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
    const allTypes = await Type.findAll();

    res.status(200).json(allTypes);
  } catch (error) {
    res.status(500).json({ message: 'Hubo un error al obtener los tipos de Pokémon', error: error.message });
  }
};

module.exports = {
  getTypes,
};


