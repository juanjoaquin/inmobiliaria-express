import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Categoria = db.define('categorias', {
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
});

export default Categoria;