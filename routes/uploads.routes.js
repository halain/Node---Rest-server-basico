const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, validarArchivoSubir } = require('../middlewares');
const { coleccionesPermitidas } = require('../helpers');


const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controller');



const router = Router();

//subir archivos
router.post('/', [ 
    validarJWT,
    validarArchivoSubir,
    validarCampos 
], cargarArchivo );


//subir archivo pereneciente a una coleccion users o products 
router.put('/:collection/:id',[
    validarArchivoSubir,
    check('id', 'El id no es valido').isMongoId(),
    check('collection').custom( c => coleccionesPermitidas(c, ['users','products'])),
    validarCampos 
], actualizarImagenCloudinary); //version en la nuve con CLoudinary
//], actualizarImagen);//version server local


router.get('/:collection/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('collection').custom( c => coleccionesPermitidas(c, ['users','products'])),
    validarCampos 
], mostrarImagen)






module.exports = router;