import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function WorkingHoursEditor() {
    const [hours, setHours] = useState([]);

    useEffect(() => {
        axios.get("/workinghours")
            .then(res => {
                if (res.data.length === 0) {
                    const defaultHours = Array.from({ length: 7 }, (_, i) => ({
                        day: i,
                        openTime: "09:00:00",
                        closeTime: "16:00:00",
                        isClosed: false
                    }));
                    setHours(defaultHours);
                } else {
                    setHours(res.data);
                }
            })
            .catch(() => alert("403: You are not authorized to view working hours."));
    }, []);

    const handleChange = (i, field, value) => {
        const updated = [...hours];
        updated[i][field] = field === "isClosed" ? value.target.checked : value;
        setHours(updated);
    };

    const save = async () => {
        try {
            await axios.post("/workinghours", hours);
            alert("Working hours saved!");
        } catch {
            alert("Saving failed.");
        }
    };

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <Card className="max-w-4xl mx-auto mt-8 p-6 shadow-lg rounded-xl">
            <CardContent>
                <h2 className="text-2xl font-bold mb-4">Set Working Hours</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">Day</th>
                                <th className="p-2">Open</th>
                                <th className="p-2">Close</th>
                                <th className="p-2">Closed?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hours.map((h, i) => (
                                <tr key={i} className="border-t text-center">
                                    <td className="p-2 text-left font-medium">{dayLabels[h.day]}</td>
                                    <td className="p-2">
                                        <Input
                                            type="time"
                                            value={h.openTime}
                                            onChange={(e) => handleChange(i, "openTime", e.target.value)}
                                            disabled={h.isClosed}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <Input
                                            type="time"
                                            value={h.closeTime}
                                            onChange={(e) => handleChange(i, "closeTime", e.target.value)}
                                            disabled={h.isClosed}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="checkbox"
                                            checked={h.isClosed}
                                            onChange={(e) => handleChange(i, "isClosed", e)}
                                            className="scale-125"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Button onClick={save} className="mt-6 w-full">Save Working Hours</Button>
            </CardContent>
        </Card>
    );
}
