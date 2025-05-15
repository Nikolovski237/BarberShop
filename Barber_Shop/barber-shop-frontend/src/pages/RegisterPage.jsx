import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

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
        } catch (err) {
            alert("Registration failed");
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button>Register</button>
        </form>
    );
}
