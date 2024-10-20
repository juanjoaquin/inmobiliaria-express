import jwt from 'jsonwebtoken'

const generateJWT = (id) => {
   return jwt.sign({id}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'})
}

export {generateJWT}