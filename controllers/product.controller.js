const { request, response } = require("express");
const { Category, Product } = require("../models");



/**
 * Obtener productos paginado
 * @param {*} req 
 * @param {*} res 
 */
const obtenerProducts = async (req = request, res = response) =>{

    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query), 
        Product.find(query)
        .populate('user','nombre') 
        .populate('category','nombre') 
        .skip( Number( desde ) )
        .limit( Number( limite ) )
      ])
  
      res.json({
        total,
        products
      });
}



/**
 * Obtener producto por su id y su relacion con usuario y categoria
*/
const obtenerProduct = async (req = request, res = response) =>{

    const { id } = req.params;
   
    const product = await Product.findById(id)
                            .populate('user', 'nombre')
                            .populate('category', 'nombre');
        
    res.json( product );
}


/**
 * Crear producto
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const crearProduct = async(req = request, res = response) => {

    const {estado, user, ...body} = req.body;

    const nombre = req.body.nombre.toUpperCase();

    try {

        const productDB = await Product.findOne({nombre});

        if ( productDB ) {
            return res.status(400).json({
                message: `El producto ${ productDB.nombre }, ya existe`
            });
        }

        //generar data a guardar
        const data = {
            ...body,
            nombre: body.nombre?.toUpperCase(),
            user: req.authUser._id //obtenido del JWT
        }

        const product = new Product(data);
        //guardar en db
        await product.save();

        res.status(201).json(product);
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Error al crear el producto'
        })
    }

}


/**
 * Actualizar Producto por su id 
 * @param {*} req 
 * @param {*} res 
 */
const actualizarProduct = async (req = request, res = response) =>{

    const { id } = req.params;

    const { estado, user, ...data } = req.body;

    if (data.nombre === ''){
        delete data.nombre;
    }

    if (data.nombre){
        data.nombre = data.nombre.toUpperCase(); //poner el nombre en mayusculas
    }
    

    data.user = req.authUser._id; //usuario que realizo la actualizacion

    //{new: true} opcion para enviar el nuevo documento creado en la respuesta
    const product = await Product.findByIdAndUpdate( id, data, {new: true});
  
      res.json( product );
}



/**
 * Deshabilitar producto
 * @param {*} req 
 * @param {*} res 
 */
const borrarProduct = async (req = request, res = response) =>{

    const { id } = req.params;
 
    const productDeleted = await Product.findByIdAndUpdate(id, {estado:false}, {new: true})
  
    res.json( productDeleted );
}





module.exports = {
    crearProduct,
    obtenerProducts,
    obtenerProduct,
    actualizarProduct,
    borrarProduct
}