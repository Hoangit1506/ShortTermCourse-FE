// src/pages/admin/AdminCourses.jsx
import { useState, useEffect } from 'react';
import {
    Box, Button, TextField, MenuItem, Table, TableHead, TableRow, TableCell,
    TableBody, IconButton, TablePagination, Typography, Avatar
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminCourses() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const keywordParam = searchParams.get('keyword') || '';
    const categoryParam = searchParams.get('categoryId') || '';
    const pageParam = parseInt(searchParams.get('page') || '0', 10);
    const rowsPerPageParam = parseInt(searchParams.get('size') || '10', 10);

    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState(keywordParam);
    const [selectedCategory, setSelectedCategory] = useState(categoryParam);
    const [page, setPage] = useState(pageParam);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageParam);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        api.get('/api/categories?size=100')
            .then(res => setCategories(res.data.data.content))
            .catch(console.error);
    }, []);

    useEffect(() => {
        const params = {};
        if (search) params.keyword = search;
        if (selectedCategory) params.categoryId = selectedCategory;
        if (page) params.page = page;
        if (rowsPerPage) params.size = rowsPerPage;
        setSearchParams(params, { replace: true });
        fetchCourses(params);
    }, [search, selectedCategory, page, rowsPerPage]);

    const fetchCourses = (params = {}) => {
        api.get('/api/courses', { params })
            .then(res => {
                setCourses(res.data.data.content);
                setTotalItems(res.data.data.totalElements);
            })
            .catch(console.error);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return;
        await api.delete(`/api/courses/delete/${id}`);
        fetchCourses(searchParams.toString() ? Object.fromEntries([...searchParams]) : {});
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', {
        style: 'currency', currency: 'VND', maximumFractionDigits: 0
    }).format(value);

    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';

    return (
        <Box>
            <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
                Quản lý khóa học
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <TextField
                    label="Tìm kiếm theo tên"
                    variant="outlined" size="small"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(0); }}
                />

                <TextField
                    select
                    variant="outlined"
                    label="Chuyên ngành"
                    size="small"
                    value={selectedCategory}
                    onChange={e => { setSelectedCategory(e.target.value); setPage(0); }}
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="">
                        <em>Tất cả chuyên ngành</em>
                    </MenuItem>
                    {categories.map(cat => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                </TextField>

                <Box sx={{ flexGrow: 1 }} />

                <Button variant="contained"
                    onClick={() => navigate('/admin/courses/create' + qs)}
                >
                    Tạo mới
                </Button>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Hình ảnh</TableCell>
                        <TableCell>Tên khóa học</TableCell>
                        <TableCell>Chuyên ngành</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell align="right">Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courses.map((course, idx) => (
                        <TableRow key={course.id}>
                            <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                            <TableCell>
                                <Avatar
                                    src={course.thumbnail}
                                    alt={course.name}
                                    variant="rounded"
                                    sx={{ width: 56, height: 56 }}
                                />
                            </TableCell>
                            <TableCell>{course.name}</TableCell>
                            <TableCell>{course.categoryName}</TableCell>
                            <TableCell>{formatCurrency(course.price)}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => navigate(`/admin/courses/${course.id}` + qs)}>
                                    <Visibility />
                                </IconButton>
                                <IconButton onClick={() => navigate(`/admin/courses/edit/${course.id}` + qs)}>
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(course.id)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <TablePagination
                component="div"
                count={totalItems}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Box>
    );
}
