import { useEffect, useState } from "react";
import axios from "../api/axios";

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
            .catch(err => {
                alert("403: You are not authorized to view working hours.");
                console.error(err);
            });
    }, []);

    const handleChange = (i, field, value) => {
        const newHours = [...hours];
        if (field === "isClosed") {
            newHours[i][field] = value.target.checked;
        } else {
            newHours[i][field] = value;
        }
        setHours(newHours);
    };

    const save = async () => {
        try {
            await axios.post("/workinghours", hours);
            alert("Working hours saved!");
        } catch (err) {
            alert("Saving failed.");
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Set Working Hours</h2>
            <table>
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Open</th>
                        <th>Close</th>
                        <th>Closed?</th>
                    </tr>
                </thead>
                <tbody>
                    {hours.map((h, i) => (
                        <tr key={i}>
                            <td>{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][h.day]}</td>
                            <td>
                                <input
                                    type="time"
                                    value={h.openTime}
                                    onChange={(e) => handleChange(i, "openTime", e.target.value)}
                                    disabled={h.isClosed}
                                />
                            </td>
                            <td>
                                <input
                                    type="time"
                                    value={h.closeTime}
                                    onChange={(e) => handleChange(i, "closeTime", e.target.value)}
                                    disabled={h.isClosed}
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={h.isClosed}
                                    onChange={(e) => handleChange(i, "isClosed", e)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={save}>Save</button>
        </div>
    );
}
