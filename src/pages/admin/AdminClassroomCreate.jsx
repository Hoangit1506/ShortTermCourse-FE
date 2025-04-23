// src/pages/admin/AdminClassroomCreate.jsx
import { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, MenuItem, FormControl,
    InputLabel, Select, Button, CircularProgress
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminClassroomCreate() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';

    // Form state
    const [form, setForm] = useState({
        categoryId: '',
        courseId: '',
        lecturerId: '',
        name: '',
        startDate: '',
        endDate: '',
        place: '',
        capacity: ''
    });
    const [categories, setCategories] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [allLecturers, setAllLecturers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load master data
    useEffect(() => {
        api.get('/api/categories?size=100')
            .then(r => setCategories(r.data.data.content));
        api.get('/api/courses?size=100')
            .then(r => setAllCourses(r.data.data.content));
        api.get('/api/lecturers?size=100')
            .then(r => setAllLecturers(r.data.data.content));
    }, []);

    // Filter courses & lecturers when category changes
    useEffect(() => {
        if (!form.categoryId) {
            setCourses(allCourses);
            setLecturers(allLecturers);
        } else {
            setCourses(allCourses.filter(c => c.categoryId === form.categoryId));
            setLecturers(allLecturers.filter(l => l.specializationIds?.includes(form.categoryId)));
        }
        // clear dependent selections
        setForm(f => ({ ...f, courseId: '', lecturerId: '' }));
    }, [form.categoryId, allCourses, allLecturers]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async () => {
        // Basic validation
        const { name, courseId, lecturerId, startDate, endDate, place, capacity } = form;
        if (!name || !courseId || !lecturerId || !startDate || !endDate || !place || !capacity) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                name,
                courseId,
                lecturerId,
                startDate,
                endDate,
                place,
                capacity: parseInt(capacity, 10)
            };
            await api.post('/api/classrooms/create', payload);
            alert('Tạo lớp học thành công!');
            navigate('/admin/classrooms' + qs);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Tạo lớp thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">Thêm Lớp Học Mới</Typography>
            <FormControl fullWidth margin="dense">
                <InputLabel>Chuyên ngành</InputLabel>
                <Select
                    name="categoryId"
                    value={form.categoryId}
                    label="Chuyên ngành"
                    onChange={handleChange}
                >
                    <MenuItem value=""><em>All</em></MenuItem>
                    {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
                <InputLabel>Khóa học</InputLabel>
                <Select
                    name="courseId"
                    value={form.courseId}
                    label="Khóa học"
                    onChange={handleChange}
                >
                    <MenuItem value=""><em>All</em></MenuItem>
                    {courses.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
                <InputLabel>Giảng viên</InputLabel>
                <Select
                    name="lecturerId"
                    value={form.lecturerId}
                    label="Giảng viên"
                    onChange={handleChange}
                >
                    <MenuItem value=""><em>All</em></MenuItem>
                    {lecturers.map(l => <MenuItem key={l.id} value={l.id}>{l.displayName}</MenuItem>)}
                </Select>
            </FormControl>
            <TextField
                label="Tên lớp"
                name="name"
                fullWidth
                margin="dense"
                value={form.name}
                onChange={handleChange}
            />
            <TextField
                label="Ngày bắt đầu"
                type="date"
                name="startDate"
                fullWidth margin="dense"
                InputLabelProps={{ shrink: true }}
                value={form.startDate}
                onChange={handleChange}
            />
            <TextField
                label="Ngày kết thúc"
                type="date"
                name="endDate"
                fullWidth margin="dense"
                InputLabelProps={{ shrink: true }}
                value={form.endDate}
                onChange={handleChange}
            />
            <TextField
                label="Địa điểm"
                name="place"
                fullWidth
                margin="dense"
                value={form.place}
                onChange={handleChange}
            />
            <TextField
                label="Sức chứa"
                name="capacity"
                type="number"
                fullWidth
                margin="dense"
                inputProps={{ min: 1 }}
                value={form.capacity}
                onChange={handleChange}
            />
            <Box mt={3}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Tạo'}
                </Button>
                <Button
                    sx={{ ml: 2 }}
                    variant="outlined"
                    onClick={() => navigate('/admin/classrooms' + qs)}
                >
                    Hủy
                </Button>
            </Box>
        </Box>
    );
}
