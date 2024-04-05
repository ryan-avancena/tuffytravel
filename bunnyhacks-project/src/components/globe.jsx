"use client"

import { useEffect } from 'react';
import Head from 'next/head';

function Globe() {
    useEffect(() => {
        const scriptPromises = [];

        // Load MapboxGL JavaScript
        const script1 = document.createElement('script');
        script1.src = 'https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.js';
        script1.async = true;
        const script1Promise = new Promise((resolve, reject) => {
            script1.onload = resolve;
            script1.onerror = reject;
        });
        scriptPromises.push(script1Promise);
        document.body.appendChild(script1);

        // Load MapboxGL Geocoder JavaScript
        const script2 = document.createElement('script');
        script2.src = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.min.js';
        script2.async = true;
        const script2Promise = new Promise((resolve, reject) => {
            script2.onload = resolve;
            script2.onerror = reject;
        });
        scriptPromises.push(script2Promise);
        document.body.appendChild(script2);

        Promise.all(scriptPromises)
    .then(() => {
        // Initialize MapboxGL once all scripts are loaded
        mapboxgl.accessToken = 'pk.eyJ1IjoicmF2YW5jZW5hIiwiYSI6ImNsdDgwYjk0YTA1dWwycW9nbzhrYmVnaHQifQ.rIV6DS6E8ss6uqdDO1am-Q';
        
        const map = new mapboxgl.Map({
            container: 'map',
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: 'mapbox://styles/ravancena/clum44jwv00wb01q50ku770t0',
            zoom: 2,
            center: [-74.5, 40],
            projection: 'globe'
        });

        map.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl
            })
        );
        
        map.on('load', () => {
            map.setFog({
                color: '#feffe0', // Lower atmosphere
                'high-color': '#00fffb', // Upper atmosphere
                'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
                'space-color': '#ffb8e8', // Background color
                'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
            });
        });
    })
    .catch(error => {
        console.error('Error loading scripts:', error);
    });
    }, []);


    return (
        <>
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css" rel="stylesheet" />
        <link href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css" rel="stylesheet" />
        <div id="map" style={{ width: '100%', height: '100vh' }}></div>
        </>
    );
}

export default Globe;
