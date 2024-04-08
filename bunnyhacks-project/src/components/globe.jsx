"use client"

import React, { useRef,useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import FindAirports from './FindAirports';
// import RequestToken from './request'

function Globe() {

    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [coordinates, setCoordinates] = useState(null);

    const [departureSelected, setDepartureSelected] = useState(null);
    const [arrivalSelected, setArrivalSelected] = useState(null);

    const handleDepartureSelected = (lat, lng) => {
        console.log("Departure (Globe.jsx) : ", lat, lng);
        const departureCoods = {lat,lng}
        setDepartureSelected(departureCoods)
    }

    const handleArrivalSelected = (lat, lng) => {
        console.log("Arrival (Globe.jsx) : ", lat, lng);
        const arrivalCoods = {lat,lng}
        setArrivalSelected(arrivalCoods)
        if (map) {
            map.flyTo({ center: [lng, lat], zoom: 2 }); // Pan to the selected coordinates
    
            // Remove existing marker if it exists
            if (marker) {
                marker.remove();
            }
    
            // Create a HTML element for the marker
            const customMarker = document.createElement('div');
            customMarker.className = 'marker';
            customMarker.style.backgroundImage = 'url("https://cdn-icons-png.freepik.com/512/347/347436.png")';
            customMarker.style.width = '40px';
            customMarker.style.height = '40px';
            customMarker.style.backgroundSize = 'cover';
            customMarker.style.backgroundRepeat = 'no-repeat';
            customMarker.style.cursor = 'pointer';
    
            // Make a marker for the selected coordinates and add it to the map
            const newMarker = new mapboxgl.Marker(customMarker)
                .setLngLat([lng, lat])
                .addTo(map);
            
            // Update marker state
            setMarker(newMarker);
        }
    };

    /* FOR THE GLOBE */
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoicmF2YW5jZW5hIiwiYSI6ImNsdDgwYjk0YTA1dWwycW9nbzhrYmVnaHQifQ.rIV6DS6E8ss6uqdDO1am-Q';

        const newMap = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/ravancena/clup2ee0t004x01ps3wnk4j9y', // style URL,
            zoom: 2,
            // center: [-74.5, 40],
            projection: 'globe'
        });


        newMap.addControl(new mapboxgl.NavigationControl());

        var geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
            });

        newMap.addControl(geolocate);
        
        newMap.on('load', () => {
            newMap.setFog({
                color: '#feffe0', // Lower atmosphere
                'high-color': '#00fffb', // Upper atmosphere
                'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
                'space-color': '#f0d0e6', // Background color
                'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
            });    
            
        });

        geolocate.on('geolocate', function(e) {
            // console.log(e.coords.latitude)
            var userLatitude = e.coords.latitude;
            var userLongitude = e.coords.longitude;
            
            console.log("User Latitude:", userLatitude);
            console.log("User Longitude:", userLongitude);
            setCoordinates({ userLatitude, userLongitude });
        });

        setMap(newMap);
        
        return () => {
            newMap.remove();
        };
    }, []);

    // function fetchFlights() {

    // }

    return (
        <>
        {/* {console.log("globe.jsx: ",departureSelected, arrivalSelected)} */}
        <FindAirports onDepartureSelected={handleDepartureSelected} onArrivalSelected={handleArrivalSelected} />
        <div id="map" style={{ width: '100%', height: '100vh' }}></div>

        </>
    );
}

export default Globe;