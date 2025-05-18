import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/account/register", { fullName, email, password });
            alert("Account created");
            navigate("/login");
        } catch {
            alert("Registration failed");
        }
    };

    return (
        <Card className="max-w-md mx-auto mt-20 shadow-lg p-6">
            <CardContent>
                <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    <Button type="submit" className="w-full">Create Account</Button>
                </form>
            </CardContent>
        </Card>
    );
}
