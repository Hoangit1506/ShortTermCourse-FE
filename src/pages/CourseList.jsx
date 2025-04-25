// src/pages/CourseList.jsx
import { useState, useEffect } from 'react';
import {
    Container, Box, Typography, Grid, Card, CardMedia,
    CardContent, CardActionArea, TextField, FormControl,
    InputLabel, Select, MenuItem, TablePagination
} from '@mui/material';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CourseList() {
    const [searchParams, setSearchParams] = useSearchParams();

    const keywordParam = searchParams.get("keyword") || "";
    const categoryIdParam = searchParams.get("categoryId") || "";
    const sortParam = searchParams.get("sort") || "asc";
    const pageParam = parseInt(searchParams.get("page") || "0", 10);
    const sizeParam = parseInt(searchParams.get("size") || "10", 10);

    const [filter, setFilter] = useState({
        keyword: keywordParam,
        categoryId: categoryIdParam,
        sort: sortParam
    });
    const [page, setPage] = useState(pageParam);
    const [rowsPerPage, setRowsPerPage] = useState(sizeParam);
    const [courses, setCourses] = useState([]);
    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.get('/api/categories?size=100')
            .then(res => setCategories(res.data.data.content))
            .catch(console.error);
    }, []);

    useEffect(() => {
        const params = {
            page,
            size: rowsPerPage,
            sort: `name,${filter.sort}`
        };
        if (filter.keyword) params.keyword = filter.keyword;
        if (filter.categoryId) params.categoryId = filter.categoryId;

        setSearchParams(params, { replace: true });

        api.get('/api/courses', { params })
            .then(res => {
                const { content, totalElements } = res.data.data;
                setCourses(content);
                setTotal(totalElements);
            })
            .catch(console.error);
    }, [filter, page, rowsPerPage]);

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
                    Danh sách khóa học
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    <TextField
                        size="small"
                        label="Tìm theo tên khóa học"
                        name="keyword"
                        value={filter.keyword}
                        onChange={handleFilterChange}
                        sx={{ minWidth: 200 }}
                    />

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Chuyên ngành</InputLabel>
                        <Select
                            name="categoryId"
                            value={filter.categoryId}
                            onChange={handleFilterChange}
                            label="Chuyên ngành"
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            {categories.map(c => (
                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>Sắp xếp</InputLabel>
                        <Select
                            name="sort"
                            value={filter.sort}
                            onChange={handleFilterChange}
                            label="Sắp xếp"
                        >
                            <MenuItem value="asc">Tên A → Z</MenuItem>
                            <MenuItem value="desc">Tên Z → A</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Grid container spacing={3}>
                    {courses.map(course => (
                        <Grid item xs={12} sm={6} md={4} key={course.id}>
                            <Card
                                component={RouterLink}
                                to={`/courses/${course.id}?${searchParams.toString()}`}
                                sx={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    borderRadius: 2,
                                    ":hover": { boxShadow: 6 }
                                }}
                            >
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={course.thumbnail || '/placeholder.png'}
                                        alt={course.name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom fontWeight="bold">
                                            {course.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" fontWeight="bold">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                                maximumFractionDigits: 0
                                            }).format(course.price)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

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
