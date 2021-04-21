const express = require('express');
const cors = require('cors');
const userRoutes= require('../routes/user.routes');
const { dbConnection } = require('../database/config');


class Server {

    constructor(){
        this.app = express();
        this.port =  process.env.PORT;
        //path base routes
        this.usuariosPath = '/api/usuarios';

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
        await dbConnection()
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
       this.app.use(this.usuariosPath, userRoutes);
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