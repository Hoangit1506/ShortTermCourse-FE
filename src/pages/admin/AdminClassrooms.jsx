// src/pages/admin/AdminClassrooms.jsx
import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, TextField, MenuItem,
    Table, TableHead, TableRow, TableCell, TableBody,
    TablePagination, Select, InputLabel, FormControl, IconButton
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import dayjs from 'dayjs';

export default function AdminClassrooms() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // URL params
    const keywordParam = searchParams.get('keyword') || '';
    const categoryParam = searchParams.get('categoryId') || '';
    const courseParam = searchParams.get('courseId') || '';
    const lecturerParam = searchParams.get('lecturerId') || '';
    const pageParam = parseInt(searchParams.get('page') || '0', 10);
    const sizeParam = parseInt(searchParams.get('size') || '10', 10);

    // State
    const [keyword, setKeyword] = useState(keywordParam);
    const [categoryId, setCategoryId] = useState(categoryParam);
    const [courseId, setCourseId] = useState(courseParam);
    const [lecturerId, setLecturerId] = useState(lecturerParam);
    const [page, setPage] = useState(pageParam);
    const [rowsPerPage, setRowsPerPage] = useState(sizeParam);

    const [classrooms, setClassrooms] = useState([]);
    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);

    const [allCourses, setAllCourses] = useState([]);
    const [allLecturers, setAllLecturers] = useState([]);

    // Load master data
    useEffect(() => {
        api.get('/api/categories?size=100')
            .then(res => setCategories(res.data.data.content));
    }, []);

    useEffect(() => {
        // 1️⃣ Load danh mục
        api.get('/api/categories?size=100')
            .then(r => setCategories(r.data.data.content))
            .catch(console.error);

        // 2️⃣ Load toàn bộ khóa học + giảng viên
        api.get('/api/courses', { params: { size: 100 } })
            .then(r => setAllCourses(r.data.data.content))
            .catch(console.error);
        api.get('/api/lecturers', { params: { size: 100 } })
            .then(r => setAllLecturers(r.data.data.content))
            .catch(console.error);
    }, []);

    // filtered lists
    useEffect(() => {
        if (!categoryId) {
            setCourses(allCourses);
            setLecturers(allLecturers);
        } else {
            setCourses(
                allCourses.filter(c => c.categoryId === categoryId)
            );
            setLecturers(
                allLecturers.filter(l =>
                    l.specializationIds?.includes(categoryId)
                )
            );
        }
        // reset con filters
        setCourseId('');
        setLecturerId('');
    }, [categoryId, allCourses, allLecturers]);


    // Fetch classrooms on filter change
    useEffect(() => {
        const params = { page, size: rowsPerPage };
        if (keyword) params.keyword = keyword;
        if (categoryId) params.categoryId = categoryId;
        if (courseId) params.courseId = courseId;
        if (lecturerId) params.lecturerId = lecturerId;
        setSearchParams(params, { replace: true });
        api.get('/api/classrooms/admin', { params })
            .then(res => {
                const data = res.data.data;
                setClassrooms(data.content);
                setTotal(data.totalElements);
            });
    }, [keyword, categoryId, courseId, lecturerId, page, rowsPerPage]);

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn chắc chắn muốn xóa lớp này?')) return;
        await api.delete(`/api/classrooms/delete/${id}`);
        // reload current filters
        const params = Object.fromEntries([...searchParams]);
        api.get('/api/classrooms/admin', { params })
            .then(res => {
                setClassrooms(res.data.data.content);
                setTotal(res.data.data.totalElements);
            });
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">Quản lý Lớp học</Typography>
            {/* filters row */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <TextField
                    label="Tìm theo tên lớp"
                    variant="outlined"
                    size="small"
                    value={keyword}
                    onChange={e => { setKeyword(e.target.value); setPage(0); }}
                />
                <FormControl size="small">
                    <InputLabel>Chuyên ngành</InputLabel>
                    <Select
                        value={categoryId}
                        label="Chuyên ngành"
                        onChange={e => { setCategoryId(e.target.value); setPage(0); }}
                        sx={{ minWidth: 160 }}
                    >
                        <MenuItem value=""><em>All</em></MenuItem>
                        {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl size="small">
                    <InputLabel>Khóa học</InputLabel>
                    <Select
                        value={courseId}
                        label="Khóa học"
                        onChange={e => { setCourseId(e.target.value); setPage(0); }}
                        sx={{ minWidth: 160 }}
                    >
                        <MenuItem value=""><em>All</em></MenuItem>
                        {courses.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl size="small">
                    <InputLabel>Giảng viên</InputLabel>
                    <Select
                        value={lecturerId}
                        label="Giảng viên"
                        onChange={e => { setLecturerId(e.target.value); setPage(0); }}
                        sx={{ minWidth: 160 }}
                    >
                        <MenuItem value=""><em>All</em></MenuItem>
                        {lecturers.map(l => <MenuItem key={l.id} value={l.id}>{l.displayName}</MenuItem>)}
                    </Select>
                </FormControl>
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="contained" onClick={() => navigate('/admin/classrooms/create' + (searchParams.toString() ? `?${searchParams.toString()}` : ''))}>
                    Thêm lớp mới
                </Button>
            </Box>

            {/* table */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Tên lớp</TableCell>
                        <TableCell>Khóa học</TableCell>
                        <TableCell>Giảng viên</TableCell>
                        <TableCell>Bắt đầu</TableCell>
                        <TableCell>Kết thúc</TableCell>
                        <TableCell>Sức chứa</TableCell>
                        <TableCell>Đã đăng ký</TableCell>
                        <TableCell align="right">Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {classrooms.map((row, idx) => (
                        <TableRow key={row.id}>
                            <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.courseName}</TableCell>
                            <TableCell>{row.lecturerName}</TableCell>
                            <TableCell>
                                {dayjs(row.startDate).format('DD/MM/YYYY')}
                            </TableCell>
                            <TableCell>
                                {dayjs(row.endDate).format('DD/MM/YYYY')}
                            </TableCell>
                            <TableCell>{row.capacity}</TableCell>
                            <TableCell>{row.enrolled}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => navigate(`/admin/classrooms/${row.id}` + (searchParams.toString() ? `?${searchParams.toString()}` : ''))}>
                                    <Visibility />
                                </IconButton>
                                <IconButton onClick={() => navigate(`/admin/classrooms/edit/${row.id}` + (searchParams.toString() ? `?${searchParams.toString()}` : ''))}>
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(row.id)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* pagination */}
            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Box>
    );
}
