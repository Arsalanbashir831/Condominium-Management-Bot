import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import AddTicket from "./pages/AddTicket";
import TicketList from "./pages/TicketList";
import AddUser from "./pages/AddUser";
import Navbar from "./components/Navbar";
import TechnicianStatus from "./pages/TechnicianStatus";

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isStatusChange = location.pathname === "/tickets";

  return (
    <div className={` ${isLoginPage ? 'bg-blue-300 h-screen' : 'bg-gray-100'}`}>
    {/* {!isLoginPage&& !isStatusChange&&(<> <Navbar/> </>)} */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addTicket" element={<AddTicket />} />
        <Route path="/ticketList" element={<TicketList />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/tickets/:ticketId/:statusId" element={<TechnicianStatus />} />
      </Routes>
    </div>
  );
};

export default App;
