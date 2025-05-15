import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [role, setRole] = useState("Barber");

    useEffect(() => {
        axios.get("/account/all")
            .then(res => setUsers(res.data))
            .catch(err => {
                console.error("Failed to fetch users", err);
                alert("Failed to load user list.");
            });
    }, []);

    const promoteUser = async () => {
        if (!selectedUser || !role) return;

        try {
            await axios.post("/account/promote", {
                userId: selectedUser,
                role
            });
            alert("User promoted successfully!");
        } catch (err) {
            alert("Promotion failed.");
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Admin Panel</h2>
            <select onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="">Select user</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>
                        {user.fullName || user.email}
                    </option>
                ))}
            </select>

            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Customer">Customer</option>
                <option value="Barber">Barber</option>
                <option value="Admin">Admin</option>
            </select>

            <button onClick={promoteUser}>Promote</button>
        </div>
    );
}
