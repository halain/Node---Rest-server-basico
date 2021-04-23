const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const  fileUpload  = require('express-fileupload');


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
            uploads:     '/api/uploads',
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

        //fileupload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            limits: { fileSize: 50 * 1024 * 1024 },
            createParentPath: true //ojo con esta propiedad es peligrosa, crea automaticamente la carpeta donde se sube el file sino existe
        }));
    }

    /**
     * rutas
     */
    routes() {
        this.app.use(this.path.auth, require('../routes/auth.routes'));
        this.app.use(this.path.buscar,  require('../routes/buscar.routes'));
        this.app.use(this.path.category, require('../routes/category.routes'));
        this.app.use(this.path.usuarios, require('../routes/user.routes'));
        this.app.use(this.path.productos,  require('../routes/product.routes'));
        this.app.use(this.path.uploads, require('../routes/uploads.routes'));
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