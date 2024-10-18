(function() {
    const lat = document.querySelector('#lat').value || -34.61154599255865;
    const lng = document.querySelector('#lng').value || -58.441495497594865;
    const mapa = L.map('mapa').setView([lat, lng], 16);
    
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Marcar el pin
    let marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true,
    }).addTo(mapa);

    // Detectar movimiento del pin y centrar mapa
    marker.on('moveend', function(e) {
        const position = marker.getLatLng();
        mapa.panTo(new L.LatLng(position.lat, position.lng));

        geocodeService.reverse().latlng(position, 13).run(function(error, resultado) {
            // console.log(resultado)

            marker.bindPopup(resultado.address.LongLabel)

            document.querySelector('.calle').innerText = resultado.address?.Address ?? '';
            document.querySelector('#calle').value = resultado.address?.Address ?? '';
            document.querySelector('#lat').value = resultado.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado.latlng?.lng ?? '';
        })
    });

    // Detectar cuando el mapa se mueva
    mapa.on('moveend', function() {
        const center = mapa.getCenter();
        marker.setLatLng([center.lat, center.lng]);
    });

    //Obtener información de la calle al soltar el pin.
    
})();
