
const { request, response } = require("express");
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);


const { subirArhivo } = require("../helpers");

const { User, Product} = require('../models');



const cargarArchivo = async (req = request, res = response) => { 

    try {

        //const nombre = await  subirArhivo(req.files, undefined, 'images'); //imagenes por defecto y en carpeta uploads/images
        //const nombre = await  subirArhivo(req.files, ['txt'], 'textos'); //extencion .txt en carpeta ../uploads/textos
        const nombre = await  subirArhivo(req.files); //imagenes por defecto en la carpeta por defecto ../uploads
        
        res.json({
            nombre
        });
    } catch (msg) {
        res.status(400).json({msg})
    }
}


/**
 * Actualizar la imagen de una coleccion 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const actualizarImagen = async (req = request, res = response) => {

    const { id, collection } = req.params;
    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe usuario con el id ${id}`
                });
            }    
        break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe producto con el id ${id}`
                });
            }    
        break;
    
        default:
           return  res.status(500).json({
               msg: 'No Implementado, validar coleccion'
            });
    }

    //limpieza previa de imagenes ya existente
    if (model.img){ //el modelo tienen una imagen
        //path a la imagen en el server
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImg)) { //existe en el server
            fs.unlinkSync(pathImg); //eliminarla
        }
    }

    //subo el archivo, en una carpeta con el nombre d ela coleccion
    const nombre = await  subirArhivo(req.files, undefined, collection);
    model.img =  nombre;
    await model.save();
    res.json(model);

}

/**
 * Actualizar la imagen de una coleccion en Cloudinary
 */

const actualizarImagenCloudinary = async (req = request, res = response) => {

    const { id, collection } = req.params;
    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe usuario con el id ${id}`
                });
            }    
        break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe producto con el id ${id}`
                });
            }    
        break;
    
        default:
           return  res.status(500).json({
               msg: 'No Implementado, validar coleccion'
            });
    }

    //limpieza previa de imagenes ya existente en Cloudinary
    if (model.img){ //el modelo tienen una imagen
        //obtener el id de la imagen en cloudinary a partir del url
        const nombreArr = model.img.split('/');
        const nombre = nombreArr[nombreArr.length-1];
        const [public_id, extension] = nombre.split('.');
        //eliminar el archivo de cloudinary
        cloudinary.uploader.destroy(public_id);
    }

    //subo el archivo a Cloudinary
    const { tempFilePath } = req.files.archivo; //carpeta temp local donde se sube el archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    model.img =  secure_url;
    await model.save();
    res.json(model);

}


/**
 * Mostrar la imagen correspondiente a una coleccion
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const mostrarImagen = async (req = request, res = response) => {

    const { id, collection } = req.params;
    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe usuario con el id ${id}`
                });
            }    
        break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe producto con el id ${id}`
                });
            }    
        break;
    
        default:
           return  res.status(500).json({
               msg: 'No Implementado, validar coleccion'
            });
    }

    if (model.img){ //el modelo tienen imagen
        //path a la imagen en el server
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImg)) { //existe en el server
            //responder la imagen
            return res.sendFile(pathImg);
        }
    }
    
    //imagen defecto
    res.sendFile(path.join(__dirname, '../assets/no-image.jpg'));
}






module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}
