import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5038/api",
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("🔐 Token attached:", token);
    } else {
        console.warn("⚠️ No token found in localStorage");
    }

    console.log("📡 Axios request:", config.method?.toUpperCase(), config.url);
    return config;
}, (error) => {
    console.error("❌ Axios request error", error);
    return Promise.reject(error);
});

export default instance;
