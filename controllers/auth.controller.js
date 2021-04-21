const { request, response } = require("express");
const bcryptjs = require('bcryptjs');


const { generarJWT } = require("../helpers/generarJWT");
const User = require("../models/user");


/**
 * Autenticar usuario (correo y password), generar JWT
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const login = async (req = request, res = response) => {  
  
    const {correo, password} = req.body;

    try {
        //verificar que el correo exista y que este activo el usuario 
        const user = await User.findOne({correo}).where({estado: true});
        if ( !user ) {
            return res.status(400).json({
                message: 'Credenciales incorrectas --correo'
            });
        }

        //verificar contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if ( !validPassword ) {
            return res.status(400).json({
                message: 'Credenciales incorrectas --password'
            });
        }

        //generar JWT
        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Algo salio mal'
        });
    }

};





module.exports = {
    login
}
