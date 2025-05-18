import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function MyAppointments() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        axios.get("/appointments").then(res => setAppointments(res.data));
    }, []);

    const cancelAppointment = async (id) => {
        if (!confirm("Cancel this appointment?")) return;
        await axios.delete(`/appointments/${id}`);
        setAppointments(prev => prev.filter(a => a.id !== id));
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4">
            <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
            {appointments.length === 0 ? (
                <p className="text-gray-500">You have no appointments.</p>
            ) : (
                <table className="w-full border shadow rounded-xl overflow-hidden">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">Barber</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Time</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(a => {
                            const date = new Date(a.appointmentDateTime);
                            return (
                                <tr key={a.id} className="hover:bg-gray-50">
                                    <td className="p-3">{a.barberName}</td>
                                    <td className="p-3">{date.toLocaleDateString()}</td>
                                    <td className="p-3">{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                                    <td className="p-3">{a.status}</td>
                                    <td className="p-3">
                                        {a.status === "Pending" && (
                                            <button
                                                onClick={() => cancelAppointment(a.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Cancel
                                            </button>
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
