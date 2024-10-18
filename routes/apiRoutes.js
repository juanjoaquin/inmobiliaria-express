import express from 'express'
import { propiedades } from '../controller/api-controller.js'


const router = express.Router()

router.get('/propiedades', propiedades)

export default router;