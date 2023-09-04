const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const {getTypes} = require('../handlers/Typeshandler')

const typeRouter = Router();


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

typeRouter.get("/", getTypes);

module.exports = typeRouter;