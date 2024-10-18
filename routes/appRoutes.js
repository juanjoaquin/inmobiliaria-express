import express from 'express'
import { inicio, categoria, error404, buscador } from '../controller/app-controller.js';

const router = express.Router()

//inicio
router.get('/', inicio)

//categorias
router.get('/categorias/:id', categoria)

//404
router.get('/404', error404)

//buscador
router.post('/buscador', buscador)

export default router;