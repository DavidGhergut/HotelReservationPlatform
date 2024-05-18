import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/pages/Dashboard';
import HotelDetails from './components/pages/HotelDetails';
import MyBookings from "./components/pages/MyBookings.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/hotel/:id" element={<HotelDetails />} />
                <Route path="/my-bookings" element={<MyBookings />} />
            </Routes>
        </Router>
    );
}

export default App;
