// src/pages/admin/CourseView.jsx
import { useState, useEffect } from 'react';
import {
    Box, Button, Typography, CardMedia
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CourseView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { search } = useLocation();
    const [course, setCourse] = useState(null);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        api.get(`/api/courses/${id}`)
            .then(res => {
                const courseData = res.data.data;
                setCourse(courseData);
                if (courseData.categoryId) {
                    api.get(`/api/categories/${courseData.categoryId}`)
                        .then(c => setCategoryName(c.data.data.name));
                }
            })
            .catch(console.error);
    }, [id]);

    if (!course) return null;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
                Chi tiết khóa học
            </Typography>

            <Typography variant="h5" fontWeight="bold">Tên khóa học</Typography>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                {course.name}
            </Typography>

            {course.thumbnail && (
                <CardMedia
                    component="img"
                    image={course.thumbnail}
                    alt={course.name}
                    sx={{ maxWidth: '100%', borderRadius: 1, mb: 2 }}
                />
            )}

            <Typography variant="h6" fontWeight="bold">Chuyên ngành</Typography>
            <Typography sx={{ mb: 2 }}>{categoryName || 'Không xác định'}</Typography>

            <Typography variant="h6" fontWeight="bold">Giá</Typography>
            <Typography sx={{ mb: 2 }}>
                {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    maximumFractionDigits: 0
                }).format(course.price)}
            </Typography>

            {course.promoVideo && (
                <Box component="video" controls width="100%" sx={{ mb: 3 }}>
                    <source src={course.promoVideo} type="video/mp4" />
                </Box>
            )}

            <Typography variant="h6" fontWeight="bold">Đối tượng phù hợp</Typography>
            <Box sx={{ mb: 3 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {course.suitable || '—'}
                </ReactMarkdown>
            </Box>

            <Typography variant="h6" fontWeight="bold">Mô tả</Typography>
            <Box sx={{ mb: 3 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {course.description || '—'}
                </ReactMarkdown>
            </Box>

            <Typography variant="h6" fontWeight="bold">Nội dung chi tiết</Typography>
            <Box sx={{ mb: 3 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {course.content || '—'}
                </ReactMarkdown>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button variant="contained" onClick={() => navigate(`/admin/courses/edit/${course.id}` + search)}>
                    Chỉnh sửa
                </Button>
                <Button variant="outlined" onClick={() => navigate('/admin/courses' + search)}>
                    Quay lại
                </Button>
            </Box>
        </Box>
    );
}
