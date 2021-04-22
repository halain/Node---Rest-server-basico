const { Category, User, Role, Product } = require('../models');


/**
 * Valida que el rol enviado exista en la bbdd en la coleccion Role
 * @param {*} rol 
 */
const esRolValido = async (rol = '') =>{
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`)
    }
};

/**
 * Verifica email unico
 * @param {*} correo 
 */
const emailExiste = async ( correo = '' ) => {
    const existEmail = await User.findOne({correo});
    if (existEmail) {
        throw new Error(`El correo ${correo} ya se encuentra registrado`)
    }
}

/**
 * Verificar que el id enviado como parametro exista
 * @param {*} id 
 */
const existeUsuarioPorID = async ( id ) => {
    const existUsuarioID = await User.findById(id);
    if (!existUsuarioID) {
        throw new Error(`El ID ${id} no existe`);
    }
}


/**
 * Verifica que exista la categoria para el id 
 * @param {*} id 
 */
const existCategoryById = async ( id ) => {
    const existCategoryID = await Category.findById(id);
    if (!existCategoryID) {
        throw new Error(`No existe la categoría con el ID ${id}`);
    }
}


/**
 * Verifica que exista el producto para el id 
 * @param {*} id 
 */
 const existProductById = async ( id ) => {
    const existProductID = await Product.findById(id);
    if (!existProductID) {
        throw new Error(`No existe el producto con el ID ${id}`);
    }
}


module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorID,
    existCategoryById,
    existProductById
}