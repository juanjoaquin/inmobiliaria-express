import bcrypt from 'bcrypt'

const users = [
    {
        name: 'Raul',
        email: 'raul@hotmail.com',
        confirmed: 1,
        password: bcrypt.hashSync('password', 10)
    },
]

export default users;