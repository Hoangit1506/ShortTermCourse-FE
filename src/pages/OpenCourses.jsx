// src/pages/OpenCourses.jsx
import { useState, useEffect } from "react";
import {
    Container, Box, Typography, Grid, Card, CardMedia,
    CardContent, CardActions, CardActionArea, Button,
    FormControl, InputLabel, Select, MenuItem, TextField,
    TablePagination
} from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api/axios";

export default function OpenCourses() {
    const [searchParams, setSearchParams] = useSearchParams();

    // 1️⃣ Đọc query‑params (hoặc mặc định)
    const categoryParam = searchParams.get("categoryId") || "";
    const keywordParam = searchParams.get("keyword") || "";
    // const startParam = searchParams.get("startDate") || dayjs().format("YYYY-MM-DD");

    const startParam = searchParams.has("startDate")
        ? (searchParams.get("startDate") || "")
        : dayjs().format("YYYY-MM-DD");
    const endParam = searchParams.has("endDate")
        ? (searchParams.get("endDate") || "")
        : "";

    // const endParam = searchParams.get("endDate") || "";
    const pageParam = parseInt(searchParams.get("page") || "0", 10);
    const sizeParam = parseInt(searchParams.get("size") || "10", 10);

    // 2️⃣ Local state gắn với query‑params
    const [filter, setFilter] = useState({
        categoryId: categoryParam,
        keyword: keywordParam,
        startDate: startParam,
        endDate: endParam
    });
    const [page, setPage] = useState(pageParam);
    const [rowsPerPage, setRowsPerPage] = useState(sizeParam);
    const [classrooms, setClassrooms] = useState([]);
    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState([]);

    // 3️⃣ Load danh sách chuyên ngành (chỉ 1 lần)
    useEffect(() => {
        api.get("/api/categories?size=100")
            .then(res => setCategories(res.data.data.content))
            .catch(console.error);
    }, []);

    // 4️⃣ Mỗi khi filter/page/rowsPerPage thay đổi => cập nhật URL & fetch lại
    useEffect(() => {
        // a) Cập nhật query‑params
        const params = {
            page: page.toString(),
            size: rowsPerPage.toString()
        };
        if (filter.categoryId) params.categoryId = filter.categoryId;
        if (filter.keyword) params.keyword = filter.keyword;
        if (filter.startDate) params.startDate = filter.startDate;
        if (filter.endDate) params.endDate = filter.endDate;
        setSearchParams(params, { replace: true });

        // b) Gọi API
        api.get("/api/classrooms", { params })
            .then(res => {
                const { content, totalElements } = res.data.data;
                // client‑side sort theo khoảng cách tới ngày hôm nay, rồi tên
                const today = dayjs();
                content.sort((a, b) => {
                    const da = Math.abs(today.diff(dayjs(a.startDate), "day"));
                    const db = Math.abs(today.diff(dayjs(b.startDate), "day"));
                    if (da !== db) return da - db;
                    return a.name.localeCompare(b.name);
                });
                setClassrooms(content);
                setTotal(totalElements);
            })
            .catch(console.error);
    }, [filter, page, rowsPerPage, setSearchParams]);

    // 5️⃣ Handlers
    const handleFilterChange = e => {
        const { name, value } = e.target;
        setFilter(f => ({ ...f, [name]: value }));
        setPage(0);
    };
    const handlePageChange = (_, newPage) => setPage(newPage);
    const handleRowsPerPageChange = e => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <Header />
            <Container sx={{ mt: 4, mb: 6 }}>
                <Typography variant="h4" gutterBottom color="primary">
                    Danh sách lớp khóa học
                </Typography>

                {/* ===== Filters ===== */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3, alignItems: "center" }}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
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
                        size="small"
                        label="Từ ngày"
                        type="date"
                        name="startDate"
                        value={filter.startDate}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        size="small"
                        label="Đến ngày"
                        type="date"
                        name="endDate"
                        value={filter.endDate}
                        onChange={handleFilterChange}
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        size="small"
                        label="Tìm theo tên khóa học"
                        name="keyword"
                        value={filter.keyword}
                        onChange={handleFilterChange}
                    />
                </Box>

                {/* ===== Grid lớp ===== */}
                <Grid container spacing={3}>
                    {classrooms.map(cl => (
                        <Grid item xs={12} sm={6} md={4} key={cl.id}>
                            <Card elevation={3} sx={{
                                display: "flex", flexDirection: "column", height: "100%", borderRadius: 2,
                                ":hover": { boxShadow: 6 }
                            }}>
                                <CardActionArea
                                    component={RouterLink}
                                    to={`/classrooms/${cl.id}?${searchParams.toString()}`}
                                    sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={cl.courseThumbnail || "/placeholder.png"}
                                        alt={cl.courseName}
                                        height={160}
                                        sx={{ objectFit: "cover" }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                        <Typography
                                            variant="h6" gutterBottom
                                            sx={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                fontWeight: "bold",
                                                minHeight: 48
                                            }}
                                        >
                                            {cl.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {cl.courseName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {dayjs(cl.startDate).format("DD/MM/YYYY")} → {dayjs(cl.endDate).format("DD/MM/YYYY")}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {cl.enrolled}/{cl.capacity} chỗ
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>

                                {/* nếu vẫn muốn nút riêng */}
                                <CardActions sx={{ justifyContent: "center", p: 1 }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        component={RouterLink}
                                        to={`/classrooms/${cl.id}?${searchParams.toString()}`}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* ===== Pagination ===== */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={handlePageChange}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </Box>
            </Container>
            <Footer />
        </>
    );
}
