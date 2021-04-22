const { request, response } = require("express");
const { Category } = require("../models");



/**
 * Obtener categorias paginado
 * @param {*} req 
 * @param {*} res 
 */
const obtenerCategorias = async (req = request, res = response) =>{

    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(query), 
        Category.find(query)
        .populate('user','nombre') 
        .skip( Number( desde ) )
        .limit( Number( limite ) )
      ])
  
      res.json({
        total,
        categories
      });
}



/**
 * Obtener Categoria por su id y su relacion con usuario
*/
const obtenerCategoria = async (req = request, res = response) =>{

    const { id } = req.params;

    const category = await Category.findById(id).populate('user', 'nombre');
  
      res.json( category );
}


/**
 * Crear categoria
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const crearCategoria = async(req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    try {

        const categoriaDB = await Category.findOne({nombre});

        if ( categoriaDB ) {
            return res.status(400).json({
                message: `La categoria ${ categoriaDB.nombre }, ya existe`
            });
        }

        //generar data a guardar
        const data = {
            nombre,
            user: req.authUser._id //obtenido del JWT
        }

        const category = new Category(data);
        //guardar en db
        await category.save();

        res.status(201).json(category);
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Error al crear la categoria'
        })
    }

}


/**
 * Actualizar Categoria por su id 
 * @param {*} req 
 * @param {*} res 
 */
const actualizarCategoria = async (req = request, res = response) =>{

    const { id } = req.params;

    const { estado, user, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase(); //poner el nombre en mayusculas
    data.user = req.authUser._id; //usuario que realizo la actualizacion

    //{new: true} opcion para enviar el nuevo documento creado en la respuesta
    const category = await Category.findByIdAndUpdate( id, data, {new: true});
  
      res.json( category );
}



/**
 * Deshabilitar categoria
 * @param {*} req 
 * @param {*} res 
 */
const borrarCategoria = async (req = request, res = response) =>{

    const { id } = req.params;
 
    const categoryDeleted = await Category.findByIdAndUpdate(id, {estado:false}, {new: true})
  
    res.json( categoryDeleted );
}





module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}