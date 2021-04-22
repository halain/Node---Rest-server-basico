const { request, response } = require("express");
const mongoose = require('mongoose');

const { User, Category, Product } = require('../models');




//  const collectionsMongoDB = Object.keys(mongoose.connection.collections); 
//  "collectionsMongoDB": [
//     "users",
//     "categories",
//     "roles",
//     "products"
// ];

const collectionsAllowed = [
     'users',
     'categories',
     'products',
     'roles'
];


const buscarUsuarios = async ( termino = '', res = response) => {
    const isMongoID = mongoose.isValidObjectId(termino);
    // buscar por id
    if (isMongoID) {
        const usuario = await User.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }
    //busqueda de usuario por termino en el nombre o correo, y que esten activos
    const regex = new RegExp(termino, 'i'); //expresion para hacer case insensitive el termino
    const usuarios = await User.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    });
    //find devuelve un array de resultados y si no encuentra un [] vacio
    res.json({
        results: usuarios
    });
}


const buscarCategorias = async ( termino = '', res = response) => {
    const isMongoID = mongoose.isValidObjectId(termino);
    // buscar por id
    if (isMongoID) {
        const categoria = await Category.findById(termino).where({estado:true});
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }
    //busqueda de categoria por termino en los campos nombre, y que esten activos
    const regex = new RegExp(termino, 'i'); //expresion para hacer case insensitive el termino
    const categorias = await Category.find({nombre: regex, estado: true });
    
    res.json({
        results: categorias
    });
}




const buscarProductos = async ( termino = '', res = response) => {
    const isMongoID = mongoose.isValidObjectId(termino);
    // buscar por id
    if (isMongoID) {
        const producto = await (await Product.findById(termino))
                        .populate('category', 'nombre');
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }
    //busqueda de producto por termino en el nombre o correo, y que esten activos
    const regex = new RegExp(termino, 'i'); //expresion para hacer case insensitive el termino
    const productos = await Product.find({
        $or: [{nombre: regex}, {descripcion: regex}],
        $and: [{estado: true}]
    })
    .populate('category', 'nombre');
    //find devuelve un array de resultados y si no encuentra un [] vacio
    res.json({
        results: productos
    });
}




const buscar = (req = request, res= response) => {

    const {collection, term} = req.params;

    if ( !collectionsAllowed.includes(collection) ) {
        return res.status(400).json({
            message: `Coleccion ${collection} no permitida, se permiten ${collectionsAllowed}`
        });
    }


    switch (collection) {

        case 'users':
            buscarUsuarios(term,res);
        break;

        case 'categories':
            buscarCategorias(term, res);
        break;

        case 'products':
            buscarProductos(term, res);
        break;
        
        default:
            res.status(500).json({
                message: `Implementar busqueda de ${collection}` 
            })
        break;
    
        
    }


    // res.json({
    //     collection,
    //     term
    // })
}



module.exports = {
    buscar
}