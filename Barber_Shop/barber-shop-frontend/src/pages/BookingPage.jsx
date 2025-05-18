import { useState, useEffect } from "react";
import axios from "../api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingPage() {
    const [barbers, setBarbers] = useState([]);
    const [barberId, setBarberId] = useState("");
    const [date, setDate] = useState("");
    const [slots, setSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        axios.get("/users?role=Barber")
            .then(res => setBarbers(res.data))
            .catch(err => console.error("Failed to load barbers", err));
    }, []);

    useEffect(() => {
        if (barberId && date) {
            axios.get(`/slots?barberId=${barberId}&date=${date}`).then(res => setSlots(res.data));
        }
    }, [barberId, date]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!barberId || !date || !selectedTime || !name || !phone) return alert("All fields required.");
        try {
            await axios.post("/appointments", {
                barberId,
                appointmentDateTime: new Date(`${date}T${selectedTime}`).toISOString(),
                customerName: name,
                customerPhone: phone
            });
            alert("Booked!");
        } catch (err) {
            console.error(err);
            alert("Booking failed.");
        }
    };

    return (
        <Card className="max-w-xl mx-auto mt-10 p-6 shadow-lg rounded-2xl">
            <CardContent>
                <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Choose a barber</Label>
                        <select value={barberId} onChange={(e) => setBarberId(e.target.value)} className="w-full p-2 border rounded">
                            <option value="">Select barber</option>
                            {barbers.map(b => <option key={b.id} value={b.id}>{b.fullName}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label>Date</Label>
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div>
                        <Label>Available time slots</Label>
                        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full p-2 border rounded">
                            <option value="">Pick a slot</option>
                            {slots.map((s, i) => <option key={i} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label>Your Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <Label>Phone Number</Label>
                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full">Book Now</Button>
                </form>
            </CardContent>
        </Card>
    );
}
