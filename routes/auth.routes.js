const { Router } = require('express');
const { check } = require('express-validator');

const { emailExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const {  login } = require('../controllers/auth.controller');



const router = Router();


router.post('/login', [ 
    check('correo', 'El correo es obligatorio').isEmail(),  
    check('password', 'El password es obligatorio').notEmpty(), 
    validarCampos 
], login );




module.exports = router;