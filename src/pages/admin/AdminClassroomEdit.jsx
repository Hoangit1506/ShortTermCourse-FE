// src/pages/admin/AdminClassroomEdit.jsx
import { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button, FormControl,
    InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import dayjs from 'dayjs';

export default function AdminClassroomEdit() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        lecturerId: '',
        startDate: '',
        endDate: '',
        place: '',
        capacity: 1,
    });

    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await api.get(`/api/classrooms/${id}`);
                const classroom = res.data.data;

                const courseRes = await api.get(`/api/courses/${classroom.courseId}`);
                const course = courseRes.data.data;
                const categoryId = course.categoryId;

                const lecRes = await api.get('/api/lecturers', { params: { size: 100 } });
                const allLecturers = lecRes.data.data.content;
                const filteredLecturers = allLecturers.filter(l =>
                    l.specializationIds?.includes(categoryId)
                );
                setLecturers(filteredLecturers);

                setForm({
                    name: classroom.name,
                    lecturerId: classroom.lecturerId,
                    startDate: dayjs(classroom.startDate).format('YYYY-MM-DD'),
                    endDate: dayjs(classroom.endDate).format('YYYY-MM-DD'),
                    place: classroom.place,
                    capacity: classroom.capacity,
                });
            } catch (err) {
                console.error(err);
                alert('Không thể tải dữ liệu lớp học');
                navigate('/admin/classrooms');
            }
        };

        loadData();
    }, [id, navigate]);

    const handleSubmit = async () => {
        if (!form.name || !form.lecturerId || !form.startDate || !form.endDate || !form.place) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }
        if (form.capacity < 1) {
            alert('Sức chứa phải lớn hơn 0');
            return;
        }

        setLoading(true);
        try {
            await api.put(`/api/classrooms/update/${id}`, form);
            alert('Cập nhật lớp học thành công');
            navigate('/admin/classrooms' + qs);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
                Chỉnh sửa lớp học
            </Typography>

            <TextField
                label="Tên lớp"
                fullWidth margin="dense"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <FormControl fullWidth margin="dense">
                <InputLabel>Giảng viên</InputLabel>
                <Select
                    value={form.lecturerId}
                    label="Giảng viên"
                    onChange={e => setForm({ ...form, lecturerId: e.target.value })}
                >
                    {lecturers.map(l => (
                        <MenuItem key={l.id} value={l.id}>{l.displayName}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label="Ngày bắt đầu"
                type="date"
                fullWidth margin="dense"
                value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
            />

            <TextField
                label="Ngày kết thúc"
                type="date"
                fullWidth margin="dense"
                value={form.endDate}
                onChange={e => setForm({ ...form, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
            />

            <TextField
                label="Địa điểm"
                fullWidth margin="dense"
                value={form.place}
                onChange={e => setForm({ ...form, place: e.target.value })}
            />

            <TextField
                label="Sức chứa"
                type="number"
                fullWidth margin="dense"
                inputProps={{ min: 1 }}
                value={form.capacity}
                onChange={e => setForm({ ...form, capacity: parseInt(e.target.value, 10) })}
            />

            <Box mt={3}>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Lưu'}
                </Button>
                <Button sx={{ ml: 2 }} variant="outlined" onClick={() => navigate('/admin/classrooms' + qs)}>
                    Hủy
                </Button>
            </Box>
        </Box>
    );
}
