import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // Importa Select de react-select
import '../Styles/formstles.css';

function CreatePokemonForm() {
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    health: '',
    attack: '',
    defense: '',
    typeIds: [],
  });

  useEffect(() => {
    // Cargar tipos desde la base de datos
    async function loadTypes() {
      try {
        const response = await fetch('http://localhost:3001/type'); // Reemplaza '/api/types' con la ruta correcta
        const typesData = await response.json();
        setTypes(typesData);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    loadTypes();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTypeChange = (selectedOptions) => {
    const selectedTypeIds = selectedOptions.map((option) => option.value); // Obtiene los IDs de los tipos seleccionados
    setFormData({
      ...formData,
      typeIds: selectedTypeIds,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validaciones
    if (
      formData.name.trim() === '' ||
      formData.image.trim() === '' ||
      formData.health < 0 ||
      formData.attack < 0 ||
      formData.defense < 0 ||
      formData.typeIds.length === 0
    ) {
      alert('Por favor, completa los campos correctamente.');
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

  // Mapea los tipos para convertirlos en el formato requerido por react-select
  const typeOptions = types.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  return (
    <div className="form-container">
      <h1>Crear un nuevo Pokémon</h1>
      <form onSubmit={handleSubmit}>
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
        /><br />

        <label htmlFor="image">URL de la imagen:</label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          required
        /><br />

        <label htmlFor="health">Salud:</label>
        <input
          type="number"
          id="health"
          name="health"
          value={formData.health}
          onChange={handleInputChange}
          required
          min="0"
        /><br />

        <label htmlFor="attack">Ataque:</label>
        <input
          type="number"
          id="attack"
          name="attack"
          value={formData.attack}
          onChange={handleInputChange}
          required
          min="0"
        /><br />

        <label htmlFor="defense">Defensa:</label>
        <input
          type="number"
          id="defense"
          name="defense"
          value={formData.defense}
          onChange={handleInputChange}
          required
          min="0"
        /><br />

        <label htmlFor="types">Tipo(s):</label>
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
        <br />

        <button type="submit">Crear Pokémon</button>
      </form>
    </div>
  );
}

export default CreatePokemonForm;
