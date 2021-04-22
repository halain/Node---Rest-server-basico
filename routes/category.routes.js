const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, 
    obtenerCategorias, 
    obtenerCategoria, 
    actualizarCategoria, 
    borrarCategoria } = require('../controllers/category.controller');
const { existCategoryById } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');




const router = Router();

/**
 * Obtener todas las categorias
 */
router.get('/', obtenerCategorias);


/**
 * Obtener una categoria por id -publico
 */
router.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existCategoryById ),
    validarCampos
], obtenerCategoria);


/**
 * Crear categoria - privado - cualquier persona con un token valido
 */
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos 
],  crearCategoria);


/**
 * Actualizar registro por id - privado -cualquiera con token valido
 */
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos, 
    check('id').custom( existCategoryById ),
    validarCampos,
], actualizarCategoria);


/**
 * Borrar categoria (deshabilitar) - Admin Role
 */
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom( existCategoryById ),
    validarCampos,
], borrarCategoria);




module.exports = router;