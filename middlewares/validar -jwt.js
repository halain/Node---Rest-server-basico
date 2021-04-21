const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



const validarJWT = async (req = request, res = response, next) => {

    //el token tiene que ser enviado desde el from con el nombre 'x-token'
    const token = req.header('x-token');
    // console.log(token);
    if ( !token ) {
        return res.status(401).json({
            message: 'Falta el token'
        })
    }

    try {
        //validar el token
        // const payload = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        // console.log(payload);
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                message: 'Token no válido - usuario no existe'
            });            
        }
        //verificar que el token enviado no sea de un usuario borrado
        // console.log(user);
        if (!user.estado){
            return res.status(401).json({
                message: 'Token no válido - usuario deshabilidato'
            });
        }
        
        req.authUser = user;  //agregar al request el user autenticado que viene en el payload del Token
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Token no válido'
        })
    }

}



module.exports = {
    validarJWT
}