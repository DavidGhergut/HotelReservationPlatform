import { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box, Grid, Card, CardContent } from '@mui/material';

interface Reservation {
    id: number;
    checkInDate: string;
    checkOutDate: string;
    rooms: Room[];
}

interface Room {
    roomNumber: number;
    type: number;
    price: number;
}

function MyBookings() {
    const [reservations, setReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/reservations')
            .then(response => {
                if (response.status === 200) {
                    const data: Reservation[] = response.data;
                    console.log('Fetched reservations:', data);
                    setReservations(data);
                } else {
                    console.error('Failed to fetch reservations:', response.status, response.statusText);
                }
            })
            .catch(error => {
                console.error('Error fetching reservations:', error);
            });
    }, []);

    if (reservations.length === 0) {
        return <div>No reservations found.</div>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Bookings
            </Typography>
            <Grid container spacing={2}>
                {reservations.map((reservation) => (
                    <Grid item xs={12} sm={6} md={4} key={reservation.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    Reservation #{reservation.id}
                                </Typography>
                                <Typography variant="body1">
                                    Check-In Date: {reservation.checkInDate}
                                </Typography>
                                <Typography variant="body1">
                                    Check-Out Date: {reservation.checkOutDate}
                                </Typography>
                                <Typography variant="body1">
                                    Rooms:
                                </Typography>
                                <ul>
                                    {reservation.rooms.map((room) => (
                                        <li key={room.roomNumber}>
                                            Room {room.roomNumber}: ${room.price}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default MyBookings;
