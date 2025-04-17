// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
import {
    Box, Button, TextField, Typography, Checkbox,
    FormControlLabel, Link, Divider, Alert
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuth } from "../contexts/auth";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const oauthError = searchParams.get("error");

    const [form, setForm] = useState({ email: "", password: "", remember: false });
    const [error, setError] = useState("");

    // nếu Google redirect ?error
    useEffect(() => {
        if (oauthError) setError("Bạn đã hủy đăng nhập Google.");
    }, [oauthError]);

    const handleChange = e => {
        const { name, value, checked, type } = e.target;
        setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        try {
            await login(form.email, form.password);
            navigate("/", { replace: true });  // hoặc trang bạn muốn
        } catch (err) {
            setError(err.response?.data?.message || "Đăng nhập thất bại");
        }
    };

    const handleGoogle = () => {
        // trỏ đúng endpoint OAuth2 của backend
        window.location.href = "http://localhost:8080/short-term-course/oauth2/authorization/google";
    };

    return (
        <Box maxWidth={400} mx="auto" mt={8} p={4} boxShadow={3} borderRadius={2}>
            <Typography variant="h5" mb={2} textAlign="center">Đăng nhập</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={form.remember}
                            onChange={handleChange}
                            name="remember"
                        />
                    }
                    label="Ghi nhớ đăng nhập"
                />
                <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
                    Đăng nhập
                </Button>
                <Divider sx={{ my: 2 }}>Hoặc</Divider>
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogle}
                >
                    Đăng nhập bằng Google
                </Button>
            </form>
            <Box mt={2} display="flex" justifyContent="space-between">
                <Link component={RouterLink} to="/register">Đăng ký</Link>
                <Link component={RouterLink} to="/forgot-password">Quên mật khẩu?</Link>
            </Box>
        </Box>
    );
}

