import { useState, useEffect } from "react";
import axios from "../api/axios";

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

        if (!barberId || !date || !selectedTime || !name || !phone) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            await axios.post("/appointments", {
                barberId,
                appointmentDateTime: new Date(`${date}T${selectedTime}`).toISOString(),
                customerName: name,
                customerPhone: phone
            });
            alert("Booked!");
        } catch (err) {
            console.error("❌ Booking failed:", err.response?.data || err.message);
            alert("Booking failed. See console.");
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <h2>Book Appointment</h2>

            <select value={barberId} onChange={(e) => setBarberId(e.target.value)}>
                <option value="">Select barber</option>
                {barbers.map(b => (
                    <option key={b.id} value={b.id}>{b.fullName}</option>
                ))}
            </select>

            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                <option value="">Pick a slot</option>
                {slots.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                ))}
            </select>

            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />

            <button>Book</button>
        </form>
    );
}
