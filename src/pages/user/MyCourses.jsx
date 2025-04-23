// src/pages/user/MyCourses.jsx
import { useEffect, useState } from "react";
import {
    Container, Typography, Box, Grid, Card, CardContent, CardActions, Button,
    FormControl, InputLabel, Select, MenuItem, TextField, TablePagination
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../api/axios";

export default function MyCourses() {
    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState({ categoryId: "", keyword: "" });
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Load danh sách chuyên ngành
    useEffect(() => {
        api.get("/api/categories?size=100").then(res => {
            setCategories(res.data.data.content);
        });
    }, []);

    // Load danh sách lớp học đã đăng ký
    useEffect(() => {
        const params = {
            page,
            size: rowsPerPage,
            ...filter
        };
        api.get("/api/members/my-courses", { params }).then(res => {
            const { content, totalElements } = res.data.data;
            setData(content);
            setTotal(totalElements);
        });
    }, [filter, page, rowsPerPage]);

    // Hủy đăng ký lớp học
    const handleCancel = (classroomId) => {
        if (!window.confirm("Bạn có chắc muốn hủy đăng ký lớp này?")) return;
        api.delete(`/api/members/delete/${classroomId}`).then(() => {
            setData(d => d.filter(m => m.classroomId !== classroomId));
            setTotal(t => t - 1);
        });
    };

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom color="primary">
                Khóa học của tôi
            </Typography>

            {/* Bộ lọc */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Chuyên ngành</InputLabel>
                    <Select
                        label="Chuyên ngành"
                        value={filter.categoryId}
                        onChange={e => {
                            setFilter(f => ({ ...f, categoryId: e.target.value }));
                            setPage(0);
                        }}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        {categories.map(c => (
                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    size="small"
                    label="Tìm kiếm"
                    value={filter.keyword}
                    onChange={e => {
                        setFilter(f => ({ ...f, keyword: e.target.value }));
                        setPage(0);
                    }}
                />
            </Box>

            {/* Danh sách lớp học */}
            <Grid container spacing={3}>
                {data.map(m => {
                    const expired = dayjs().isAfter(dayjs(m.startDate), 'day');
                    return (
                        <Grid item xs={12} sm={6} md={4} key={m.classroomId}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{m.classroomName}</Typography>
                                    <Typography variant="body2">Khóa học: {m.courseName}</Typography>
                                    <Typography variant="body2">
                                        {dayjs(m.startDate).format('DD/MM/YYYY')} → {dayjs(m.endDate).format('DD/MM/YYYY')}
                                    </Typography>
                                    <Typography variant="body2">Địa điểm: {m.place}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        component={RouterLink}
                                        to={`/classrooms/${m.classroomId}`}
                                    >
                                        Xem thông tin
                                    </Button>
                                    {!expired && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="error"
                                            onClick={() => handleCancel(m.classroomId)}
                                        >
                                            Hủy đăng ký
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Phân trang */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={e => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Box>
        </Container>
    );
}
