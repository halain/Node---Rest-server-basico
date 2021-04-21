const { request, response } = require("express");
const bcrypt = require('bcryptjs');


const User  = require('../models/user');


/**
 * Obtener los usuarios de la base de datos -Paginados
 * @param {*} req 
 * @param {*} res 
 */
const usersGet = async(req = request, res = response) => {
    //query params api/usuarios?q=hello&nombre=paco&apikey=125478
    // const {q, nombre, apikey} = req.query;

    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true };

    // const users = await User.find(query)
    //   .skip( Number( desde ) )
    //   .limit( Number( limite ) );
    // const total = await User.countDocuments(query);
    // res.json({
    //   total,
    //   users
    // });

    //esta forma es mas eficiente xk se ejecutan las promesas simultaneamente
    const [total, users] = await Promise.all([
      User.countDocuments(query), //primera promesa = total
      User.find(query) //segunda promesa = users
      .skip( Number( desde ) )
      .limit( Number( limite ) )
    ])

    res.json({
      total,
      users
    });
};




/**
 * Actualizar usuario en bbdd
 * @param {*} req 
 * @param {*} res 
 */
const usersPut = async(req = request, res = response) => {

    //parametro de segmento URL users/10685548995
    const {id} = req.params;
    //_id siempre extraer del body, para evitar conflictos por si es enviado.
    // password, google, correo, tambien son extraidos del body 
    const { _id, password, google, correo, ...resto} = req.body;
    
    //validar contra BD
    if (password){ //si es enviado el password es porque se quiere actualizar
         //encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate( id, resto);

    res.json( user );
};




/**
 * Crear registro nuevo de usuario en la bbdd
 * @param {*} req 
 * @param {*} res 
 */
const usersPost = async (req = request, res = response) => {  
  
    //en este punto ya fueron validados los campos en los middlewares del router
    
    //obtener los campos enviados desde el front
    const {nombre, correo, password, rol} = req.body;
   
    //instancia del modelo para crear el document
    const user = new User({nombre, correo, password, rol});
    
    //encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(password, salt);

    //persitir el modelo en le bbdd (se crea un nuevo document en la coleccion users)
    await user.save();

    res.json( user );

};



/**
 * Eliminar usuario de bbdd, se cambia su estado a false
 * @param {*} req 
 * @param {*} res 
 */
const usersDelete = async(req = request, res = response) => {
  const { id } = req.params;

  //borrado fisico de la bbdd
  // const user = await User.findByIdAndDelete( id );

  //no elimina fisicamente, solo cambia el estado del usuario 
  const user = await User.findByIdAndUpdate(id, {estado:false})

  res.json({
    user
  });
};




module.exports = {
  usersGet,
  usersPut,
  usersPost,
  usersDelete
};
