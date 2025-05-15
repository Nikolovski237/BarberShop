import { useState, useEffect } from "react";
import axios from "../api/axios";

export default function BarberAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [filterDate, setFilterDate] = useState("");

    const fetchAppointments = async () => {
        const res = await axios.get("/appointments");
        setAppointments(res.data);
    };

    useEffect(() => { fetchAppointments(); }, []);

    const handleStatusChange = async (id, status) => {
        await axios.put(`/appointments/${id}/status`, `"${status}"`, {
            headers: { "Content-Type": "application/json" }
        });
        fetchAppointments(); // Refresh after change
    };

    const filtered = filterDate
        ? appointments.filter(a => a.appointmentDateTime.startsWith(filterDate))
        : appointments;

    return (
        <div>
            <h2>My Appointments</h2>
            <label>Filter by date: </label>
            <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
            />

            {filtered.length === 0 ? (
                <p>No appointments.</p>
            ) : (
                <div className="appointments">
                    {filtered.map((a) => {
                        const date = new Date(a.appointmentDateTime);
                        return (
                            <div className={`card ${a.status.toLowerCase()}`} key={a.id}>
                                <h3>{a.customerName}</h3>
                                <p>{a.customerPhone}</p>
                                <p>{date.toLocaleDateString()} @ {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                                <p>Status:
                                    <select
                                        value={a.status}
                                        onChange={(e) => handleStatusChange(a.id, e.target.value)}
                                    >
                                        <option>Pending</option>
                                        <option>Confirmed</option>
                                        <option>Completed</option>
                                        <option>Cancelled</option>
                                    </select>
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

