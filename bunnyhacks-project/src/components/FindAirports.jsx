import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { Button } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import RequestToken from './request'

import './FindAirports.css'


function FindAirports({ onDepartureSelected, onArrivalSelected  }) {
    const [airports, setAirports] = useState(null); // State to store airport data
    const [departureAirport, setDepartureAirport] = useState(null);
    const [arrivalAirport, setArrivalAirport] = useState(null);
    const [isSelectDisabled, setIsSelectDisabled] = useState(true);
    const [selectedDate, setSelectedDate] = useState(dayjs('2024-04-07'));
    const [flightData, setFlightData] = useState(null);

    useEffect(() => {
    const fetchAirports = async () => {
        try {
            // Make HTTP GET request to fetch airport data
            const response = await axios.get('http://localhost:5000/airport-data');
            const extractedData = processAirportData(response.data);
            setAirports(extractedData);
          
        } catch (error) {
          console.error('Error fetching airport data:', error);
        }
    };
  
    fetchAirports();

    }, []);

    const processAirportData = data => {
        const extractedData = {};
        const lines = data.split('\n');
    
        lines.forEach(line => {
            const parts = line.split(':');
            const iataCode = parts[1];
            const city = parts[2];
            const airportName = parts[3];
            const country = parts[4];

            const latitude = parts[14];
            const longitude = parts[15];
    
            // Exclude data with N/A values
            if (city !== 'N/A' && airportName !== 'N/A' && country !== 'N/A' && iataCode !== 'N/A') {
                // Initialize the array if it doesn't exist
                if (!extractedData[iataCode]) {
                    extractedData[iataCode] = [];
                }
    
                extractedData[iataCode].push({ airportName, city, country, latitude, longitude });
            }
        });
    
        return extractedData;
    };
    
    const options = airports ? Object.keys(airports).reduce((acc, code) => {
        const parsedAirports = airports[code];
        parsedAirports.forEach(airport => {
            const label = `${code} - ${airport.airportName}, ${airport.city} - ${airport.country}`;
            const lat = `${airport.latitude}`;
            const lng = `${airport.longitude}`;
            acc.push({ code, label, lat, lng });
        });
        return acc;
    }, []) : [];
    

    const handleDepartureChange = (event, newValue) => {
        setDepartureAirport(newValue);
        console.log("handle departure change:", newValue)
        onDepartureSelected(newValue.lat, newValue.lng)
        setIsSelectDisabled(false);
        // console.log(newValue); // Log the selected airport
    };


    const handleArrivalChange = (event, newValue) => {
        setArrivalAirport(newValue);
        console.log("handle arrival change:", newValue);
        onArrivalSelected(newValue.lat, newValue.lng);
        setIsSelectDisabled(false); // Enable the select button when an option is chosen
    };

    const handleFormSubmit = async () => {
        console.log("Departure Latitude:", departureAirport.lat);
        console.log("Departure Longitude:", departureAirport.lng);
        console.log("Arrival Latitude:", arrivalAirport.lat);
        console.log("Arrival Longitude:", arrivalAirport.lng);
        console.log('')

        console.log("Departure Airport: ", departureAirport.code)
        console.log("Arrival Airport: ", arrivalAirport.code)

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
        console.log('Current date:', formattedDate);

        try {
            console.log(departureAirport.code,arrivalAirport.code,formattedDate)
            const response = await axios.get('http://localhost:5000/fetchAirlineData', {
                params: {
                    departureAirport: departureAirport.code,
                    arrivalAirport: arrivalAirport.code,
                    date: formattedDate
                }
            });
            console.log(response.data)
            setFlightData(response.data); // Update flight data state
        } catch (error) {
            console.error('Error fetching flight data:', error);
        }
    };

    return (
        <div className='searchBox'>
            <p>Select an Airport (Departure)</p>
            <Autocomplete
                sx={{
                    width: '1000px',
                }}
                options={options}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => <TextField {...params} label="Select an airport" />}
                onChange={handleDepartureChange}
            />
        
            <p>Select an Airport (Arrival):</p>
            <Autocomplete
                options={options}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => <TextField {...params} label="Select an airport" />}
                onChange={handleArrivalChange}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker 
                    label="Select Date" 
                    value={selectedDate} 
                    onChange={(newDate) => setSelectedDate(newDate)} 
                />
            </LocalizationProvider>
            
            <Button onClick={handleFormSubmit}>Submit</Button>

        </div>
      );
}

export default FindAirports;
