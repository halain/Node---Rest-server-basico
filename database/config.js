const mongoose = require('mongoose');

const dbConnection = async()=> {

    try {
        //conexion a mongodb atlas
        await mongoose.connect(process.env.MONGODB_ATLAS_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false //sino esta funcion findByIdAndUpdate da error
        });

        console.log('Base de datos Online');

    } catch (error) {
        console.log(error);
        throw new Error('Error en la conexión a la bbdd');
    }
    
}




module.exports = {
    dbConnection
}