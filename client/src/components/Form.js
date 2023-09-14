
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../Styles/formstles.css';
function CreatePokemonForm() {
  // Estado para almacenar los tipos de Pokémon
  const [types, setTypes] = useState([]);

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    health: '',
    attack: '',
    defense: '',
    speed: '',
    height: '',
    weight: '',
    typeIds: [],
  });

  // Estado para almacenar errores de validación del formulario
  const [errors, setErrors] = useState({});

  // Efecto para cargar los tipos de Pokémon desde la API al cargar el componente
  useEffect(() => {
    async function loadTypes() {
      try {
        const response = await fetch('http://localhost:3001/type');
        const typesData = await response.json();
        setTypes(typesData);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    loadTypes();
  }, []);

  // Manejar cambios en los campos de entrada del formulario
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar cambios en la selección de tipos de Pokémon
  const handleTypeChange = (selectedOptions) => {
    const selectedTypeIds = selectedOptions.map((option) => option.value);
    setFormData({
      ...formData,
      typeIds: selectedTypeIds,
    });
  };

  // Validar el formulario antes de enviar
  const validateForm = () => {
    const newErrors = {};

    if (formData.name.trim() === '') {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.image.trim() === '') {
      newErrors.image = 'La URL de la imagen es requerida';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'La URL de la imagen no es válida';
    }

    if (formData.health < 1) {
      newErrors.health = 'La salud debe ser mayor o igual a 1';
    }

    if (formData.attack < 1) {
      newErrors.attack = 'El ataque debe ser mayor o igual a 1';
    }

    if (formData.defense < 1) {
      newErrors.defense = 'La defensa debe ser mayor o igual a 1';
    }

    if (formData.speed < 1) {
      newErrors.speed = 'La velocidad debe ser mayor o igual a 1';
    }

    if (formData.height < 1) {
      newErrors.height = 'La altura debe ser mayor o igual a 1';
    }

    if (formData.weight < 1) {
      newErrors.weight = 'El peso debe ser mayor o igual a 1';
    }

    if (formData.typeIds.length === 0) {
      newErrors.typeIds = 'Debe seleccionar al menos un tipo';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Función para validar una URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/pokemons', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        alert('Pokémon creado exitosamente');
        setFormData({
          name: '',
          image: '',
          health: '',
          attack: '',
          defense: '',
          speed: '',
          height: '',
          weight: '',
          typeIds: [],
        });
      } else {
        const data = await response.json();
        alert(`Error al crear el Pokémon: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Crear opciones de tipo para el componente Select
  const typeOptions = types.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  // Renderizar el formulario
  return (
    <div className="form-container">
      <h1>Crear un nuevo Pokémon</h1>
      <form onSubmit={handleSubmit}>
        {/* Campos de entrada del formulario con etiquetas y manejo de errores */}
        <label htmlFor="name">Nombre:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          pattern="[A-Za-z\s]+"
          title="Solo se permiten letras y espacios"
        />
        <br />

        <label htmlFor="speed">Velocidad:</label>
        <input
          type="number"
          id="speed"
          name="speed"
          value={formData.speed}
          onChange={handleInputChange}
          required
          min="1" // Cambiado de 0 a 1
        />
        {errors.speed && <div className="error">{errors.speed}</div>}
        <br />

        <label htmlFor="height">Altura:</label>
        <input
          type="number"
          id="height"
          name="height"
          value={formData.height}
          onChange={handleInputChange}
          required
          min="1" // Cambiado de 0 a 1
        />
        {errors.height && <div className="error">{errors.height}</div>}
        <br />

        <label htmlFor="weight">Peso:</label>
        <input
          type="number"
          id="weight"
          name="weight"
          value={formData.weight}
          onChange={handleInputChange}
          required
          min="1" // Cambiado de 0 a 1
        />
        {errors.weight && <div className="error">{errors.weight}</div>}
        <br />

        <label htmlFor="image">URL de la imagen:</label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          required
        />
        {errors.image && <div className="error">{errors.image}</div>}
        <br />

        <label htmlFor="health">Salud:</label>
        <input
          type="number"
          id="health"
          name="health"
          value={formData.health}
          onChange={handleInputChange}
          required
          min="1" // Cambiado de 0 a 1
        />
        {errors.health && <div className="error">{errors.health}</div>}
        <br />

        <label htmlFor="attack">Ataque:</label>
        <input
          type="number"
          id="attack"
          name="attack"
          value={formData.attack}
          onChange={handleInputChange}
          required
          min="1" // Cambiado de 0 a 1
        />
        {errors.attack && <div className="error">{errors.attack}</div>}
        <br />

        <label htmlFor="defense">Defensa:</label>
        <input
          type="number"
          id="defense"
          name="defense"
          value={formData.defense}
          onChange={handleInputChange}
          required
          min="1" // Cambiado de 0 a 1
        />
        {errors.defense && <div className="error">{errors.defense}</div>}
        <br />

        <label htmlFor="types">Tipo(s):</label>
        {/* Componente Select para seleccionar tipos de Pokémon */}
        <Select
          id="types"
          name="typeIds"
          isMulti
          options={typeOptions}
          value={typeOptions.filter((option) =>
            formData.typeIds.includes(option.value)
          )}
          onChange={handleTypeChange}
        />
        {errors.typeIds && <div className="error">{errors.typeIds}</div>}
        <br />

        <button type="submit">Crear Pokémon</button>
      </form>
    </div>
  );
}

export default CreatePokemonForm;
