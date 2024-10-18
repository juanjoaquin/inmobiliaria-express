import express from 'express';
import userRoutes from './routes/userRoutes.js'
import db from './config/db.js'
import csrf from 'csurf'
import cookieParser from 'cookie-parser';
import propiedadRoutes from './routes/propiedadRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'


const app = express()

//Routing

//Conexión a la base de datos

// Middlewares de lectura de los formularios
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())
app.use(csrf({cookie:true}))

app.use(express.json())

app.use('/', appRoutes)
app.use('/auth', userRoutes)
app.use('/', propiedadRoutes)
app.use('/api', apiRoutes)

//Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');

try {
    await db.authenticate();
    db.sync();
    console.log('Connected on Data Base')
} catch(error) {
    console.log(error)
}

//Carpeta pública

app.use(express.static('public'))
//Puerto del proyecto
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listenting on ${port}`)
})
