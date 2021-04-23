const dbValidators          = require('./db-validators');
const genererJWT            = require('./generarJWT');
const googleVerify          = require('./google-verifyToken');
const subirArchivo          = require('./subir-archivo');




module.exports = {
    ...dbValidators,
    ...genererJWT,
    ...googleVerify,
    ...subirArchivo,
}