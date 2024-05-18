import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvent } from 'react-leaflet';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {Rating} from "@mui/material";

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
}

interface Hotel {
    hotelId: number;
    name: string;
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
    phoneNumber?: string;
    rooms: Room[];
    stars: number;
}

function MapStateSaver() {
    useMapEvent('moveend', (e: L.LeafletEvent) => {
        const map = e.target as L.Map;
        const center = map.getCenter();
        const zoom = map.getZoom();
        sessionStorage.setItem('mapCenter', JSON.stringify([center.lat, center.lng]));
        sessionStorage.setItem('mapZoom', JSON.stringify(zoom));
    });
    return null;
}

function Dashboard() {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
    const [radius, setRadius] = useState<number>(() => {
        const savedRadius = sessionStorage.getItem('radius');
        return savedRadius ? JSON.parse(savedRadius) : 5;
    });
    const [unlimitedRadius, setUnlimitedRadius] = useState<boolean>(() => {
        const savedUnlimitedRadius = sessionStorage.getItem('unlimitedRadius');
        return savedUnlimitedRadius ? JSON.parse(savedUnlimitedRadius) : false;
    });
    const [maxPrice, setMaxPrice] = useState<number>(() => {
        const savedMaxPrice = sessionStorage.getItem('maxPrice');
        return savedMaxPrice ? JSON.parse(savedMaxPrice) : 500;
    });
    const [position, setPosition] = useState<[number, number] | null>(() => {
        const savedPosition = sessionStorage.getItem('position');
        return savedPosition ? JSON.parse(savedPosition) : null;
    });
    const mapCenter = (() => {
        const savedMapCenter = sessionStorage.getItem('mapCenter');
        return savedMapCenter ? JSON.parse(savedMapCenter) : [51.98, 5.91];
    })();
    const mapZoom = (() => {
        const savedMapZoom = sessionStorage.getItem('mapZoom');
        return savedMapZoom ? JSON.parse(savedMapZoom) : 13;
    })();
    const [checkInDate, setCheckInDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

    useEffect(() => {
        axios.get('http://localhost:8080/hotels')
            .then(response => {
                if (response.status === 200) {
                    const data: Hotel[] = response.data;
                    console.log('Fetched hotels:', data);
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
                const currentPosition: [number, number] = [pos.coords.latitude, pos.coords.longitude];
                setPosition(currentPosition);
                sessionStorage.setItem('position', JSON.stringify(currentPosition));
            },
            (err) => {
                console.error('Error getting current position:', err);
            }
        );
    }, []);

    useEffect(() => {
        if (position) {
            console.log('Current position:', position);
            const filtered = hotels.filter((hotel) => {
                console.log(`Checking hotel: ${hotel.name}`);
                if (!hotel.rooms || hotel.rooms.length === 0) {
                    console.log(`Hotel ${hotel.name} excluded: no rooms available`);
                    return false;
                }
                const distance = calculateDistance(position[0], position[1], hotel.latitude, hotel.longitude);
                const hasAffordableRoom = hotel.rooms.some((room) => room.price <= maxPrice);
                const withinRadius = unlimitedRadius || distance <= radius;
                console.log(`Hotel: ${hotel.name}, Distance: ${distance}, Within Radius: ${withinRadius}, Affordable Room: ${hasAffordableRoom}`);
                if (!hasAffordableRoom) {
                    console.log(`Hotel ${hotel.name} excluded: no affordable rooms`);
                }
                if (!withinRadius) {
                    console.log(`Hotel ${hotel.name} excluded: outside radius`);
                }
                return withinRadius && hasAffordableRoom;
            });
            console.log('Filtered hotels:', filtered);
            setFilteredHotels(filtered);
        }
    }, [hotels, radius, maxPrice, unlimitedRadius, position]);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleRadiusChange = (_: Event, newValue: number | number[]) => {
        setRadius(newValue as number);
        sessionStorage.setItem('radius', JSON.stringify(newValue));
    };

    const handleUnlimitedRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUnlimitedRadius(event.target.checked);
        sessionStorage.setItem('unlimitedRadius', JSON.stringify(event.target.checked));
    };

    const handleMaxPriceChange = (_: Event, newValue: number | number[]) => {
        setMaxPrice(newValue as number);
        sessionStorage.setItem('maxPrice', JSON.stringify(newValue));
    };

    const handleMarkerClick = (hotelId: number) => {
        navigate(`/hotel/${hotelId}`, { state: { checkInDate, checkOutDate } });
    };

    const handleMyBookingsClick = () => {
        navigate('/my-bookings');
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
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Check-In Date"
                        value={checkInDate}
                        onChange={(newValue) => setCheckInDate(newValue)}
                        slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                    />
                    <DatePicker
                        label="Check-Out Date"
                        value={checkOutDate}
                        onChange={(newValue) => setCheckOutDate(newValue)}
                        slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                    />
                </LocalizationProvider>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleMyBookingsClick}
                    sx={{ marginTop: 2 }}
                >
                    My Bookings
                </Button>
            </Box>
            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100vh', flex: 1 }}
            >
                <MapStateSaver />
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
                    <Marker
                        key={hotel.hotelId}
                        position={[hotel.latitude, hotel.longitude]}
                        icon={HotelIcon}
                        eventHandlers={{
                            click: () => handleMarkerClick(hotel.hotelId),
                            mouseover: (e) => {
                                e.target.openPopup();
                            },
                            mouseout: (e) => {
                                e.target.closePopup();
                            }
                        }}
                    >
                        <Popup>
                            <div>
                                <strong>{hotel.name}</strong>
                                <br />
                                <Rating name="read-only" value={hotel.stars} readOnly />
                                <ul>
                                    {hotel.rooms.filter((room) => room.price <= maxPrice).map((room) => (
                                        <li key={room.roomNumber}>
                                            Room {room.roomNumber}: ${room.price}
                                        </li>
                                    ))}
                                </ul>
                                <div>Click the icon for more details</div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default Dashboard;
