// src/pages/admin/AdminLecturerEdit.jsx
import { useState, useEffect } from 'react';
import {
    Box, Button, TextField, Typography, CircularProgress,
    FormControl, InputLabel, Select, OutlinedInput, MenuItem,
    Chip, Avatar, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Close';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminLecturerEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { search } = useLocation();
    const qs = search;

    const [form, setForm] = useState({
        displayName: '',
        dob: '',
        phoneNumber: '',
        position: '',
        degree: '',
        avatar: '',
        avatarFile: null,
        avatarPreview: null,
        specializationIds: []
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/api/categories?size=100')
            .then(res => setCategories(res.data.data.content))
            .catch(console.error);

        api.get(`/api/lecturers/${id}`)
            .then(res => {
                const data = res.data.data;
                setForm({
                    displayName: data.displayName || '',
                    dob: data.dob || '',
                    phoneNumber: data.phoneNumber || '',
                    position: data.position || '',
                    degree: data.degree || '',
                    avatar: data.avatar || '',
                    avatarFile: null,
                    avatarPreview: null,
                    specializationIds: data.specializationIds || []
                });
            })
            .catch(console.error);
    }, [id]);

    useEffect(() => {
        return () => {
            if (form.avatarPreview) URL.revokeObjectURL(form.avatarPreview);
        };
    }, [form.avatarPreview]);

    const handleSubmit = async () => {
        if (!form.specializationIds.length) {
            alert('Phải chọn ít nhất một chuyên ngành');
            return;
        }
        setLoading(true);
        try {
            let avatarUrl = form.avatar;
            if (form.avatarFile) {
                const fd = new FormData();
                fd.append('file', form.avatarFile);
                avatarUrl = await api.post('/api/uploads/avatar', fd)
                    .then(r => r.data.data);
            }
            const payload = {
                displayName: form.displayName,
                dob: form.dob,
                phoneNumber: form.phoneNumber,
                position: form.position,
                degree: form.degree,
                avatar: avatarUrl,
                specializationIds: form.specializationIds
            };
            await api.put(`/api/lecturers/update/${id}`, payload);
            alert('Cập nhật thành công!');
            navigate('/admin/lecturers' + qs);
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
                Chỉnh sửa giảng viên
            </Typography>

            <TextField
                label="Họ tên"
                fullWidth
                margin="dense"
                value={form.displayName}
                onChange={e => setForm({ ...form, displayName: e.target.value })}
            />

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
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]{10}', maxLength: 10 }}
                onChange={e => {
                    const val = e.target.value;
                    if (/^\d{0,10}$/.test(val)) setForm({ ...form, phoneNumber: val });
                }}
            />

            <TextField
                label="Học vị"
                fullWidth
                margin="dense"
                value={form.degree}
                onChange={e => setForm({ ...form, degree: e.target.value })}
            />

            <TextField
                label="Vị trí"
                fullWidth
                margin="dense"
                value={form.position}
                onChange={e => setForm({ ...form, position: e.target.value })}
            />

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

            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {form.specializationIds.map(id => {
                    const cat = categories.find(c => c.id === id);
                    return (
                        <Chip
                            key={id}
                            label={cat?.name || id}
                            onDelete={() =>
                                setForm(f => ({
                                    ...f,
                                    specializationIds: f.specializationIds.filter(x => x !== id)
                                }))
                            }
                            deleteIcon={<DeleteIcon />}
                        />
                    );
                })}
            </Box>


            <Box mt={2} sx={{ textAlign: 'center' }}>
                <Button variant="outlined" component="label">
                    Chọn ảnh đại diện
                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                                setForm(f => ({ ...f, avatarFile: file, avatarPreview: URL.createObjectURL(file) }));
                            }
                        }}
                    />
                </Button>
                {(form.avatarPreview || form.avatar) && (
                    <Box mt={1}>
                        <Avatar
                            src={form.avatarPreview || form.avatar}
                            sx={{ width: 120, height: 120, mx: 'auto' }}
                        />
                        <Button color="error" onClick={() => setForm(f => ({
                            ...f,
                            avatarFile: null,
                            avatarPreview: null,
                            avatar: ''
                        }))}>
                            Xóa ảnh
                        </Button>
                    </Box>
                )}
            </Box>

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
