// src/pages/ClassroomDetail.jsx
import React, { useState, useEffect } from 'react';
import {
    Container, Box, Paper, Typography, Divider,
    Button, CircularProgress, Stack, CardMedia,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Snackbar, Alert as MuiAlert
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

    const [searchParams] = useSearchParams();
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';

    const [cls, setCls] = useState(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checking, setChecking] = useState(true);
    const [registered, setRegistered] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        api.get(`/api/classrooms/${id}`)
            .then(res => setCls(res.data.data))
            .catch(() => setCls(null))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!cls) return;
        api.get(`/api/courses/${cls.courseId}`)
            .then(res => setCourse(res.data.data))
            .catch(() => setCourse(null));
    }, [cls]);

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

    const expired = cls
        ? dayjs().isAfter(dayjs(cls.startDate), 'day')
        : false;

    const handleRegisterClick = () => {
        if (!user) {
            setLoginDialogOpen(true);
        } else {
            setDialogOpen(true);
        }
    };

    const handleConfirmRegister = async () => {
        setSubmitting(true);
        try {
            await api.post('/api/members', { classroomId: id });
            const clsRes = await api.get(`/api/classrooms/${id}`);
            setCls(clsRes.data.data);
            setRegistered(true);
            setDialogOpen(false);
            setSuccessMessage(`Đã đăng ký khóa học ${course?.name || ''} thành công`);
        } catch (err) {
            alert(err.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSuccessMessage('');
    };

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
                                onClick={handleRegisterClick}
                            >
                                Đăng ký
                            </Button>
                        )}

                        <Button
                            variant="outlined"
                            component={RouterLink}
                            to={`/courses/open-course${qs}`}
                            sx={{ ml: 2 }}
                        >
                            Quay lại
                        </Button>
                    </Box>

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

                    <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
                        <DialogTitle>Thông báo</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Bạn cần phải đăng nhập trước khi đăng ký khóa học.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setLoginDialogOpen(false)}>
                                Đóng
                            </Button>
                            <Button
                                variant="contained"
                                component={RouterLink}
                                to="/login"
                            >
                                Đăng nhập
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Snackbar
                        open={!!successMessage}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                    >
                        <MuiAlert
                            onClose={handleCloseSnackbar}
                            severity="success"
                            sx={{ width: '100%' }}
                        >
                            {successMessage}
                        </MuiAlert>
                    </Snackbar>

                    <Box mt={4}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h5" fontWeight="bold" color="primary">
                            Thông tin Khóa học
                        </Typography>

                        {course ? (
                            <Stack spacing={2}>
                                <CardMedia
                                    component="img"
                                    image={course.thumbnail || '/placeholder.png'}
                                    alt={course.name}
                                    sx={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 1 }}
                                />
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Tên khóa học
                                    </Typography>
                                    <Typography variant="body1">{course.name}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Chuyên ngành
                                    </Typography>
                                    <Typography variant="body1">{course.categoryName}</Typography>
                                </Box>
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
                                {course.suitable && (
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Đối tượng phù hợp
                                        </Typography>
                                        <Typography variant="body1">{course.suitable}</Typography>
                                    </Box>
                                )}
                                {course.description && (
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            fontWeight="bold"
                                        >
                                            Mô tả
                                        </Typography>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                            {course.description}
                                        </Typography>
                                    </Box>
                                )}
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