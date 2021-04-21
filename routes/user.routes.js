const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos,
        validarJWT,
        esAdminRole,
        tieneRole        
} = require('../middlewares');

const { esRolValido, emailExiste, existeUsuarioPorID } = require('../helpers/db-validators');

const { usersGet, usersPut,usersPost, usersDelete } = require('../controllers/user.controller');



const router = Router();

router.get('/', usersGet);

router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(), //validar que el id enviado como parametro sea un id valido de mongodb
    check('id').custom( existeUsuarioPorID ),
    check('rol').custom( esRolValido ), 
    validarCampos
], usersPut );

router.post('/', [ //middleware validaciones con express-validator
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), //requerido
    check('password', 'El password debe tener mas de 6 letras').isLength({min:6}), //longitud 6 caracteres
    check('correo', 'El correo no tiene un formato valido').isEmail(), //tiene que ser correo
    check('correo').custom( emailExiste ), //validacion personalizada donde se verifica que el email sea unico
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']), //tiene que estar dentro del valor indicado
    check('rol').custom( esRolValido ), //validacion personalizada donde se verifica que el roll exista en un documnto de la bbdd
    validarCampos //ultimo middleware que va a verificar los errores de los checks, en caso de que existan errores no continua al controlados, sino si sigue al controlador
], usersPost );

router.delete('/:id',[
    validarJWT,
    esAdminRole, //verifica si el user es admin
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'), //el usuario logueado debe tener al menos uno de los roles
    check('id', 'No es un ID valido').isMongoId(), 
    check('id').custom( existeUsuarioPorID ),
    validarCampos
], usersDelete);



module.exports = router;