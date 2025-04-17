// src/pages/Register.jsx
import { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setError(""); setSuccess("");
        try {
            await api.post("/auth/register", { email, password });
            setSuccess("Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
        } catch (err) {
            setError(err.response?.data?.message || "Đăng ký thất bại");
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={8} p={4} boxShadow={3} borderRadius={2}>
            <Typography variant="h5" mb={2} textAlign="center">Đăng ký</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email" type="email" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    fullWidth margin="normal"
                />
                <TextField
                    label="Mật khẩu" type="password" required
                    value={password} onChange={e => setPassword(e.target.value)}
                    fullWidth margin="normal"
                />
                <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
                    Đăng ký
                </Button>
            </form>
            <Box mt={2} textAlign="center">
                <Button onClick={() => navigate("/login")}>Quay lại Đăng nhập</Button>
            </Box>
        </Box>
    );
}
