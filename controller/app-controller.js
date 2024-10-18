import {Precio, Categoria, Propiedad} from '../models/Index.js'
import { Sequelize } from 'sequelize'

const inicio = async (req, res) => {

    const [categorias, precios, casas, departamentos] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true}),
        
        Propiedad.findAll({
            where: {
                categoria_id: 36
            },
            include: [
                {model: Precio, as: 'precio'},
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),

        Propiedad.findAll({
            where: {
                categoria_id: 37
            },
            include: [
                {model: Precio, as: 'precio'}
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        })
    ])

    res.render('inicio', {
        pagina: 'Inicio',
        categorias: categorias,
        precios: precios,
        casas: casas,
        departamentos: departamentos,
        csrfToken: req.csrfToken()
    })
}


const categoria = async (req, res) => {
    //Categoria existe
    const {id} = req.params
    
    const categoria = await Categoria.findByPk(id)
    if(!categoria) {
        return res.redirect('/404')
    }
    //GET propiedades de la categoria
    const propiedades = await Propiedad.findAll({
        
        where: {
            categoria_id: id
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })

    res.render('categoria', {
        pagina: `${categoria.name}s en venta`,
        propiedades,
        csrfToken: req.csrfToken()

    })
}


const error404 = (req, res) => {
    res.render('404', {
        pagina: 'Error 404 Not Found',
        csrfToken: req.csrfToken()

    })
}

const buscador = async (req, res) => {
    const {termino} = req.body

    if(!termino.trim()) {
        return res.redirect('back')
    }

    const propiedades = await Propiedad.findAll({
        where: {
            title: {
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })

    res.render('busqueda', {
        pagina: 'Resultados de la búsqueda',
        propiedades,
        csrfToken: req.csrfToken()
    })
}

export {
    inicio, categoria, error404, buscador
}