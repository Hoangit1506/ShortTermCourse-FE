// src/pages/admin/AdminClassroomView.jsx
import { Box, Typography, Button, CircularProgress, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../api/axios';

export default function AdminClassroomView() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/classrooms/${id}`)
            .then(res => setData(res.data.data))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Box textAlign="center"><CircularProgress /></Box>;
    if (!data) return <Typography color="error">Không tìm thấy lớp học.</Typography>;

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
                Thông tin lớp học
            </Typography>

            <Stack spacing={2}>
                <InfoRow label="Tên lớp" value={data.name} />
                <InfoRow label="Khóa học" value={data.courseName} />
                <InfoRow label="Chuyên ngành" value={data.categoryName || '—'} />
                <InfoRow label="Giảng viên" value={data.lecturerName} />
                <InfoRow label="Địa điểm" value={data.place} />

                <Stack direction="row" spacing={4} justifyContent="space-between" sx={{ my: 1 }}>
                    <Box sx={{ width: '50%' }}>
                        <Typography fontWeight="bold">Ngày bắt đầu:</Typography>
                        <Typography>{dayjs(data.startDate).format('DD/MM/YYYY')}</Typography>
                    </Box>
                    <Box sx={{ width: '50%' }}>
                        <Typography fontWeight="bold">Ngày kết thúc:</Typography>
                        <Typography>{dayjs(data.endDate).format('DD/MM/YYYY')}</Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={4} justifyContent="space-between" sx={{ my: 1 }}>
                    <Box sx={{ width: '50%' }}>
                        <Typography fontWeight="bold">Sức chứa:</Typography>
                        <Typography>{data.capacity}</Typography>
                    </Box>
                    <Box sx={{ width: '50%' }}>
                        <Typography fontWeight="bold">Đã đăng ký:</Typography>
                        <Typography>{data.enrolled}</Typography>
                    </Box>
                </Stack>
            </Stack>

            <Box mt={4}>
                <Button
                    variant="contained"
                    onClick={() => navigate(`/admin/classrooms/edit/${id}${qs}`)}
                >
                    Chỉnh sửa
                </Button>
                <Button
                    variant="outlined"
                    sx={{ ml: 2 }}
                    onClick={() => navigate(`/admin/classrooms${qs}`)}
                >
                    Quay lại
                </Button>
            </Box>

            <Box mt={3}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(`/admin/classrooms/${id}/members`)}
                >
                    Xem thành viên lớp
                </Button>
            </Box>
        </Box>
    );
}

function InfoRow({ label, value }) {
    return (
        <Box display="flex">
            <Box width="40%" fontWeight="bold">{label}:</Box>
            <Box>{value}</Box>
        </Box>
    );
}
