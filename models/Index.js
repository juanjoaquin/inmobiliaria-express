import Categoria from './Categoria.js'
import Mensaje from './Mensaje.js';
import Precio from './Precio.js'
import Propiedad from './Propiedad.js'
import User from './User.js'

// Precio.hasOne(Propiedad);

Propiedad.belongsTo(Precio, { foreignKey: 'precio_id' });
Propiedad.belongsTo(Categoria, { foreignKey: 'categoria_id' });
Propiedad.belongsTo(User, { foreignKey: 'user_id' });
Propiedad.hasMany(Mensaje, {foreignKey: 'propiedad_id'});

Mensaje.belongsTo(Propiedad, {foreignKey: 'propiedad_id'});
Mensaje.belongsTo(User, {foreignKey: 'user_id'});


export {
    Categoria,
    Precio,
    Propiedad,
    User,
    Mensaje
}