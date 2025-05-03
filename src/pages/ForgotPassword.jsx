// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const handle = async e => {
        e.preventDefault();
        setErr(""); setMsg("");
        try {
            await api.post("/auth/forgot-password", { email });
            setMsg("Vui lòng kiểm tra email để nhận mã xác thực.");
        } catch (e) {
            setErr(e.response?.data?.message || "Lỗi gửi yêu cầu");
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={8} p={4} boxShadow={3} borderRadius={2}>
            <Typography variant="h5" mb={2} textAlign="center">Quên mật khẩu</Typography>
            {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
            {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
            <form onSubmit={handle}>
                <TextField
                    label="Email" type="email" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    fullWidth margin="normal"
                />
                <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
                    Gửi yêu cầu
                </Button>
            </form>
            <Box mt={2} textAlign="center">
                <Button onClick={() => navigate("/login")}>Quay lại Đăng nhập</Button>
            </Box>
        </Box>
    );
}
