const axios = require('axios');
const express = require('express');
const URL ='https://pokeapi.co/api/v2/pokemon'
const {Pokemon , Type } = require("../db");
const { UUID } = require('sequelize');

const { Op } = require('sequelize');

const getAllPokemons = async (req, res) => {
  try {
    const response = await axios(`${URL}?limit=50`);
    const allPokemonsAPI = response.data.results;

    // Obtener todos los tipos de la base de datos
    const allTypes = await Type.findAll();

    const pokemonPromises = Promise.all(
      allPokemonsAPI.map(async (pokemonAPI) => {
        const pokemonNameAPI = pokemonAPI.name.toLowerCase();

        // Buscar el Pokémon en la base de datos por nombre (insensible a mayúsculas y minúsculas)
        const dbPokemon = await Pokemon.findOne({
          where: {
            name: {
              [Op.iLike]: pokemonNameAPI,
            },
          },
          include: Type,
        });

        if (dbPokemon) {
          // Si el Pokémon está en la base de datos, devuélvelo con sus tipos
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
          // Si no está en la base de datos, obtén los datos de la API y crea el nuevo Pokémon
          const apiResponse = await axios(`${URL}/${pokemonAPI.name}`);
          const poke = apiResponse.data;

          const attack = poke.stats.find((obj) => obj.stat.name === 'attack');
          const defense = poke.stats.find((obj) => obj.stat.name === 'defense');
          const hp = poke.stats.find((obj) => obj.stat.name === 'hp');

          // Get types for the Pokémon
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

          // Crear el nuevo Pokémon en la tabla de Pokemons
          const newPokemon = await Pokemon.create({
            name: pokemonNameAPI,
            image: poke.sprites.front_default,
            health: hp.base_stat,
            attack: attack.base_stat,
            defense: defense.base_stat,
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
            types: types.map((type) => ({
              id: type.id,
              name: type.name,
            })),
          };
        }
      })
    );

    const pokemons = await pokemonPromises;

    // Buscar los Pokémon en la base de datos y combinarlos con los obtenidos de la API
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

    res.status(200).json(pokemons);
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener a los Pokémon", error: error.message });
  }
};


const getPokemonsById = async(req,res)=>
{
    const idPokemon = req.params.idPokemon;
    try {
        // Buscar el Pokémon en la base de datos
       
        if (!UUID(idPokemon)) {
            // Si encontramos el Pokémon en la base de datos, lo devolvemos
            const pokemonTypes = await dbPokemon.getTypes();

            const dbPokemon = await Pokemon.findOne({ where: { id: idPokemon } });

            res.status(200).json(dbPokemon);
        } else {
            // Si no encontramos el Pokémon en la base de datos, buscamos en la PokeAPI
            const pokeApiResponse = await axios.get(`${URL}/${idPokemon}`);
            const poke = pokeApiResponse.data;
            const typeResponse = await axios.get(poke.types[0].type.url);
      const spanisTypeName = typeResponse.data.names.find((types) => types.language.name === 'es').name;

            const attack = poke.stats.find(obj => obj.stat.name === 'attack');
            const defense = poke.stats.find(obj => obj.stat.name === 'defense');
            const hp = poke.stats.find(obj => obj.stat.name === 'hp');

            const newPokemon = await Pokemon.create({
                name: poke.name,
                image: poke.sprites.front_default,
                health: hp.base_stat,
                attack: attack.base_stat,
                defense: defense.base_stat,
                types: spanisTypeName
            });

            res.status(200).json(newPokemon);
        }
    } catch (error) {
        res.status(500).json({ message: "Hubo un error al obtener al Pokémon", error: error.message });
    }
}


const getPokemonsByName = async (req, res) => {
  const name = req.query.name;

  // Convertir el nombre a minúsculas para comparación insensible a mayúsculas
  const lowercaseName = name.toLowerCase();

  try {
    // Buscar el pokémon en la API
    const apiResponse = await axios.get(`${URL}/${lowercaseName}`);
    const apiPokemon = apiResponse.data;

    // Mapear la información que necesitas del pokémon
    const pokemonInfo = {
      id: apiPokemon.id,
      name: apiPokemon.name,
      image: apiPokemon.sprites.front_default,
      types: apiPokemon.types.map((typeData) => typeData.type.name),
    };

    // Devolver la información del pokémon
    console.log('Búsqueda exitosa:', pokemonInfo);
    res.status(200).json(pokemonInfo);
  } catch (error) {
    // Manejar el error
    console.error('Error al buscar el pokémon:', error);
    res.status(500).send("Hubo un error al buscar el pokémon: " + error.message);
  }
};



 const createPokemon = async (req, res) => {
  try {
    const { name, image, health, attack, defense, typeIds } = req.body;

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

    // Crear el nuevo Pokémon en la tabla de Pokemons
    const newPokemon = await Pokemon.create({
      name: name,
      image: image,
      health: health,
      attack: attack,
      defense: defense,
    });

    // Asignar los tipos al Pokémon
    await newPokemon.setTypes(validTypeIds);

    res.status(201).json({ message: 'Pokémon creado exitosamente', pokemon: newPokemon });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el Pokémon', error: error.message });
  }
};

 

module.exports = {
    getAllPokemons,
    getPokemonsById,
    getPokemonsByName,
    createPokemon
}