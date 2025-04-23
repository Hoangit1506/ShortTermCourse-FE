// src/pages/admin/AdminLecturers.jsx
import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Avatar, Table, TableHead, TableRow, TableCell,
    TableBody, TablePagination, IconButton, TextField, MenuItem
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminLecturers() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const keywordParam = searchParams.get('keyword') || '';
    const categoryParam = searchParams.get('categoryId') || '';
    const pageParam = parseInt(searchParams.get('page') || '0', 10);
    const sizeParam = parseInt(searchParams.get('size') || '10', 10);

    const [search, setSearch] = useState(keywordParam);
    const [selectedCategory, setSelectedCategory] = useState(categoryParam);
    const [page, setPage] = useState(pageParam);
    const [rowsPerPage, setRowsPerPage] = useState(sizeParam);

    const [lecturers, setLecturers] = useState([]);
    const [categories, setCategories] = useState([]);
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
        fetchLecturers(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, selectedCategory, page, rowsPerPage]);

    const fetchLecturers = (params = {}) => {
        api.get('/api/lecturers', { params })
            .then(res => {
                setLecturers(res.data.data.content);
                setTotalItems(res.data.data.totalElements);
            }).catch(console.error);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa giảng viên này?")) return;
        await api.delete(`/api/lecturers/delete/${id}`);
        fetchLecturers(Object.fromEntries([...searchParams]));
    };

    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';

    return (
        <Box>
            <Typography variant="h4" color="primary" gutterBottom fontWeight="bold">
                Quản lý giảng viên
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <TextField
                    label="Tìm kiếm theo tên"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(0); }}
                />
                <TextField
                    select
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
                <Button variant="contained" onClick={() => navigate('/admin/lecturers/create' + qs)}>
                    Thêm mới
                </Button>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Ảnh</TableCell>
                        <TableCell>Họ tên</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Điện thoại</TableCell>
                        <TableCell>Chuyên ngành</TableCell>
                        <TableCell align="right">Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {lecturers.map((lec, idx) => (
                        <TableRow key={lec.id}>
                            <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                            <TableCell>
                                <Avatar src={lec.avatar} alt={lec.displayName} />
                            </TableCell>
                            <TableCell>{lec.displayName}</TableCell>
                            <TableCell>{lec.email}</TableCell>
                            <TableCell>{lec.phoneNumber}</TableCell>
                            <TableCell>{lec.specializationNames?.join(', ')}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => navigate(`/admin/lecturers/${lec.id}` + qs)}>
                                    <Visibility />
                                </IconButton>
                                <IconButton onClick={() => navigate(`/admin/lecturers/edit/${lec.id}` + qs)}>
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(lec.id)}>
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
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={e => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Box>
    );
}
