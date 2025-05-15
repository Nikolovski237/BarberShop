import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function MyAppointments() {
    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = async () => {
        const res = await axios.get("/appointments");
        setAppointments(res.data);
    };

    const cancelAppointment = async (id) => {
        if (!confirm("Are you sure you want to cancel this appointment?")) return;
        await axios.delete(`/appointments/${id}`);
        fetchAppointments();
    };

    useEffect(() => { fetchAppointments(); }, []);

    return (
        <div>
            <h2>My Appointments</h2>
            {appointments.length === 0 ? (
                <p>You have no appointments.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Barber</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Cancel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(a => {
                            const date = new Date(a.appointmentDateTime);
                            return (
                                <tr key={a.id}>
                                    <td>{a.barberName}</td>
                                    <td>{date.toLocaleDateString()}</td>
                                    <td>{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                                    <td>{a.status}</td>
                                    <td>
                                        {a.status === "Pending" && (
                                            <button onClick={() => cancelAppointment(a.id)}>Cancel</button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
