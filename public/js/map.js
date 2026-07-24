mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [77.2090, 28.6139], // [longitude, latitude] opposite of normal coordinates
    zoom: 12
});