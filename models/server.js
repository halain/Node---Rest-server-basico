const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

const userRoutes= require('../routes/user.routes');
const authRoutes= require('../routes/auth.routes');
const categoryRoutes= require('../routes/category.routes');
const productRoutes= require('../routes/product.routes');
const buscarRoutes= require('../routes/buscar.routes');


class Server {

    constructor(){
        this.app = express();
        this.port =  process.env.PORT;
        //path base routes
        this.path = {
            auth:       '/api/auth',
            category:   '/api/categories',
            usuarios:   '/api/usuarios',
            productos:  '/api/productos',
            buscar:     '/api/search',
        }
        

        //conectar a base de datos
        this.conectarDB();

        //middlewares
        this.middlewares();

        this.routes();
    }

    /**
     * Conexion a la base de datos de mongodb
     */
    async conectarDB(){
        //Aqui se pueden hacer distintas conexiones a bbdd en dependencia del .env prod o dev
        await dbConnection();
    }


    /**
     * middlewares
     */
    middlewares(){
        //CORS
        this.app.use(cors());

        //lectura y parseo del body
        this.app.use(express.json());

        //directorio publico /public
        this.app.use(express.static('public'));
    }

    /**
     * rutas
     */
    routes() {
        this.app.use(this.path.auth, authRoutes);
        this.app.use(this.path.buscar, buscarRoutes);
        this.app.use(this.path.category, categoryRoutes);
        this.app.use(this.path.usuarios, userRoutes);
        this.app.use(this.path.productos, productRoutes);
    }

    /**
     * iniciar serser
     */
    listen() {
        this.app.listen(this.port, ()=> {
            console.log(`Server runing in port ${this.port}`);
        });
    }


}


module.exports = Server;