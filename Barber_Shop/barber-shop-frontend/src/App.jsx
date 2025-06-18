import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookingPage from "./pages/BookingPage";
import MyAppointments from "./pages/MyAppointments";
import AdminPanel from "./pages/AdminPanel";
import BarberAppointments from "./pages/BarberAppointments";
import WorkingHoursEditor from "./pages/WorkingHoursEditor";
import PrivateRoute from "./auth/PrivateRoute";
import { Button } from "./components/ui/button";

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
            <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <Link to="/" className="font-bold text-lg text-blue-600">BarberShop</Link>
                    {user?.role === "Customer" && (
                        <>
                            <Link to="/book" className="hover:underline">Book</Link>
                            <Link to="/my-appointments" className="hover:underline">My Appointments</Link>
                        </>
                    )}
                    {user?.role === "Barber" && (
                        <>
                            <Link to="/appointments-barber" className="hover:underline">My Schedule</Link>
                            <Link to="/working-hours" className="hover:underline">My Hours</Link>
                        </>
                    )}
                    {user?.role === "Admin" && (
                        <>
                            <Link to="/admin" className="hover:underline">Admin Panel</Link>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {!user && (
                        <>
                            <Link to="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Register</Button>
                            </Link>
                        </>
                    )}
                    {user && (
                        <>
                            <span className="text-sm text-gray-600">
                                Welcome, <strong>{user.name}</strong> ({user.role})
                            </span>
                            <Button onClick={logout} variant="destructive">Logout</Button>
                        </>
                    )}
                </div>
            </nav>

            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<NavigateToDashboard />} />

                {/* Customer */}
                <Route element={<PrivateRoute roles={["Customer"]} />}>
                    <Route path="/book" element={<BookingPage />} />
                    <Route path="/my-appointments" element={<MyAppointments />} />
                </Route>

                {/* Barber */}
                <Route element={<PrivateRoute roles={["Barber"]} />}>
                    <Route path="/appointments-barber" element={<BarberAppointments />} />
                    <Route path="/working-hours" element={<WorkingHoursEditor />} />
                </Route>

                {/* Admin */}
                <Route element={<PrivateRoute roles={["Admin"]} />}>
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/working-hours" element={<WorkingHoursEditor />} />
                </Route>

                <Route path="*" element={<h2 className="text-center mt-20 text-xl">404 - Page Not Found</h2>} />
            </Routes>
        </BrowserRouter>
    );
}
