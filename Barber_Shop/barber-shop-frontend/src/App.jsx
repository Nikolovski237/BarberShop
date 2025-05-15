import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookingPage from "./pages/BookingPage";
import MyAppointments from "./pages/MyAppointments";
import AdminPanel from "./pages/AdminPanel";
import BarberAppointments from "./pages/BarberAppointments";
import WorkingHoursEditor from "./pages/WorkingHoursEditor";
import PrivateRoute from "./auth/PrivateRoute";

function NavigateToDashboard() {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;

    if (user.role === "Admin") return <Navigate to="/admin" />;
    if (user.role === "Barber") return <Navigate to="/appointments-barber" />;
    return <Navigate to="/book" />;
}


export default function App() {
    const { user, logout } = useAuth();

    return (
        <BrowserRouter>
            <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
                {!user && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                {user && (
                    <>
                        <span>
                            Welcome, {user.name} ({user.role})
                        </span>
                        <button onClick={logout}>Logout</button>

                        {user.role === "Customer" && (
                            <>
                                <Link to="/book">Book</Link>
                                <Link to="/my-appointments">My Appointments</Link>
                            </>
                        )}

                        {user.role === "Barber" && (
                            <>
                                <Link to="/appointments-barber">My Schedule</Link>
                                <Link to="/working-hours">My Hours</Link>
                            </>
                        )}

                        {user.role === "Admin" && (
                            <>
                                <Link to="/admin">Admin Panel</Link>
                                <Link to="/working-hours">Global Hours</Link>
                            </>
                        )}
                    </>
                )}
            </nav>

            <Routes>
                {/* Public */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Auto-redirect dashboard on root */}
                <Route path="/" element={<NavigateToDashboard />} />

                {/* Customer-only pages */}
                <Route element={<PrivateRoute roles={["Customer"]} />}>
                    <Route path="/book" element={<BookingPage />} />
                    <Route path="/my-appointments" element={<MyAppointments />} />
                </Route>

                {/* Barber-only pages */}
                <Route element={<PrivateRoute roles={["Barber"]} />}>
                    <Route path="/appointments-barber" element={<BarberAppointments />} />
                    <Route path="/working-hours" element={<WorkingHoursEditor />} />
                </Route>

                {/* Admin-only pages */}
                <Route element={<PrivateRoute roles={["Admin"]} />}>
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/working-hours" element={<WorkingHoursEditor />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<h2>404 - Page Not Found</h2>} />
            </Routes>
        </BrowserRouter>
    );
}

