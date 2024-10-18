import jwt from 'jsonwebtoken'
import {User} from '../models/Index.js'

const middlewareRoute = async (req, res, next) => {

    const {_token} = req.cookies;

    if(!_token) {
        return res.redirect('/auth/login')
    }

    try {

        const decoded = jwt.verify(_token, process.env.JWT_SECRET_KEY)

        const user = await User.scope('deletePassword').findByPk(decoded.id)

        if(user) {
            req.user = user
        } else {
            return res.redirect('/auth/login')
        }
        
        console.log(user)

        
        return next()
        
    }
    catch(error) {
        return res.clearCookie('_token').redirect('/auth/login');
    }

    
};

export default middlewareRoute;
