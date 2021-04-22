const { Router } = require('express');
const { check } = require('express-validator');
const { crearProduct, 
    obtenerProducts, 
    obtenerProduct, 
    actualizarProduct, 
    borrarProduct } = require('../controllers/product.controller');
const { existCategoryById, existProductById } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');




const router = Router();

/**
 * Obtener todas los productos
 */
router.get('/', obtenerProducts);


/**
 * Obtener un producto por id -publico
 */
router.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom( existProductById ),
    validarCampos,
], obtenerProduct);


/**
 * Crear producto - privado - cualquier persona con un token valido
 */
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('category', 'No es un ID valido').isMongoId(),
    validarCampos, 
    check('category').custom( existCategoryById ),
    validarCampos 
],  crearProduct);


/**
 * Actualizar registro por id - privado -cualquiera con token valido
 */
router.put('/:id', [
    validarJWT,
    check('category', `No es un ID valido`).isMongoId(),
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos, 
    check('id').custom( existProductById ),
    check('category').custom( existCategoryById ),
    validarCampos,
], actualizarProduct);


/**
 * Borrar producto (deshabilitar) - Admin Role
 */
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom( existProductById ),
    validarCampos,
], borrarProduct);




module.exports = router;