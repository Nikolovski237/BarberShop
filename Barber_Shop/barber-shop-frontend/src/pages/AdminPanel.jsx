import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [role, setRole] = useState("Barber");

    useEffect(() => {
        axios.get("/account/all")
            .then(res => setUsers(res.data))
            .catch(() => alert("Failed to load user list."));
    }, []);

    const promoteUser = async () => {
        if (!selectedUser || !role) return;
        try {
            await axios.post("/account/promote", { userId: selectedUser, role });
            alert("User promoted!");
        } catch {
            alert("Promotion failed.");
        }
    };

    return (
        <Card className="max-w-xl mx-auto mt-10 p-6 shadow-lg rounded-xl">
            <CardContent>
                <h2 className="text-2xl font-bold mb-4">Admin Panel: Promote Users</h2>

                <div className="space-y-4">
                    <Select onValueChange={setSelectedUser}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                            {users.map(user => (
                                <SelectItem key={user.id} value={user.id}>
                                    {user.fullName || user.email}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Customer">Customer</SelectItem>
                            <SelectItem value="Barber">Barber</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={promoteUser} className="w-full">Promote</Button>
                </div>
            </CardContent>
        </Card>
    );
}
