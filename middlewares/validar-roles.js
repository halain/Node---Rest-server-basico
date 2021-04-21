const { response } = require("express");


/**
 * Middleware para verificar si el usuario logueado tiene el rol de ADMIN
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const esAdminRole = (req, res = response, next) =>{

    if (!req.authUser) {
        return res.status(500).json({
            message: 'Se quiere validar el rol antes de validar el token'
        });
    }

    //usuario autenticado, que se agrego al req al verificar el token
    const {rol, nombre} = req.authUser;
    // console.log(authUser);

    if (rol !== 'ADMIN_ROLE') {
      return res.status(401).json({
        message: `${nombre} no tiene permiso de administrador`
      });
    }
    next();
}


/**
 * Middleware para verificar que el usuario logueado tenga alguno de los roles enviados como parametro.
 * La definicion de este middleware es diferente al anteriro, ya que se le envian parametros
 * @param  {...any} roles 
 * @returns 
 */
const tieneRole = (...roles) =>{
    // console.log(roles);
    return (req, res = response, next) =>{
        
        if (!req.authUser) {
            return res.status(500).json({
                message: 'Se quiere validar el rol antes de validar el token'
            });
        }
        
        const existRole = roles.includes(req.authUser.rol); //el user debe tener uno d elos roles enviados
        if (!existRole) {
            return res.status(401).json({
                message: `El servicio requiere uno de los roles:  ${roles}`
              });
        }

        next();
    }
}


module.exports = {
    esAdminRole,
    tieneRole
}