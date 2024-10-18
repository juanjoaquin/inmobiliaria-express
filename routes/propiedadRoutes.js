import express from 'express';
import { addImage, admin, crearPropiedad, deletePropiedad, cambiarEstado, editPropiedad, enviarMensaje, guardarEditarPropiedad, guardarPropiedad, leerMensaje, mostrarPropiedad, saveImage } from '../controller/propiedad-controller.js';
import { body } from 'express-validator';
import middlewareRoute from '../middleware/route-middleware.js';
import upload from '../middleware/subir-imagen-multer.js';
import identificarUsuario from '../middleware/identificar-usuario.js';


const router = express.Router();

router.get('/mis-propiedades', middlewareRoute, admin);

router.get('/propiedades/crear', middlewareRoute ,crearPropiedad)

router.post('/propiedades/crear', middlewareRoute ,
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required')
        .isLength({max: 25}).withMessage('Max 25 characteres'),
    body('category').isNumeric().withMessage('Select category'),
    body('price').isNumeric().withMessage('Select price'),
    body('wc').isNumeric().withMessage('Select WC'),
    body('rooms').isNumeric().withMessage('Select room'),
    body('parking').isNumeric().withMessage('Select parking lot'),
    body('lat').notEmpty().withMessage('Select ubication on map'),

    guardarPropiedad
);

router.get('/propiedades/agregar-imagen/:id', middlewareRoute, addImage);

router.post('/propiedades/agregar-imagen/:id',  
    middlewareRoute, upload.single('image'), saveImage
);

router.get('/propiedades/editar/:id', middlewareRoute, editPropiedad)


router.post('/propiedades/editar/:id', middlewareRoute ,
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required')
        .isLength({max: 25}).withMessage('Max 25 characteres'),
    body('category').isNumeric().withMessage('Select category'),
    body('price').isNumeric().withMessage('Select price'),
    body('wc').isNumeric().withMessage('Select WC'),
    body('rooms').isNumeric().withMessage('Select room'),
    body('parking').isNumeric().withMessage('Select parking lot'),
    body('lat').notEmpty().withMessage('Select ubication on map'),

    guardarEditarPropiedad
);

router.post('/propiedades/eliminar/:id', middlewareRoute, deletePropiedad)

//Rutas de Invitado para ver propiedad:
router.get('/propiedad/:id', identificarUsuario, mostrarPropiedad)

//Almacenar los mensajes
router.post('/propiedad/:id', 
    identificarUsuario, 
    body('mensaje').isLength({min: 10}).withMessage('Message is required'), 
    enviarMensaje
)

router.get('/mensajes/:id', 
    middlewareRoute,
    leerMensaje
)

//estado button
router.put('/propiedades/:id', 
    middlewareRoute, 
    cambiarEstado
)


export default router;