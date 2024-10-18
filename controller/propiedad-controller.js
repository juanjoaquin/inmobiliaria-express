// import Categoria from "../models/Categoria.js"
// import Precio from "../models/Precio.js"
import { unlink } from 'node:fs/promises'
import { validationResult } from "express-validator"
import { Precio, Categoria, Propiedad, Mensaje, User } from '../models/Index.js'
import esVendedor from '../helpers/index.js'
import resetFecha from '../helpers/reset-fecha.js'


const admin = async (req, res) => {

    const { pagina: paginaActual } = req.query

    const expresion = /^[0-9]$/

    if (!expresion.test(paginaActual)) {
        return res.redirect('/mis-propiedades?pagina=1')
    }

    try {
        const { id } = req.user

        const limit = 10
        const offset = ((paginaActual * limit) - limit)

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: { user_id: id },
                include: [
                    { model: Categoria, as: 'categoria' },
                    { model: Precio, as: 'precio' },
                    { model: Mensaje, as: 'mensajes'}
                ]
    
            }),
            Propiedad.count({
                where: {
                    user_id: id
                }
            })
        ])


        res.render('propiedades/admin', {
            pagina: 'Mis propiedades',
            propiedades: propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            offset,
            limit,
            total

        })
    } catch (error) {
        console.log(error)
    }

}

const crearPropiedad = async (req, res) => {

    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear', {
        pagina: 'Crear propiedad',
        // barra: true,
        categorias: categorias,
        precios: precios,
        csrfToken: req.csrfToken(),
        datos: {}

    })
}
const guardarPropiedad = async (req, res) => {
    // Verifica si los datos llegan

    let resultado = validationResult(req);
    if (!resultado.isEmpty()) {
        
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()

        ]);

        return res.render('propiedades/crear', {
            pagina: 'Crear propiedad',
            // barra: true,
            categorias: categorias,
            precios: precios,
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            datos: req.body
        });
    }

    // Creando el registro
    const { title, description, rooms, parking, wc, calle, lat, lng, category: categoria_id, price: precio_id } = req.body;

    const { id: user_id } = req.user

    try {
        const propiedadGuardada = await Propiedad.create({
            title,
            description,
            rooms,
            parking,
            wc,
            calle,
            lat,
            lng,
            categoria_id,
            precio_id,
            user_id,
            image: ''
        })

        const { id } = propiedadGuardada

        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log(error)
    }

    console.log('Console log:', req.body)
};

const addImage = async (req, res) => {

    const { id } = req.params
    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad no esté publicada
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad pertenece a quien visita esta página
    if (req.user.id.toString() !== propiedad.user_id.toString()) {
        return res.redirect('/mis-propiedades')
    }


    res.render('propiedades/agregar-imagen', {
        pagina: 'Add image',
        propiedad: propiedad,
        csrfToken: req.csrfToken(),

    })
}

const saveImage = async (req, res, next) => {
    const { id } = req.params
    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad no esté publicada
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades');
    }

    // Validar que la propiedad pertenece a quien visita esta página
    if (req.user.id.toString() !== propiedad.user_id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    try {
        propiedad.image = req.file.filename
        propiedad.publicado = 1
        await propiedad.save()

        next()
    }
    catch (error) {
        console.log(error)
    }

}

const editPropiedad = async (req, res) => {

    // Validar id de la Propiedad para edición
    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    });

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Validar same usuario
    if (propiedad.user_id.toString() !== req.user.id.toString()) {
        return res.redirect('/mis-propiedades')

    }


    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])


    return res.render('propiedades/editar', {
        pagina: 'Editar Propiedad',
        csrfToken: req.csrfToken(),
        categorias: categorias,
        precios: precios,
        datos: propiedad
    })
}

const guardarEditarPropiedad = async (req, res) => {

    //Checkear validación form
    let resultado = validationResult(req)
    if (!resultado.isEmpty()) {
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])


        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias: categorias,
            precios: precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    // Validar id de la Propiedad para edición
    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    });

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Validar same usuario
    if (propiedad.user_id.toString() !== req.user.id.toString()) {
        return res.redirect('/mis-propiedades')

    }

    //Reescribir el objeto y updatearlo

    try {
        const { title, description, rooms, parking, wc, calle, lat, lng, category: categoria_id, price: precio_id } = req.body;

        propiedad.set({
            title,
            description,
            rooms,
            parking,
            wc,
            calle,
            lat,
            lng,
            categoria_id,
            precio_id
        })


        await propiedad.save();

        return res.redirect('/mis-propiedades')
    }

    catch (error) {
        console.log(error)
    }



}

const deletePropiedad = async (req, res) => {
    // Validar id de la Propiedad para edición
    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    // Validar same usuario
    if (propiedad.user_id.toString() !== req.user.id.toString()) {
        return res.redirect('/mis-propiedades')

    }

    //Eliminar imagen
    await unlink(`public/uploads/${propiedad.image}`)

    console.log(`Se eliminó la imagen ${propiedad.image}`)

    // Propiedad eliminada
    await propiedad.destroy()

    return res.redirect('/mis-propiedades')
}

const mostrarPropiedad = async (req, res) => {
    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    })


    if (!propiedad || !propiedad.publicado) {
        return res.redirect('/404')
    }

    res.render('propiedades/mostrar', {
        propiedad: propiedad,
        pagina: propiedad.title,
        csrfToken: req.csrfToken(),
        user: req.user,
        esVendedor: esVendedor(req.user?.id, propiedad.user_id)
    })
}

const enviarMensaje = async (req, res) => {
    const {id} = req.params
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    })

    if (!propiedad) {
        return res.redirect('/404')
    }

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('propiedades/mostrar', {
            propiedad: propiedad,
            pagina: propiedad.title,
            csrfToken: req.csrfToken(),
            user: req.user,
            esVendedor: esVendedor(req.user?.id, propiedad.user_id),
            errores: resultado.array(),
            enviado: true
        })

    }

    const {mensaje} = req.body
    const {id: propiedad_id} = req.params
    const {id: user_id} = req.user

    await Mensaje.create({
        mensaje, propiedad_id, user_id
    })

    res.render('propiedades/mostrar', {
        propiedad: propiedad,
        pagina: propiedad.title,
        csrfToken: req.csrfToken(),
        user: req.user,
        esVendedor: esVendedor(req.user?.id, propiedad.user_id),
        errores: resultado.array(),
        enviado: true
    })
}

//Leer los mensajes 

const leerMensaje = async (req, res) => {
    
    const {id} = req.params

    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {model: Mensaje, as: 'mensajes', include: [{model: User, as: 'user'}]} 
        ]
    })

    if(!propiedad) {
        return res.render('/mis-propiedades')
    }

    if (propiedad.user_id.toString() !== req.user.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/mensajes', {
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        resetFecha
    })

}

//cambio la propiedad button
    const cambiarEstado = async (req, res ) => {
        const {id} = req.params
        
        const propiedad = await Propiedad.findByPk(id)
        if(!propiedad) {
            return res.redirect('/mis-propiedades')
        }

        if(propiedad.user_id.toString() !== req.user.id.toString()) {
            return res.redirect('/mis-propiedades')
        }

       if(propiedad.publicado) {
        propiedad.publicado = 0
       } else {
        propiedad.publicado = 1
       }
        
       await propiedad.save()

       res.json({
        resultado: 'ok'
       })
}


export {
    admin,
    crearPropiedad,
    guardarPropiedad,
    addImage,
    saveImage,
    editPropiedad,
    guardarEditarPropiedad,
    deletePropiedad,
    mostrarPropiedad,
    enviarMensaje,
    leerMensaje,
    cambiarEstado
}