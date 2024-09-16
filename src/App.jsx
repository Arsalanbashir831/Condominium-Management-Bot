import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import AddTicket from "./pages/AddTicket";
import TicketList from "./pages/TicketList";

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className={`h-screen ${isLoginPage ? 'bg-blue-300' : 'bg-gray-100'}`}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addTicket" element={<AddTicket />} />
        <Route path="/ticketList" element={<TicketList />} />
      </Routes>
    </div>
  );
};

export default App;
