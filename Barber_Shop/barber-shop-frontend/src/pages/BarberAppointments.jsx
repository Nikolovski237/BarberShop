import { useState, useEffect } from "react";
import axios from "../api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function BarberAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [filterDate, setFilterDate] = useState("");

    useEffect(() => {
        axios.get("/appointments").then(res => setAppointments(res.data));
    }, []);

    const handleStatusChange = async (id, status) => {
        await axios.put(`/appointments/${id}/status`, `"${status}"`, {
            headers: { "Content-Type": "application/json" }
        });
        const updated = await axios.get("/appointments");
        setAppointments(updated.data);
    };

    const filtered = filterDate
        ? appointments.filter(a => a.appointmentDateTime.startsWith(filterDate))
        : appointments;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Barber Appointments</h2>
            <div className="mb-6">
                <Label>Filter by date</Label>
                <input
                    type="date"
                    className="w-full p-2 mt-1 border rounded"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <p className="text-gray-500">No appointments found.</p>
            ) : (
                <div className="space-y-4">
                    {filtered.map((a) => {
                        const date = new Date(a.appointmentDateTime);
                        return (
                            <Card key={a.id} className="shadow-md">
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold">{a.customerName}</h3>
                                    <p className="text-sm text-gray-500">{a.customerPhone}</p>
                                    <p className="text-sm mt-1">
                                        {date.toLocaleDateString()} @ {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                    <div className="mt-2">
                                        <Label>Status</Label>
                                        <Select value={a.status} onValueChange={(value) => handleStatusChange(a.id, value)}>
                                            <SelectTrigger className="mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Confirmed">Confirmed</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
