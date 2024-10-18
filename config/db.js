import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config({path: '.env'})

const db = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD ?? '', {
        host: process.env.DATABASE_HOST,
        port: 3307,
        dialect: 'mysql',
        define: {
            timestamps: true
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        operatorsAliases: 1
    });
    
export default db;