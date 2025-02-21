import { useState } from "react";
import db from "../db.json";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsConnected }) => { 

    const [form, setForm] = useState({
        login: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const users = db.users; // Ensure users is an array
        if (Array.isArray(users)) {
            users.map((user) => {
                if (user.email === form.login && user.password === form.password) {
                    setIsConnected({ status: true, role: user.role, id: user.id });
                    navigate(`/${user.role}/${user.id}`);
                }
            });
        } else {
            console.error("Users data is not an array");
        }
    };

    return (
<div style={{ 
    width: "300px", 
    margin: "20px auto", 
    padding: "20px", 
    border: "1px solid #ddd", 
    borderRadius: "8px", 
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", 
    textAlign: "center",
    backgroundColor: "#f9f9f9"
}}>
    <input 
        type="text" 
        placeholder="Username" 
        onChange={(e) => setForm({ ...form, login: e.target.value })} 
        style={{
            width: "90%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "16px"
        }}
    />

    <input 
        type="password" 
        placeholder="Password" 
        onChange={(e) => setForm({ ...form, password: e.target.value })} 
        style={{
            width: "90%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "16px"
        }}
    />

    <button 
        onClick={handleLogin} 
        style={{
            width: "100px",
            height: "40px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
        }}
    >
        Login
    </button>
</div>

    );
}

export default Login;