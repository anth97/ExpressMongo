const { Router } = require('express');
const { login, refresh_token } = require('../../controllers/auth/auth.controller');
const { validarJWT } = require('../../middlewares/validar-jwt');

const router = Router();

router.post('/', login);

router.get('/refresh_token', validarJWT, refresh_token);

module.exports = router;