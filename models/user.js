/**
 * Info en bbdd
*
*   Objeto(documento) en bbdd 
* {
 *      nombre: 'ascaca',
 *      correo: 'asvd@svdsdv.ssvds',
 *      password: '$asckldn&sdsvd@#2',
 *      img: '1214234234250',
 *      rol: '1212343242352',
 *      estado: false,
 *      google: false,
 * }
 * 
 *  Colecciones (tablas en sql) estan compuestas por los documentos
 * 
 */

const { Schema, model} = require('mongoose');



const UserSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img:{
        type: String
    },
    rol:{
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado:{
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

//sobrescribir el metodo toJSON del schema para modificar los campos que se devuelven en el response
UserSchema.methods.toJSON = function() {
    //se omiten __v y  password. El resto de los campos son agrupados en user y es lo que se retorna
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema);