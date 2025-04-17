// src/pages/OpenCourses.jsx
import { useState, useEffect } from "react";
import {
    Container, Box, Typography, Grid, Card, CardMedia,
    CardContent, Button, FormControl, InputLabel, Select,
    MenuItem, TextField
} from "@mui/material";
import { useAuth } from "../contexts/auth";
import Header from "../components/Header";
import Footer from '../components/Footer';
import api from "../api/axios";

export default function OpenCourses() {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState({
        categoryId: "",
        startDate: "",
        endDate: ""
    });
    const [classrooms, setClassrooms] = useState([]);

    // 1. Load danh sách chuyên ngành cho filter
    useEffect(() => {
        api.get("/api/categories?size=100")
            .then(res => setCategories(res.data.data.content))
            .catch(console.error);
    }, []);

    // 2. Mỗi khi filter thay đổi, gọi lại API
    useEffect(() => {
        fetchClassrooms();
    }, [filter]);

    function fetchClassrooms() {
        const params = {};
        if (filter.categoryId) params.categoryId = filter.categoryId;
        if (filter.startDate) params.startDate = filter.startDate;
        if (filter.endDate) params.endDate = filter.endDate;

        api.get("/api/classrooms", { params })
            .then(res => setClassrooms(res.data.data.content))
            .catch(console.error);
    }

    // 3. Xử lý thay đổi input
    const handleFilterChange = e => {
        const { name, value } = e.target;
        setFilter(f => ({ ...f, [name]: value }));
    };

    return (
        <>
            <Header />

            <Container sx={{ mt: 4, mb: 6 }}>
                <Typography variant="h4" gutterBottom color="primary">
                    Khóa học đang mở
                </Typography>

                {/* ===== Filters ===== */}
                <Box sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3,
                    alignItems: "center"
                }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Chuyên ngành</InputLabel>
                        <Select
                            label="Chuyên ngành"
                            name="categoryId"
                            value={filter.categoryId}
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            {categories.map(c => (
                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Từ ngày"
                        type="date"
                        name="startDate"
                        value={filter.startDate}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Đến ngày"
                        type="date"
                        name="endDate"
                        value={filter.endDate}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                    />

                    <Button variant="contained" onClick={fetchClassrooms}>
                        Lọc
                    </Button>
                </Box>

                {/* {classrooms.length === 0 ? (
                    <Typography variant="body1" sx={{ mt: 4 }}>
                        Hiện chưa có lớp nào đang mở.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {classrooms.map(…)}
                    </Grid>
                )} */}

                {/* ===== List of Classrooms ===== */}
                <Grid container spacing={3}>
                    {classrooms.map(cl => (
                        <Grid item xs={12} sm={6} md={4} key={cl.id}>
                            <Card
                                elevation={3}
                                sx={{
                                    borderRadius: 2,
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    ":hover": { boxShadow: 6 }
                                }}
                            >
                                {/* Thumbnail từ course */}
                                {/* {cl.course.thumbnail && ( */}
                                {/* {(cl.course?.thumbnail ?? "").length > 0 ? (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={cl.course.thumbnail}
                                        alt={cl.course.name}
                                    />
                                    // )}
                                ) : (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image="/placeholder.png"      // ảnh mặc định
                                        alt="No image"
                                    />
                                )} */}

                                {/* Thumbnail */}
                                {cl.courseThumbnail
                                    ? (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={cl.courseThumbnail}
                                            alt={cl.courseName}
                                        />
                                    ) : (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image="/placeholder.png"
                                            alt="No image"
                                        />
                                    )}

                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {cl.name}
                                    </Typography>

                                    {/* <Typography variant="body2" color="text.secondary">
                                        <strong>Khóa:</strong> {cl.course.name}
                                    </Typography> */}
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Khóa:</strong> {cl.courseName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Thời gian:</strong> {cl.startDate} → {cl.endDate}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Địa điểm:</strong> {cl.place}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Số lượng:</strong> {cl.enrolled}/{cl.capacity}
                                    </Typography>
                                </CardContent>

                                {/* Button Đăng ký (chỉ USER) */}
                                {user?.role === "USER" && (
                                    <Box sx={{ p: 2 }}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            disabled={cl.enrolled >= cl.capacity}
                                            onClick={() => {
                                                api.post("/api/members", { classroomId: cl.id })
                                                    .then(() => {
                                                        alert("Đăng ký thành công");
                                                        fetchClassrooms();
                                                    })
                                                    .catch(err => {
                                                        alert(err.response?.data?.message || "Lỗi");
                                                    });
                                            }}
                                        >
                                            {cl.enrolled >= cl.capacity ? "Hết chỗ" : "Đăng ký"}
                                        </Button>
                                    </Box>
                                )}
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Footer />
        </>
    );
}
