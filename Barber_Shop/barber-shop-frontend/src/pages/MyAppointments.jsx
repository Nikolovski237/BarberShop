import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function MyAppointments() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        axios.get("/appointments").then(res => {
            const sorted = res.data.sort((a, b) =>
                new Date(b.appointmentDateTime) - new Date(a.appointmentDateTime)
            );
            setAppointments(sorted);
        });
    }, []);

    const cancelAppointment = async (id) => {
        if (!confirm("Cancel this appointment?")) return;
        await axios.delete(`/appointments/${id}`);
        setAppointments(prev => prev.filter(a => a.id !== id));
    };

    const grouped = {
        Confirmed: [],
        Pending: [],
        Completed: [],
        Cancelled: []
    };

    appointments.forEach(a => {
        grouped[a.status]?.push(a);  // Avoid crash if unknown status
    });

    const renderGroup = (status, group) => (
        <>
            <h3 className="text-xl font-semibold mt-8 mb-2">{status} Appointments</h3>
            {group.length === 0 ? (
                <p className="text-gray-400">None</p>
            ) : (
                <table className="w-full border shadow rounded-xl overflow-hidden mb-6">
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
                        {group.map(a => {
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
        </>
    );

    return (
        <div className="max-w-5xl mx-auto mt-10 p-4">
            <h2 className="text-2xl font-bold mb-6">My Appointments</h2>
            {appointments.length === 0 ? (
                <p className="text-gray-500">You have no appointments.</p>
            ) : (
                <>
                    {renderGroup("Pending", grouped.Pending)}
                    {renderGroup("Confirmed", grouped.Confirmed)}
                    {renderGroup("Completed", grouped.Completed)}
                    {renderGroup("Cancelled", grouped.Cancelled)}
                </>
            )}
        </div>
    );
}
