import express from 'express';
import { authUser, cerrarSesion, confirmUser, formularioForgotPassword, formularioLogin, formularioRegristro, newPassword, registerForm, resetPassword, verifiedToken } from '../controller/usuario-controller.js';

 const router = express.Router();


router.get('/login', formularioLogin)
router.post('/login', authUser)


router.get('/register', formularioRegristro)
router.post('/register', registerForm)

router.get('/forgot-password', formularioForgotPassword)
router.post('/forgot-password', resetPassword)

router.get('/confirm-user/:token', confirmUser)

router.get('/forgot-password/:token', verifiedToken)
router.post('/forgot-password/:token', newPassword)

router.post('/cerrar-sesion', cerrarSesion)

// router.get('/nosotros', function(req, res) {
//     res.send('seccion nosotros')
// })

export default router;

