
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { getAllPokemons } = require('./src/handlers/pokemonsHandlers.js');
const {getTypes} = require("./src/handlers/Typeshandler.js")



// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  server.listen(3001, async () => {
    console.log('%s listening at 3001, estoy escuchando en el puerto 3001');
    
  });
});
