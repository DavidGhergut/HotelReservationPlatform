import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import axios from 'axios';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icon for the current location
const CurrentLocationIcon = L.icon({
    iconUrl: 'current-location.png', // Use your blue marker URL
    iconSize: [25, 25],
    popupAnchor: [1, -20],
    className: 'current-location'
});

const HotelIcon = L.icon({
    iconUrl: 'hotel.jpeg', // Use your hotel marker URL
    iconSize: [25, 25],
    popupAnchor: [1, -20],
    className: 'hotel'
});

interface Room {
    roomNumber: number;
    type: number;
    price: number;
    isAvailable: boolean;
}

interface Hotel {
    hotelId: number;
    name: string;
    address?: string;
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
    phoneNumber?: string;
    rooms: Room[];
}

function Dashboard() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
    const [radius, setRadius] = useState<number>(5); // Default radius in kilometers
    const [unlimitedRadius, setUnlimitedRadius] = useState<boolean>(false);
    const [maxPrice, setMaxPrice] = useState<number>(500); // Default max price
    const [position, setPosition] = useState<[number, number] | null>(null);

    useEffect(() => {
        axios.get('http://localhost:8080/hotels')
            .then(response => {
                if (response.status === 200) {
                    const data: Hotel[] = response.data;
                    console.log('Fetched hotels:', data); // Debugging statement
                    setHotels(data);
                } else {
                    console.error('Failed to fetch data:', response.status, response.statusText);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
            },
            (err) => {
                console.error('Error getting current position:', err);
            }
        );
    }, []);

    useEffect(() => {
        if (position) {
            console.log('Current position:', position); // Debugging statement
            const filtered = hotels.filter((hotel) => {
                if (!hotel.rooms || hotel.rooms.length === 0) {
                    return false;
                }
                const distance = calculateDistance(position[0], position[1], hotel.latitude, hotel.longitude);
                const hasAffordableRoom = hotel.rooms.some((room) => room.price <= maxPrice);
                const withinRadius = unlimitedRadius || distance <= radius;
                console.log(`Hotel: ${hotel.name}, Distance: ${distance}, Within Radius: ${withinRadius}, Affordable Room: ${hasAffordableRoom}`); // Debugging statement
                return withinRadius && hasAffordableRoom;
            });
            console.log('Filtered hotels:', filtered); // Debugging statement
            setFilteredHotels(filtered);
        }
    }, [hotels, radius, maxPrice, unlimitedRadius, position]);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const handleRadiusChange = (_: any, newValue: number | number[]) => {
        setRadius(newValue as number);
    };

    const handleUnlimitedRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUnlimitedRadius(event.target.checked);
    };

    const handleMaxPriceChange = (_: any, newValue: number | number[]) => {
        setMaxPrice(newValue as number);
    };

    return (
        <div style={{ display: 'flex' }}>
            <Box sx={{ width: 300, margin: '20px', paddingRight: '20px' }}>
                <Typography variant="h6" gutterBottom>
                    Select Radius (km)
                </Typography>
                <Slider
                    value={radius}
                    onChange={handleRadiusChange}
                    aria-labelledby="radius-slider"
                    valueLabelDisplay="auto"
                    min={1}
                    max={20}
                    disabled={unlimitedRadius}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={unlimitedRadius}
                            onChange={handleUnlimitedRadiusChange}
                            name="unlimitedRadius"
                            color="primary"
                        />
                    }
                    label="Unlimited Radius"
                />
                <Typography variant="h6" gutterBottom>
                    Select Max Room Price ($)
                </Typography>
                <Slider
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    aria-labelledby="price-slider"
                    valueLabelDisplay="auto"
                    min={50}
                    max={1000}
                    step={50}
                />
            </Box>
            <MapContainer center={position || [51.98, 5.91]} zoom={13} style={{ height: '100vh', flex: 1 }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {position && (
                    <>
                        {!unlimitedRadius && (
                            <Circle
                                center={position}
                                radius={radius * 1000} // Radius in meters
                                fillColor="blue"
                                color="blue"
                            />
                        )}
                        <Marker position={position} icon={CurrentLocationIcon}>
                            <Popup>Your current location</Popup>
                        </Marker>
                    </>
                )}
                {filteredHotels.map((hotel) => (
                    <Marker key={hotel.hotelId} position={[hotel.latitude, hotel.longitude]} icon={HotelIcon}>
                        <Popup>
                            <div>
                                <strong>{hotel.name}</strong>
                                <ul>
                                    {hotel.rooms.filter((room) => room.price <= maxPrice).map((room) => (
                                        <li key={room.roomNumber}>
                                            Room {room.roomNumber}: ${room.price}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default Dashboard;
