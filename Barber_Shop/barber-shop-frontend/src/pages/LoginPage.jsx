import axios from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/account/login", { email, password });
            login(res.data.token);
            navigate("/");
            return; // ✅ prevents fallthrough
        } catch (err) {
            alert("Login failed");
            console.error(err);
        }
    };



    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button>Login</button>
        </form>
    );
}
