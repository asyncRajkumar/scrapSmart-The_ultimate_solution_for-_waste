import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage1 from './Pages/landingPage1'
import UserHome from './Pages/UserHome'
import SchedulePickup from './Pages/SchedulePickup';
import CheckPrice from './Pages/CheckPrice';
import PickupHistory from './Pages/PickupHistory';
import HelpSupport from './Pages/HelpSupport';


function PlaceholderPage({ title }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "Arial" }}>
      <h1>{title}</h1>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage1 />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/schedule-pickup" element={<SchedulePickup />} />
        <Route path="/check-price" element={<CheckPrice />} />
        <Route path="/rewards" element={<PlaceholderPage title="Rewards" />} />
        <Route path="/pickup-history" element={<PickupHistory />} />
        <Route path="/collectors" element={<PlaceholderPage title="Nearby Collectors" />} />
        <Route path="/support" element={<HelpSupport />} />
        <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
      </Routes>
    </BrowserRouter>
  );
}