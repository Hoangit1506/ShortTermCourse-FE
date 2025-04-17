// src/pages/admin/CourseEdit.jsx
import { useState, useEffect } from 'react';
import {
    Box, Button, TextField, MenuItem,
    Typography, CircularProgress
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import api from '../../api/axios';

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export default function CourseEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { search } = useLocation();

    const [form, setForm] = useState({
        name: '',
        categoryId: '',
        suitable: '',
        description: '',
        content: '',
        price: '',
        // existing URLs
        thumbnail: '',
        promoVideo: '',
        // for new uploads
        thumbnailFile: null,
        thumbnailPreview: null,
        promoVideoFile: null,
        promoVideoPreview: null,
        thumbnailRemoved: false,
        videoRemoved: false,
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load categories + course data
    useEffect(() => {
        api.get('/api/categories?size=100')
            .then(res => setCategories(res.data.data.content))
            .catch(console.error);

        api.get(`/api/courses/${id}`)
            .then(res => {
                const c = res.data.data;
                setForm(f => ({
                    ...f,
                    name: c.name,
                    categoryId: c.categoryId,
                    suitable: c.suitable,
                    description: c.description,
                    content: c.content,
                    price: c.price,
                    thumbnail: c.thumbnail,
                    promoVideo: c.promoVideo,
                }));
            })
            .catch(console.error);
    }, [id]);

    // Cleanup object URLs
    useEffect(() => (
        () => {
            if (form.thumbnailPreview) URL.revokeObjectURL(form.thumbnailPreview);
            if (form.promoVideoPreview) URL.revokeObjectURL(form.promoVideoPreview);
        }
    ), [form.thumbnailPreview, form.promoVideoPreview]);

    // Delete existing thumbnail
    const handleDeleteThumbnail = async () => {
        if (!form.thumbnail) return;
        try {
            await api.delete('/api/uploads', { params: { url: form.thumbnail } });
            setForm(f => ({ ...f, thumbnail: '' }));
            alert('Thumbnail đã được xóa');
        } catch (e) {
            console.error('Failed to delete thumbnail', e);
            alert('Xóa thumbnail thất bại');
        }
    };

    // Delete existing video
    const handleDeleteVideo = async () => {
        if (!form.promoVideo) return;
        try {
            await api.delete('/api/uploads', { params: { url: form.promoVideo } });
            setForm(f => ({ ...f, promoVideo: '' }));
            alert('Video giới thiệu đã được xóa');
        } catch (e) {
            console.error('Failed to delete video', e);
            alert('Xóa video thất bại');
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1️⃣ Chuẩn bị payload metadata
            const payload = {
                name: form.name,
                categoryId: form.categoryId,
                suitable: form.suitable,
                description: form.description,
                content: form.content,
                price: form.price,
                // nếu user đánh dấu xóa và không chọn file mới -> clear URL
                ...(form.thumbnailRemoved && !form.thumbnailFile ? { thumbnail: '' } : {}),
                ...(form.videoRemoved && !form.promoVideoFile ? { promoVideo: '' } : {}),
            };

            // Gửi update metadata (bao gồm clear URL nếu cần)
            await api.put(`/api/courses/update/${id}`, payload);

            // 2️⃣ Nếu có file thumbnail mới -> upload, overwrite
            if (form.thumbnailFile) {
                // nếu trước đó đã có URL cũ và chưa xóa qua bước metadata, xóa thủ công
                if (form.thumbnail && !form.thumbnailRemoved) {
                    await api.delete('/api/uploads', { params: { url: form.thumbnail } });
                }
                const fd = new FormData(); fd.append('file', form.thumbnailFile);
                const newThumb = await api.post(
                    `/api/uploads/courses/${id}/thumbnail`, fd
                ).then(r => r.data.data);
                await api.put(`/api/courses/update/${id}`, { thumbnail: newThumb });
            }

            // 3️⃣ Nếu có file video mới -> upload, overwrite
            if (form.promoVideoFile) {
                if (form.promoVideo && !form.videoRemoved) {
                    await api.delete('/api/uploads', { params: { url: form.promoVideo } });
                }
                const fd2 = new FormData(); fd2.append('file', form.promoVideoFile);
                const newVid = await api.post(
                    `/api/uploads/courses/${id}/video`, fd2
                ).then(r => r.data.data);
                await api.put(`/api/courses/update/${id}`, { promoVideo: newVid });
            }

            alert('Khóa học đã được cập nhật!');
            navigate('/admin/courses' + search);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật!');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
                Chỉnh sửa khóa học
            </Typography>

            {/* Name */}
            <TextField
                label="Tên khóa học"
                fullWidth margin="dense"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
            />

            {/* Category */}
            <TextField
                label="Chuyên ngành" select fullWidth margin="dense"
                value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}
            >
                {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
            </TextField>

            {/* Price */}
            <TextField
                label="Giá (VND)" fullWidth type="number" margin="dense"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
            />

            {/* Markdown fields */}
            <Box mt={2}>
                <Typography fontWeight="bold">Đối tượng phù hợp (Markdown)</Typography>
                <MDEditor
                    value={form.suitable}
                    onChange={v => setForm({ ...form, suitable: v || '' })}
                />
            </Box>
            <Box mt={2}>
                <Typography fontWeight="bold">Mô tả (Markdown)</Typography>
                <MDEditor
                    value={form.description}
                    onChange={v => setForm({ ...form, description: v || '' })}
                />
            </Box>
            <Box mt={2}>
                <Typography fontWeight="bold">Nội dung khóa học (Markdown)</Typography>
                <MDEditor
                    value={form.content}
                    onChange={v => setForm({ ...form, content: v || '' })}
                />
            </Box>

            {/* Thumbnail upload */}
            <Box mt={2} sx={{ textAlign: 'center' }}>
                <Button variant="outlined" component="label">
                    Chọn ảnh thumbnail
                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={e => {
                            const file = e.target.files[0];
                            if (file) setForm(f => ({
                                ...f,
                                thumbnailFile: file,
                                thumbnailPreview: URL.createObjectURL(file)
                            }));
                        }}
                    />
                </Button>
                {form.thumbnailPreview ? (
                    <Box mt={1}>
                        <img src={form.thumbnailPreview} alt="Thumbnail Preview" style={{ width: '100%', maxWidth: 300, borderRadius: 8 }} />
                        <Button color="error" onClick={() => setForm(f => ({ ...f, thumbnailFile: null, thumbnailPreview: null }))}>
                            Hủy chọn mới
                        </Button>
                    </Box>
                ) : form.thumbnail ? (
                    <Box mt={1}>
                        <img src={form.thumbnail} alt="Current Thumbnail" style={{ width: '100%', maxWidth: 300, borderRadius: 8 }} />
                        <Button color="error" onClick={() =>
                            setForm(f => ({
                                ...f,
                                thumbnailRemoved: true,    // đánh dấu xóa
                                thumbnail: '',             // clear URL cũ
                                thumbnailFile: null,
                                thumbnailPreview: null
                            }))
                        }>
                            Xóa thumbnail
                        </Button>
                    </Box>
                ) : null}
            </Box>

            {/* Promo Video upload */}
            <Box mt={2} sx={{ textAlign: 'center' }}>
                <Button variant="outlined" component="label">
                    Chọn video giới thiệu
                    <input
                        hidden
                        type="file"
                        accept="video/*"
                        onChange={e => {
                            const file = e.target.files[0];
                            if (!file) return;
                            if (file.size > MAX_VIDEO_SIZE) {
                                alert('Video quá lớn (>100MB).');
                                return;
                            }
                            setForm(f => ({
                                ...f,
                                promoVideoFile: file,
                                promoVideoPreview: URL.createObjectURL(file)
                            }));
                        }}
                    />
                </Button>
                {form.promoVideoPreview ? (
                    <Box mt={1}>
                        <video src={form.promoVideoPreview} controls style={{ width: '100%', maxWidth: 300, borderRadius: 8 }} />
                        <Button color="error" onClick={() => setForm(f => ({ ...f, promoVideoFile: null, promoVideoPreview: null }))}>
                            Hủy chọn mới
                        </Button>
                    </Box>
                ) : form.promoVideo ? (
                    <Box mt={1}>
                        <video src={form.promoVideo} controls style={{ width: '100%', maxWidth: 300, borderRadius: 8 }} />
                        <Button color="error" onClick={() =>
                            setForm(f => ({
                                ...f,
                                videoRemoved: true,
                                promoVideo: '',
                                promoVideoFile: null,
                                promoVideoPreview: null
                            }))
                        }>
                            Xóa video
                        </Button>
                    </Box>
                ) : null}
            </Box>

            {/* Actions */}
            <Box mt={3}>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Lưu thay đổi'}
                </Button>
                <Button sx={{ ml: 2 }} variant="outlined"
                    onClick={() => navigate('/admin/courses' + search)}>
                    Quay lại
                </Button>
            </Box>
        </Box >
    );
}
