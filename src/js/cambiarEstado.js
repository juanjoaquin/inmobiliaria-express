(function() {
    const cambiarEstadoButton = document.querySelectorAll('.cambiar-estado')
    const token = document.querySelector("meta[name='csrf-token']").getAttribute('content')

    cambiarEstadoButton.forEach(boton => {
        boton.addEventListener('click', cambiarEstadoPropiedad)
    })

    async function cambiarEstadoPropiedad(e) {
        const {propiedadId : id} = e.target.dataset

        if (!id) {
            console.log('ID de propiedad no encontrado');
            return;
        }

        try{
            const url = `/propiedades/${id}`

            console.log(url)
            
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'CSRF-Token': token
                }
            })

            
            const {resultado} = await response.json()

            if(resultado) {
                if(e.target.classList.contains('bg-yellow-100')) {
                    e.target.classList.add('bg-green-100', 'text-green-800')
                    e.target.classList.remove('bg-yellow-100', 'text-yellow-800')
                    e.target.textContent = 'Publicado'
                } else {
                    e.target.classList.remove('bg-green-100', 'text-green-800')
                    e.target.classList.add('bg-yellow-100', 'text-yellow-800')
                    e.target.textContent = 'No Publicado'
                }
            }

        } 
        catch(error) {
            console.log(error)
        }
    }
})()