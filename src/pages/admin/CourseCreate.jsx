// src/pages/admin/CourseCreate.jsx
import { useState, useEffect } from 'react';
import {
    Box, Button, TextField, MenuItem,
    Typography, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import api from '../../api/axios';

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export default function CourseCreate() {
    const navigate = useNavigate();
    const initialForm = {
        name: '',
        categoryId: '',
        suitable: '',
        description: '',
        content: '',
        price: '',
        thumbnailFile: null,
        thumbnailPreview: null,
        promoVideoFile: null,
        promoVideoPreview: null
    };

    const [form, setForm] = useState(initialForm);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load categories
    useEffect(() => {
        api.get('/api/categories?size=100')
            .then(res => setCategories(res.data.data.content))
            .catch(console.error);
    }, []);

    // Cleanup object URLs
    useEffect(() => {
        return () => {
            if (form.thumbnailPreview) URL.revokeObjectURL(form.thumbnailPreview);
            if (form.promoVideoPreview) URL.revokeObjectURL(form.promoVideoPreview);
        };
    }, [form.thumbnailPreview, form.promoVideoPreview]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1️⃣ Tạo khóa học (metadata)
            const created = await api.post('/api/courses/create', {
                name: form.name,
                categoryId: form.categoryId,
                suitable: form.suitable,
                description: form.description,
                content: form.content,
                price: form.price
            }).then(r => r.data.data);

            alert('Khóa học đã được tạo! Tiếp tục upload hình ảnh và video...');

            // 2️⃣ Upload thumbnail nếu có
            if (form.thumbnailFile) {
                const fd = new FormData();
                fd.append('file', form.thumbnailFile);
                const thumbUrl = await api.post(`/api/uploads/courses/${created.id}/thumbnail`, fd)
                    .then(r => r.data.data);
                await api.put(`/api/courses/update/${created.id}`, { thumbnail: thumbUrl });
            }

            // 3️⃣ Upload promo video nếu có
            if (form.promoVideoFile) {
                if (form.promoVideoFile.size > MAX_VIDEO_SIZE) {
                    alert('Video quá lớn (>100MB), bỏ qua upload video.');
                } else {
                    try {
                        const fd2 = new FormData();
                        fd2.append('file', form.promoVideoFile);
                        const vidUrl = await api.post(`/api/uploads/courses/${created.id}/video`, fd2)
                            .then(r => r.data.data);
                        await api.put(`/api/courses/update/${created.id}`, { promoVideo: vidUrl });
                    } catch (videoErr) {
                        console.error('Video upload failed:', videoErr);
                        alert('Upload video thất bại: ' +
                            (videoErr.response?.data?.message || videoErr.message));
                    }
                }
            }

            alert('Tạo khóa học hoàn tất!');
            // Reset form để tạo tiếp
            setForm(initialForm);
        } catch (err) {
            console.error('Lỗi tạo khóa học:', err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo khóa học!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
                Tạo khóa học mới
            </Typography>

            <TextField
                label="Tên khóa học"
                fullWidth margin="dense"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <TextField
                label="Chuyên ngành" select fullWidth margin="dense"
                value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
            </TextField>

            <TextField
                label="Giá (VND)" fullWidth type="number" margin="dense"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
            />

            <Box mt={2}>
                <Typography variant="subtitle1" fontWeight="bold">Đối tượng phù hợp (Markdown)</Typography>
                <MDEditor value={form.suitable} onChange={v => setForm({ ...form, suitable: v || '' })} />
            </Box>

            <Box mt={2}>
                <Typography variant="subtitle1" fontWeight="bold">Mô tả khóa học (Markdown)</Typography>
                <MDEditor value={form.description} onChange={v => setForm({ ...form, description: v || '' })} />
            </Box>

            <Box mt={2}>
                <Typography variant="subtitle1" fontWeight="bold">Nội dung khóa học (Markdown)</Typography>
                <MDEditor value={form.content} onChange={v => setForm({ ...form, content: v || '' })} />
            </Box>

            {/* Upload thumbnail */}
            <Box mt={2} sx={{ textAlign: 'center' }}>
                <Button variant="outlined" component="label">
                    Chọn ảnh thumbnail
                    <input hidden type="file" accept="image/*"
                        onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                                setForm(f => ({
                                    ...f,
                                    thumbnailFile: file,
                                    thumbnailPreview: URL.createObjectURL(file)
                                }));
                            }
                        }}
                    />
                </Button>
                {form.thumbnailPreview && (
                    <Box mt={1}>
                        <img src={form.thumbnailPreview} alt="Thumbnail Preview"
                            style={{ width: '100%', maxWidth: 300, borderRadius: 8 }} />
                        <Button color="error" onClick={() =>
                            setForm(f => ({ ...f, thumbnailFile: null, thumbnailPreview: null }))
                        }>
                            Hủy
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Upload promo video */}
            <Box mt={2} sx={{ textAlign: 'center' }}>
                <Button variant="outlined" component="label">
                    Chọn video giới thiệu
                    <input hidden type="file" accept="video/*"
                        onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                                if (file.size > MAX_VIDEO_SIZE) {
                                    alert('Video quá lớn (>100MB). Vui lòng chọn file nhỏ hơn.');
                                    return;
                                }
                                setForm(f => ({
                                    ...f,
                                    promoVideoFile: file,
                                    promoVideoPreview: URL.createObjectURL(file)
                                }));
                            }
                        }}
                    />
                </Button>
                {form.promoVideoPreview && (
                    <Box mt={1}>
                        <video src={form.promoVideoPreview} controls
                            style={{ width: '100%', maxWidth: 300, borderRadius: 8 }} />
                        <Button color="error" onClick={() =>
                            setForm(f => ({ ...f, promoVideoFile: null, promoVideoPreview: null }))
                        }>
                            Hủy
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Actions */}
            <Box mt={3}>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Tạo khóa học'}
                </Button>
                <Button sx={{ ml: 2 }} variant="outlined" onClick={() => navigate('/admin/courses')}>
                    Quay lại
                </Button>
            </Box>
        </Box>
    );
}
