const axios = require('axios');
const express = require('express');
const URL = 'https://pokeapi.co/api/v2/pokemon';
const { Pokemon, Type } = require("../db");
const { UUID } = require('sequelize');
const { Op } = require('sequelize');

// Método para obtener todos los Pokémon desde una API y la base de datos local
const getAllPokemons = async (req, res) => {
  try {
    // Obtener la lista de Pokémon desde la API externa
    const response = await axios(`${URL}?limit=150`);
    const allPokemonsAPI = response.data.results;

    // Realizar un mapeo y procesamiento de cada Pokémon
    const pokemonPromises = Promise.all(
      allPokemonsAPI.map(async (pokemonAPI) => {
        const pokemonNameAPI = pokemonAPI.name.toLowerCase();

        // Buscar el Pokémon en la base de datos local
        const dbPokemon = await Pokemon.findOne({
          where: {
            name: {
              [Op.iLike]: pokemonNameAPI,
            },
          },
          include: Type,
        });

        if (dbPokemon) {
          // Si el Pokémon está en la base de datos, devolver sus detalles
          return {
            id: dbPokemon.id,
            name: dbPokemon.name,
            image: dbPokemon.image,
            health: dbPokemon.health,
            attack: dbPokemon.attack,
            defense: dbPokemon.defense,
            types: dbPokemon.Types.map((type) => ({
              id: type.id,
              name: type.name,
            })),
          };
        } else {
          // Si el Pokémon no está en la base de datos, obtener sus detalles desde la API externa
          const apiResponse = await axios(`${URL}/${pokemonAPI.name}`);
          const poke = apiResponse.data;

          // Obtener estadísticas adicionales del Pokémon
          const attack = poke.stats.find((obj) => obj.stat.name === 'attack');
          const defense = poke.stats.find((obj) => obj.stat.name === 'defense');
          const hp = poke.stats.find((obj) => obj.stat.name === 'hp');
          const health = hp.base_stat;
          const speed = poke.stats.find((obj) => obj.stat.name === 'speed').base_stat;
          const height = poke.height;
          const weight = poke.weight;

          // Obtener tipos del Pokémon y crearlos en la base de datos si no existen
          const types = [];
          for (const typeData of poke.types) {
            const typeResponse = await axios.get(typeData.type.url);
            const typeName = typeResponse.data.names.find((type) => type.language.name === 'en').name;

            // Buscar o crear el tipo en la base de datos (insensible a mayúsculas y minúsculas)
            const [typeInstance, created] = await Type.findOrCreate({
              where: {
                name: {
                  [Op.iLike]: typeName,
                },
              },
              defaults: { name: typeName },
            });

            types.push(typeInstance);
          }

          // Crear el nuevo Pokémon en la tabla de Pokemons con los detalles adicionales
          const newPokemon = await Pokemon.create({
            name: pokemonNameAPI,
            image: poke.sprites.front_default,
            health: health,
            attack: attack.base_stat,
            defense: defense.base_stat,
            speed: speed, // Agregar velocidad
            height: height, // Agregar altura
            weight: weight, // Agregar peso
          });

          // Asociar los tipos al Pokémon
          await newPokemon.setTypes(types);

          return {
            id: newPokemon.id,
            name: newPokemon.name,
            image: newPokemon.image,
            health: newPokemon.health,
            attack: newPokemon.attack,
            defense: newPokemon.defense,
            speed: newPokemon.speed, // Agregar velocidad
            height: newPokemon.height, // Agregar altura
            weight: newPokemon.weight, // Agregar peso
            types: types.map((type) => ({
              id: type.id,
              name: type.name,
            })),
          };
        }
      })
    );

    const pokemons = await pokemonPromises;

    // Combinar los Pokémon de la base de datos y la API y enviarlos como respuesta
    const dbPokemons = await Pokemon.findAll({
      include: Type,
    });

    dbPokemons.forEach((dbPokemon) => {
      const isDuplicate = pokemons.some((pokemon) => pokemon.id === dbPokemon.id);
      if (!isDuplicate) {
        // Agregar Pokémon de la base de datos que no estén en la lista
        pokemons.push({
          id: dbPokemon.id,
          name: dbPokemon.name,
          image: dbPokemon.image,
          health: dbPokemon.health,
          attack: dbPokemon.attack,
          defense: dbPokemon.defense,
          types: dbPokemon.Types.map((type) => ({
            id: type.id,
            name: type.name,
          })),
        });
      }
    });

    // Enviar la lista de Pokémon combinada como respuesta
    res.status(200).json(pokemons);
  } catch (error) {
    // Manejar errores y enviar una respuesta de error
    res.status(500).json({ message: "Hubo un error al obtener a los Pokémon", error: error.message });
  }
};

// Método para obtener un Pokémon por su ID
const getPokemonsById = async (req, res) => {
  const id = req.params.idPokemon;

  try {
    if (isValidUUID(id)) {
      // Si el ID es un UUID válido, busca en la base de datos
      const dbPokemon = await Pokemon.findOne({ where: { id }, include: Type });

      if (dbPokemon) {
        // Obtén los tipos de la base de datos
        const types = dbPokemon.Types.map((type) => ({
          id: type.id,
          name: type.name,
        }));

        // Devuelve el Pokémon con sus tipos y las propiedades adicionales
        res.status(200).json({
          id: dbPokemon.id,
          name: dbPokemon.name,
          health: dbPokemon.health,
          attack: dbPokemon.attack,
          defense: dbPokemon.defense,
          speed: dbPokemon.speed, // Agregar velocidad
          height: dbPokemon.height, // Agregar altura
          weight: dbPokemon.weight, // Agregar peso
          image: dbPokemon.image,
          types: types, // Asigna los tipos obtenidos de la base de datos
          // otros datos del Pokémon
        });
      } else {
        // Si no se encuentra en la base de datos, enviar un mensaje de error
        res.status(404).json({ message: "No se encontró el Pokémon en la base de datos" });
      }
    } else {
      // Si el ID no es válido, enviar un mensaje de error
      res.status(400).json({ message: "El formato del ID no es válido" });
    }
  } catch (error) {
    // Manejar errores y enviar una respuesta de error
    res.status(500).json({ message: "Hubo un error al obtener el Pokémon", error: error.message });
  }
};

// Función para verificar si un valor es un UUID válido
function isValidUUID(value) {
  return /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.test(value);
}

// Método para obtener un Pokémon por su nombre
const getPokemonsByName = async (req, res) => {
  const name = req.params.namePokemon; // Cambiar req.query a req.params

  // Convertir el nombre a minúsculas para comparación insensible a mayúsculas
  const lowercaseName = name.toLowerCase();
  try {
    // Buscar el Pokémon en la base de datos por nombre (insensible a mayúsculas y minúsculas)
    const dbPokemon = await Pokemon.findOne({
      where: {
        name: {
          [Op.iLike]: lowercaseName,
        },
      },
      include: Type,
    });

    if (dbPokemon) {
      // Si el Pokémon está en la base de datos, devuelve sus detalles
      res.status(200).json(dbPokemon);
    } else {
      // Si no se encuentra en la base de datos, enviar un mensaje de error
      res.status(404).json({ message: "No se encontró el Pokémon en la base de datos" });
    }
  } catch (error) {
    // Manejar errores y enviar una respuesta de error
    console.error('Error al buscar el pokémon:', error);
    res.status(500).send("Hubo un error al buscar el pokémon: " + error.message);
  }
};

// Método para crear un nuevo Pokémon
const createPokemon = async (req, res) => {
  try {
    const { name, image, health, attack, defense, typeIds, speed, height, weight } = req.body;

    // Verificar si typeIds es un arreglo válido de números enteros
    if (!Array.isArray(typeIds) || typeIds.some(id => typeof id !== 'number' || !Number.isInteger(id))) {
      return res.status(400).json({ message: 'Los typeIds deben ser un arreglo válido de números enteros.' });
    }

    // Verificar si los typeIds son válidos (existentes en la base de datos)
    const validTypeIds = await Type.findAll({ where: { id: typeIds } });

    // Verificar si todos los typeIds proporcionados son válidos
    if (validTypeIds.length !== typeIds.length) {
      return res.status(400).json({ message: 'Alguno de los typeIds proporcionados no es válido.' });
    }

    // Verificar si ya existe un Pokémon con el mismo nombre (insensible a mayúsculas/minúsculas)
    const existingPokemon = await Pokemon.findOne({
      where: {
        name: {
          [Op.iLike]: name // El operador iLike hace la comparación insensible a mayúsculas/minúsculas
        }
      }
    });

    if (existingPokemon) {
      // Si ya existe un Pokémon con el mismo nombre, enviar un mensaje de error
      return res.status(400).json({ message: 'Ya existe un Pokémon con el mismo nombre.' });
    }

    // Crear el nuevo Pokémon en la tabla de Pokemons
    const newPokemon = await Pokemon.create({
      name: name,
      image: image,
      health: health,
      attack: attack,
      defense: defense,
      speed: speed, // Agregar velocidad
      height: height, // Agregar altura
      weight: weight, // Agregar peso
    });

    // Asignar los tipos al Pokémon
    await newPokemon.setTypes(validTypeIds);

    // Enviar una respuesta indicando que el Pokémon se creó exitosamente
    res.status(201).json({ message: 'Pokémon creado exitosamente', pokemon: newPokemon });
  } catch (error) {
    // Manejar errores y enviar una respuesta de error
    res.status(500).json({ message: 'Error al crear el Pokémon', error: error.message });
  }
};

// Exportar los métodos como módulos para su uso en otros archivos
module.exports = {
  getAllPokemons,
  getPokemonsById,
  getPokemonsByName,
  createPokemon,
};
