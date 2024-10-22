/*
    path: api/mensajes    
*/
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { obtenerChat } = require('../controllers/mensajes')



const router = Router();

//Validar Token Renew validarJWT
router.get('/:de', validarJWT, obtenerChat);

module.exports = router;
