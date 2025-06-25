import { Box } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserLogin from "./pages/user/UserLoginPage";
import AdminLogin from "./pages/admin/AdminLoginPage";
import AdminEventList from "./pages/admin/AdminEventList";
import AdminLayout from "./pages/admin/AdminLayout";
import UserHomePage from "./pages/user/UserHomePage";
import AdminUserList from "./pages/admin/AdminUserList";
import LogoutPage from "./pages/additional/LogoutPage";
import EventDetails from "./pages/user/EventDetails";
import AdminBookingsList from "./pages/admin/AdminBookingsList";
import DashboardPage from "./pages/admin/DashboardPage";
import UserTickets from "./pages/user/UserTickets";
import UserSignup from "./pages/user/UserSignUpPage";

const App = () => {
  return (
    <Box minH={"100vh"}>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/user/home" element={<UserHomePage />} />
        <Route path="/user/my-tickets" element={<UserTickets />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/event/:eventId" element={<EventDetails />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="events" element={<AdminEventList />} />
          <Route path="users" element={<AdminUserList />} />
          <Route path="event/:eventId" element={<AdminBookingsList />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
};

export default App;
