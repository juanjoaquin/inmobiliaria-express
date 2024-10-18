import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const identificarUsuario = async (req, res, next) => {
    //identificar si hay token
    const {_token} = req.cookies

    if(!_token) {
        req.user = null
        return next()
    }
    //lo comprobamos

    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET_KEY)

        const user = await User.scope('deletePassword').findByPk(decoded.id)

        if(user) {
            req.user = user
        }
        
        return next()
    }
    catch(error) {
        console.log(error)
        return res.clearCookie('_token').redirect('/auth/login')
    }
}

export default identificarUsuario