// src/pages/ClassroomDetail.jsx
import React, { useState, useEffect } from 'react';
import {
    Container, Box, Paper, Typography, Divider,
    Button, CircularProgress, Stack, CardMedia,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
    useParams,
    useNavigate,
    Link as RouterLink,
    useSearchParams
} from 'react-router-dom';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/auth';
import api from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ClassroomDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // lấy query‑params cũ bên OpenCourses
    const [searchParams] = useSearchParams();
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';

    const [cls, setCls] = useState(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(true);
    const [registered, setRegistered] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // 1️⃣ Load thông tin lớp
    useEffect(() => {
        api.get(`/api/classrooms/${id}`)
            .then(res => setCls(res.data.data))
            .catch(() => setCls(null))
            .finally(() => setLoading(false));
    }, [id]);

    // 2️⃣ Load thông tin khóa học
    useEffect(() => {
        if (!cls) return;
        api.get(`/api/courses/${cls.courseId}`)
            .then(res => setCourse(res.data.data))
            .catch(() => setCourse(null));
    }, [cls]);

    // 3️⃣ Kiểm tra xem user đã đăng ký chưa
    useEffect(() => {
        if (!user) {
            setChecking(false);
            return;
        }
        api.get('/api/members/check', { params: { classroomId: id } })
            .then(res => setRegistered(res.data.data.registered))
            .catch(() => setRegistered(false))
            .finally(() => setChecking(false));
    }, [id, user]);

    // 4️⃣ Tính xem đã quá hạn đăng ký không?
    const expired = cls
        ? dayjs().isAfter(dayjs(cls.startDate), 'day')
        : false;

    const handleConfirmRegister = async () => {
        setSubmitting(true);
        try {
            await api.post('/api/members', { classroomId: id });
            // reload lớp to update enrolled
            const clsRes = await api.get(`/api/classrooms/${id}`);
            setCls(clsRes.data.data);
            setRegistered(true);
            setDialogOpen(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    // loading / not found
    if (loading) {
        return <>
            <Header />
            <Box textAlign="center" mt={6}><CircularProgress /></Box>
            <Footer />
        </>;
    }
    if (!cls) {
        return <>
            <Header />
            <Box textAlign="center" mt={6}>
                <Typography color="error">Không tìm thấy lớp này.</Typography>
            </Box>
            <Footer />
        </>;
    }

    return (
        <>
            <Header />
            <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
                <Paper sx={{ p: 4 }} elevation={3}>

                    {/* ===== Thông tin Lớp ===== */}
                    <Typography variant="h5" fontWeight="bold" color="primary">
                        Thông tin Lớp học
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={2}>
                        {[
                            ['Tên lớp', cls.name],
                            ['Giảng viên', cls.lecturerName],
                            ['Ngày bắt đầu', dayjs(cls.startDate).format('DD/MM/YYYY')],
                            ['Ngày kết thúc', dayjs(cls.endDate).format('DD/MM/YYYY')],
                            ['Địa điểm', cls.place],
                            ['Sức chứa', cls.capacity],
                            ['Đã đăng ký', cls.enrolled],
                        ].map(([label, value]) => (
                            <Box key={label}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {label}
                                </Typography>
                                <Typography variant="body1">{value}</Typography>
                            </Box>
                        ))}
                    </Stack>

                    {/* ===== Nút hành động ===== */}
                    <Box mt={4} textAlign="center">
                        {checking ? (
                            <CircularProgress size={24} />
                        ) : registered ? (
                            <Typography color="success.main" fontWeight="bold">
                                Bạn đã đăng ký lớp này
                            </Typography>
                        ) : expired ? (
                            <Typography color="warning.main" fontWeight="bold">
                                Đã quá hạn đăng ký lớp này
                            </Typography>
                        ) : cls.enrolled >= cls.capacity ? (
                            <Typography color="error" fontWeight="bold">
                                Lớp đã đầy
                            </Typography>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setDialogOpen(true)}
                            >
                                Đăng ký
                            </Button>
                        )}

                        {/* luôn hiện nút Quay lại giữ nguyên filter/pagination */}
                        &nbsp;
                        <Button
                            variant="outlined"
                            component={RouterLink}
                            to={`/courses/open-course${qs}`}
                        >
                            Quay lại
                        </Button>
                    </Box>

                    {/* ===== Dialog xác nhận ===== */}
                    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                        <DialogTitle>Xác nhận đăng ký</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Bạn chắc chắn muốn đăng ký lớp <strong>{cls.name}</strong>?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setDialogOpen(false)}
                                disabled={submitting}
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleConfirmRegister}
                                disabled={submitting}
                            >
                                {submitting ? 'Đang xử lý…' : 'Xác nhận'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* ===== Thông tin Khóa học ===== */}
                    <Box mt={4}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h5" fontWeight="bold" color="primary">
                            Thông tin Khóa học
                        </Typography>

                        {course ? (
                            <Stack spacing={2}>
                                {/* Ảnh bìa */}
                                <CardMedia
                                    component="img"
                                    image={course.thumbnail || '/placeholder.png'}
                                    alt={course.name}
                                    sx={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 1 }}
                                />

                                {/* Tên */}
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Tên khóa học
                                    </Typography>
                                    <Typography variant="body1">{course.name}</Typography>
                                </Box>

                                {/* Chuyên ngành */}
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Chuyên ngành
                                    </Typography>
                                    <Typography variant="body1">{course.categoryName}</Typography>
                                </Box>

                                {/* Giá */}
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Giá
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                            maximumFractionDigits: 0
                                        }).format(course.price)}
                                    </Typography>
                                </Box>

                                {/* Đối tượng phù hợp */}
                                {course.suitable && (
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Đối tượng phù hợp
                                        </Typography>
                                        <Typography variant="body1">{course.suitable}</Typography>
                                    </Box>
                                )}

                                {/* Mô tả */}
                                {course.description && (
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Mô tả
                                        </Typography>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                            {course.description}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Nội dung khóa học */}
                                {course.content && (
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Nội dung khóa học
                                        </Typography>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                            {course.content}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Video giới thiệu */}
                                {course.promoVideo && (
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                                            Video giới thiệu
                                        </Typography>
                                        <Box
                                            component="iframe"
                                            src={course.promoVideo}
                                            width="100%"
                                            height="360"
                                            sx={{ border: 0, borderRadius: 1 }}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </Box>
                                )}
                            </Stack>
                        ) : (
                            <Typography>Đang tải thông tin khóa học…</Typography>
                        )}
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </>
    );
}
