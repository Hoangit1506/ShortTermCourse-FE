// src/pages/admin/AdminLecturerCreate.jsx
import { useState, useEffect } from 'react';
import {
    Box, Button, TextField, MenuItem, Typography, CircularProgress,
    FormControl, InputLabel, Select, OutlinedInput, Avatar, Chip, IconButton
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Close';
import api from '../../api/axios';

export default function AdminLecturerCreate() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';

    const [form, setForm] = useState({
        email: '', password: '', displayName: '',
        dob: '',
        phoneNumber: '', position: '', degree: '',
        avatar: '', avatarFile: null, avatarPreview: null,
        specializationIds: [],
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/api/categories?size=100')
            .then(res => setCategories(res.data.data.content))
            .catch(console.error);
    }, []);

    useEffect(() => {
        return () => {
            if (form.avatarPreview) URL.revokeObjectURL(form.avatarPreview);
        };
    }, [form.avatarPreview]);

    const handleSubmit = async () => {
        if (form.specializationIds.length === 0) {
            alert('Phải chọn ít nhất một chuyên ngành');
            return;
        }

        setLoading(true);
        try {
            let avatarUrl = form.avatar;
            if (form.avatarFile) {
                const fd = new FormData();
                fd.append('file', form.avatarFile);
                avatarUrl = await api.post('/api/uploads/avatar', fd).then(r => r.data.data);
            }

            const payload = { ...form, avatar: avatarUrl };
            delete payload.avatarFile;
            delete payload.avatarPreview;

            await api.post('/api/lecturers/create', payload);
            alert('Giảng viên đã được tạo!');
            navigate('/admin/lecturers' + qs);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Tạo giảng viên thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
                Thêm giảng viên mới
            </Typography>

            <TextField
                label="Email" fullWidth margin="dense" type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <TextField
                label="Mật khẩu" fullWidth margin="dense" type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <TextField
                label="Họ tên" fullWidth margin="dense"
                value={form.displayName}
                onChange={e => setForm({ ...form, displayName: e.target.value })}
            />

            {/* Select chuyên ngành */}
            <FormControl fullWidth margin="dense">
                <InputLabel>Chuyên ngành</InputLabel>
                <Select
                    multiple
                    value={form.specializationIds}
                    onChange={e => setForm({ ...form, specializationIds: e.target.value })}
                    input={<OutlinedInput label="Chuyên ngành" />}
                >
                    {categories.map(cat => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Hiển thị chuyên ngành đã chọn với nút xóa riêng */}
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {form.specializationIds.map(id => {
                    const name = categories.find(c => c.id === id)?.name || id;
                    return (
                        <Chip
                            key={id}
                            label={name}
                            onDelete={() => setForm(f => ({
                                ...f,
                                specializationIds: f.specializationIds.filter(x => x !== id)
                            }))}
                            deleteIcon={<DeleteIcon />}
                        />
                    );
                })}
            </Box>

            <TextField
                label="Ngày sinh"
                type="date"
                fullWidth
                margin="dense"
                value={form.dob}
                onChange={e => setForm({ ...form, dob: e.target.value })}
                InputLabelProps={{ shrink: true }}
            />

            <TextField
                label="Số điện thoại"
                fullWidth
                margin="dense"
                value={form.phoneNumber}
                inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]{10}',
                    maxLength: 10
                }}
                onChange={e => {
                    const val = e.target.value;
                    if (/^\d{0,10}$/.test(val)) {
                        setForm({ ...form, phoneNumber: val });
                    }
                }}
            />

            <TextField
                label="Chức vụ" fullWidth margin="dense"
                value={form.position}
                onChange={e => setForm({ ...form, position: e.target.value })}
            />
            <TextField
                label="Trình độ" fullWidth margin="dense"
                value={form.degree}
                onChange={e => setForm({ ...form, degree: e.target.value })}
            />

            {/* Upload avatar */}
            <Box mt={2} sx={{ textAlign: 'center' }}>
                <Button variant="outlined" component="label">
                    Chọn ảnh đại diện
                    <input
                        hidden type="file" accept="image/*"
                        onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                                setForm(f => ({
                                    ...f,
                                    avatarFile: file,
                                    avatarPreview: URL.createObjectURL(file)
                                }));
                            }
                        }}
                    />
                </Button>

                {form.avatarPreview && (
                    <Box mt={1}>
                        <Avatar src={form.avatarPreview} sx={{ width: 120, height: 120, mx: 'auto' }} />
                        <Button color="error" onClick={() =>
                            setForm(f => ({ ...f, avatarFile: null, avatarPreview: null }))
                        }>
                            Hủy chọn
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Actions */}
            <Box mt={3}>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Lưu'}
                </Button>
                <Button sx={{ ml: 2 }} variant="outlined" onClick={() => navigate('/admin/lecturers' + qs)}>
                    Hủy
                </Button>
            </Box>
        </Box>
    );
}
