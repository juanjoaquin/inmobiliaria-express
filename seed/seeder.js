import {exit} from 'node:process'
import categorias from "./categorias.js";
import db from "../config/db.js";
import precios from './precios.js';
import {Categoria, Precio, User, Propiedad } from '../models/Index.js'
import users from './users.js';




const importarDatos = async () => {
    try {
        //Autenticar
        await db.authenticate()
        //Columnas
        await db.sync()
        //Seeder
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            User.bulkCreate(users)
        ])
        console.log(categorias)
        exit()
    }
    catch(error) {
        console.log("error:", error)
        
        exit(1)
    }
}

const deleteDatos = async () => {
    try {

        await Promise.all([
            Categoria.destroy({where: {}, truncate: false}),
            Precio.destroy({where: {}, truncate: false}),
            User.destroy({where: {}, truncate: false})
        ]);
        
        exit()
    }
    catch(error) {
        console.log("error:", error)
        
        exit(1)
    }
}

if(process.argv[2] === "-e") {
    deleteDatos()
}

if(process.argv[2] === "-i") {
    importarDatos()
}
//Para activarlo llamando: npm run db:importar -- -i

// importarDatos() SI LO EJECUTO ASÍ FUNCIONA