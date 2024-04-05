"use client"

import { useEffect } from 'react';

function Globe() {
    useEffect(() => {
        // Load MapboxGL CSS
        const link = document.createElement('link');
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Load MapboxGL JavaScript
        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.js';
        script.async = true;
        script.onload = () => {
            // Initialize MapboxGL once the script is loaded
            mapboxgl.accessToken = 'pk.eyJ1IjoicmF2YW5jZW5hIiwiYSI6ImNsdDgwYjk0YTA1dWwycW9nbzhrYmVnaHQifQ.rIV6DS6E8ss6uqdDO1am-Q';
            
            const map = new mapboxgl.Map({
                container: 'map',
                // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
                style: 'mapbox://styles/ravancena/clum44jwv00wb01q50ku770t0',
                zoom: 1.5,
                center: [30, 50],
                projection: 'globe'
            });
            
            map.on('load', () => {
                map.setFog({
                    color: '#feffe0', // Lower atmosphere
                    'high-color': '#00fffb', // Upper atmosphere
                    'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
                    'space-color': '#ffb8e8', // Background color
                    'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
                });
            });
        };
        document.body.appendChild(script);

        // Clean up function to remove dynamically added elements
        return () => {
            document.head.removeChild(link);
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div id="map" style={{ width: '100%', height: '1080px' }}></div>
    );
}

export default Globe;
