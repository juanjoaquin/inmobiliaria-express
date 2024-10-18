
const resetFecha = fecha => {
    const newFecha = new Date(fecha).toISOString().slice(0, 10)

    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return new Date(newFecha).toLocaleDateString('es-ES', opciones)
}

export default resetFecha;