import generateId from "../helpers/tokens.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt'
import {check, validationResult} from 'express-validator'
import { emailForgotPassword, emailRegister } from "../helpers/emails.js";
import { generateJWT } from "../helpers/jwt-token.js";





const formularioLogin = async (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar sesión',
        csrfToken: req.csrfToken()
    })
};

const authUser = async (req, res) => {
    await check('email').isEmail().withMessage('Email is required').run(req);
    await check('password').notEmpty().withMessage('Password is required').run(req);

    let resultado = validationResult(req)
    if(!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    //Comprobando si el User existe
    const {email, password} = req.body

    const loginUserExists = await User.findOne({where: {email}})
    if(!loginUserExists){
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array({msg: 'User doesnt exists '})
        })
    }

    //Comprobando si el user confirmo 
    if(!loginUserExists.confirmed) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Your account isnt confirmed yet '}]
        })
    }

    if(!loginUserExists.verifyPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Password incorrect'}]
        })
    }

    const token = generateJWT(loginUserExists.id)
    console.log(token)

    return res.cookie('_token', token, {
        httpOnly: true
        
    }).redirect('/mis-propiedades')
}

const formularioRegristro = async (req, res) => {
    res.render('auth/register', {
        pagina: 'Crear cuenta',
        csrfToken: req.csrfToken()
    })
}

const registerForm = async (req, res) => {

    await check('name').notEmpty().withMessage('Name is required').isLength({min: 3}).run(req)
    await check('email').isEmail().withMessage('Email type is required').run(req)
    await check('password').isLength({min:6}).withMessage('Password must be min 6 characters').run(req)
    await check('repetir_password')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must be the same');
        }
        return true;
    })
    .run(req);

    let resultado = validationResult(req);

    //Verificar si está empty
    if(!resultado.isEmpty()) {
        return res.render('auth/register', {
            pagina: 'Crear cuenta',
            errores: resultado.array(),
            user: {
                name: req.body.name,
                email: req.body.email,
                csrfToken: req.csrfToken()
            }
        })


    }

    const {password, email, name} = req.body

    const existsUser = await User.findOne({where: { email}})
    if(existsUser) {
        return res.render('auth/register', {
            pagina: 'Crear cuenta',
            errores: [{msg: 'Users already exists'}],
            user : {
                name: req.body.name,
                email: req.body.email,
                csrfToken: req.csrfToken()
            }
        });
    }
    
    
    const user = await User.create({
        name, 
        email, 
        password, 
        token: generateId() 
    });

    emailRegister({
        name: user.name,
        email: user.email,
        token: user.token
    });

    
    res.render('templates/message', {
        pagina: 'Cuenta creada correctamente',
        message: 'Te hemos enviado un email para la confirmación de la cuenta'
    })

    
    
}

//Comprobar cuenta
const confirmUser = async (req, res) => {
    const {token} = req.params;

    const verifiedToken = await User.findOne({where: {token}});

    //Si no encontramos el Token
    if(!verifiedToken) {
        return res.render('auth/confirm-user', {
            pagina: 'Error confirm your account',
            message: 'Error al confirmar tu cuenta',
            error: true
        });
    }

    verifiedToken.token = null
    verifiedToken.confirmed = true
    await verifiedToken.save();
    
    return res.render('auth/confirm-user', {
        pagina: 'Cuenta confirmada',
        message: 'Your account confirmed',
        error: false
    });
    

    // Si el token es válido
    // res.render('auth/confirm-user', {
    //     pagina: 'Cuenta confirmada',
    //     message: 'Tu cuenta ha sido confirmada correctamente',
    //     error: false
    // });
};

const formularioForgotPassword = async (req, res) => {
    res.render('auth/forgot-password', {
        pagina: 'Recuperá tu contraseña',
        csrfToken: req.csrfToken(),
    })
}

const resetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('Email type is required').run(req);

    let resultado = validationResult(req)
    if(!resultado.isEmpty()) {
        return res.render('auth/forgot-password', {
            pagina: 'Reset your password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    //Encontrar usuario en la DB para resetear password
    const {email} = req.body

    const user = await User.findOne({where: {email}})

    if(!user) {
        return res.render('auth/forgot-password', {
            pagina: 'Reset your password',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'The email you entered is not registered'}]
        })
    }

    //Generando un token nuevo
    user.token = generateId();
    await user.save();

    emailForgotPassword({
        email: user.email,
        name: user.name,
        token: user.token
    })

    res.render('templates/message', {
        pagina: 'Reestablece tu contraseña',
        message: 'Te hemos enviado un email para reestablecer la contraseña de tú cuenta'
    })
}

const verifiedToken = async (req, res) => {

    const { token } = req.params;

    const usuario = await User.findOne({where: {token}})

    if(!usuario) {
        return res.render('auth/confirm-user', {
            pagina: 'Reestablece tu Password',
            message: 'Error to validate on reset your password',
            error: true
        });
    }

    res.render('auth/reset-password', {
        pagina: 'Reestablece tu password',
        csrfToken: req.csrfToken()
    })
    
}

const newPassword = async (req, res) => {
    //Validar password
    await check('password').isLength({min:6}).withMessage('Password must be min 6 characters').run(req)
    let resultado = validationResult(req)
    if(!resultado.isEmpty()) {
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }
    //Identificar user
    const {token} = req.params
    const {password} = req.body

    const usuario = await User.findOne({where: {token}})

    //Hashear password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);

    usuario.token = null
    await usuario.save()

    res.render('auth/confirm-user', {
        pagina: 'Password reset its ok! ',
        message: 'El password se reestableció correctamente'
    })
}


const cerrarSesion = async (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

export {
    formularioLogin, 
    formularioRegristro, 
    formularioForgotPassword, 
    registerForm,
    confirmUser, 
    resetPassword,
    verifiedToken,
    newPassword,
    authUser,
    cerrarSesion
};



