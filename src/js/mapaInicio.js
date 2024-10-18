(function(){
    const lat = -34.61154599255865;
    const lng = -58.441495497594865;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 16);

    let markers = new L.FeatureGroup().addTo(mapa)

    const categoriasSelect = document.querySelector('#categorias');
    const preciossSelect = document.querySelector('#precios');

    let propiedades = [];

    //Filtros
    const filtros = {
        categoria: '',
        precio: ''
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Filtrado de Precios y Categorias
    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value;
        filtrarPropiedades();
    })

    preciossSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value;
        filtrarPropiedades();
    })

    const obtenerPropiedades = async () => {
        try{
          
            const url = '/api/propiedades'
            const response = await fetch(url)
            const resultado = await response.json()
            
            propiedades = resultado;
            
            mostrarPropiedades(propiedades)
            
        } catch(error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades => {
        
        markers.clearLayers();


        propiedades.forEach(propiedad => {
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <p class="text-indigo-600 font-bold">${propiedad.categoria.name}</p>
                <h3 class="text-xl font-extrabold uppercase my-5">${propiedad?.title}</h3>
                <img src="/uploads/${propiedad?.image}" alt="Imagen de la propiedad">
                <p class="text-gray-600 font-bold">${propiedad.precio.name}</p>
                <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold cursor-pointer">Ver propiedad</a>
                `)

            markers.addLayer(marker)
        })
    }

    const filtrarPropiedades = () => {
        const resultado = propiedades
            .filter(filtrarCategoria)
            .filter(filtrarPrecio)

            mostrarPropiedades(resultado)
        
    }

    const filtrarCategoria = (propiedad) => {
        return filtros.categoria ? propiedad.categoria.id === filtros.categoria : propiedad;
    }

    const filtrarPrecio = (propiedad) => {
        return filtros.precio ? propiedad.precio.id === filtros.precio : propiedad
    }



    obtenerPropiedades()

})()