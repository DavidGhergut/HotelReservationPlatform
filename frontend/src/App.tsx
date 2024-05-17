import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Dashboard from "./components/pages/Dashboard.tsx";
import 'leaflet/dist/leaflet.css';

const App = () => {

  return (
    <Router>
        <Routes>
            <Route path="/" element={<Dashboard />} />
        </Routes>
    </Router>
  );
};

export default App
