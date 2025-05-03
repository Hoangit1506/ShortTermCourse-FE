// src/pages/admin/AdminLecturerView.jsx
import { useState, useEffect } from 'react';
import {
    Box, Typography, Avatar, Chip, Button, Divider, Grid
} from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import dayjs from 'dayjs';

export default function AdminLecturerView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { search } = useLocation();
    const qs = search;

    const [data, setData] = useState(null);

    useEffect(() => {
        api.get(`/api/lecturers/${id}`)
            .then(res => setData(res.data.data))
            .catch(console.error);
    }, [id]);

    if (!data) return <Typography>Đang tải...</Typography>;

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
                Thông tin chi tiết giảng viên
            </Typography>

            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                    src={data.avatar}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 1 }}
                />
                <Typography variant="h6">{data.displayName}</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography fontWeight="bold">Email:</Typography>
                    <Typography>{data.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography fontWeight="bold">Số điện thoại:</Typography>
                    <Typography>{data.phoneNumber || '—'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography fontWeight="bold">Ngày sinh:</Typography>
                    <Typography>
                        {data.dob ? dayjs(data.dob).format('DD/MM/YYYY') : '—'}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography fontWeight="bold">Chức vụ:</Typography>
                    <Typography>{data.position || '—'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography fontWeight="bold">Trình độ:</Typography>
                    <Typography>{data.degree || '—'}</Typography>
                </Grid>
            </Grid>

            <Box mt={3}>
                <Typography fontWeight="bold" mb={1}>Chuyên ngành:</Typography>
                {data.specializationNames.length > 0 ? (
                    data.specializationNames.map(name => (
                        <Chip
                            key={name}
                            label={name}
                            sx={{ mr: 1, mb: 1 }}
                        />
                    ))
                ) : (
                    <Typography>Không có chuyên ngành</Typography>
                )}
            </Box>

            <Box mt={4}>
                <Button
                    variant="contained"
                    sx={{ mr: 2 }}
                    onClick={() => navigate(`/admin/lecturers/edit/${id}${qs}`)}
                >
                    Chỉnh sửa
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate(`/admin/lecturers${qs}`)}
                >
                    Quay lại
                </Button>
            </Box>
        </Box>
    );
}
