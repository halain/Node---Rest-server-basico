const { request, response } = require("express");
const bcryptjs = require('bcryptjs');

const User = require("../models/user");

const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verifyToken");


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


/**
 * Autenticacion con google
 */
const googleSignin = async (req = request, res = response) => {

    const { id_token } = req.body;
    try {
        //verificacion del usuario de google
        const googleUser = await googleVerify(id_token);
        const {correo, nombre, img} = googleUser;
        // console.log(googleUser);

        let user = await User.findOne({correo});

        //sino existe el usuario en la bbdd
        if ( !user) {
            //crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            }
            user = new User(data);
            await user.save();
        }

        //si el usuario de google tiene el estado en falso, denegar el login
        if ( !user.estado ) {
            return res.status(401).json({
                message: 'Usuario bloqueado, contacte al administrador'
            });          
        }

        //generar el jwt
        const token = await generarJWT(user.id);

        
        res.json({
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Google Token error',
        });
    }

    

}





module.exports = {
    login,
    googleSignin
}
