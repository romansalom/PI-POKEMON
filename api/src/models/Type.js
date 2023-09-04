const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Type', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false, // Esto garantiza que el ID no pueda ser nulo
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
   
  },{timestamps: false});
};
