import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Typography, Box, Button, Grid, Card, CardContent, Rating} from '@mui/material';

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

function HotelDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { checkInDate, checkOutDate } = location.state || { checkInDate: null, checkOutDate: null };
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

    useEffect(() => {
        const hotelId = location.pathname.split('/').pop();
        axios.get(`http://localhost:8080/hotels/${hotelId}`)
            .then(response => {
                if (response.status === 200) {
                    const data: Hotel = response.data;
                    console.log('Fetched hotel details:', data);
                    setHotel(data);
                    setAvailableRooms(data.rooms);
                } else {
                    console.error('Failed to fetch hotel details:', response.status, response.statusText);
                }
            })
            .catch(error => {
                console.error('Error fetching hotel details:', error);
            });
    }, [location]);

    const handleReservation = (roomNumber: number) => {
        if (!checkInDate || !checkOutDate) {
            alert('Please select check-in and check-out dates from the dashboard.');
            navigate('/');
            return;
        }

        const reservation = {
            checkInDate: checkInDate.toISOString().split('T')[0],
            checkOutDate: checkOutDate.toISOString().split('T')[0],
            rooms: [{ roomNumber }]
        };

        axios.post('http://localhost:8080/reservations', reservation)
            .then(response => {
                if (response.status === 201) {
                    alert('Reservation successful!');
                    setAvailableRooms(prevRooms => prevRooms.filter(room => room.roomNumber !== roomNumber));
                } else {
                    alert('Failed to make a reservation.');
                }
            })
            .catch(error => {
                console.error('Error making reservation:', error);
                alert('Error making reservation.');
            });
    };

    if (!hotel) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Rating name="read-only" value={hotel.stars} readOnly />
            <Typography variant="h4" gutterBottom>
                {hotel.name}
            </Typography>
            <Typography variant="h6" gutterBottom>
                {hotel.city}, {hotel.country}
            </Typography>
            <Typography variant="h6" gutterBottom>
                Available Rooms:
            </Typography>
            <Grid container spacing={2}>
                {availableRooms.map((room) => (
                    <Grid item xs={12} sm={6} md={4} key={room.roomNumber}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    Room {room.roomNumber}
                                </Typography>
                                <Typography variant="body1">
                                    Type: {room.type}
                                </Typography>
                                <Typography variant="body1">
                                    Price: ${room.price} per night
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleReservation(room.roomNumber)}
                                    sx={{ marginTop: 2 }}
                                >
                                    Book
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default HotelDetails;
