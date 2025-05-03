// src/pages/user/UserClassroomDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Container, Typography, Box, Card, CardContent, Button, CircularProgress, Alert
} from "@mui/material";
import dayjs from "dayjs";
import api from "../../api/axios";

const learningStatusMap = {
    REGISTERED: 'Đã đăng ký',
    IN_PROGRESS: 'Đang học',
    COMPLETED: 'Hoàn thành',
    DROPPED: 'Đã hủy'
};

const tuitionStatusMap = {
    UNPAID: 'Chưa thanh toán',
    PAID: 'Đã thanh toán',
    REFUNDED: 'Đã hoàn tiền'
};

export default function UserClassroomDetail() {
    const { classroomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [classroom, setClassroom] = useState(null);
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        api.get(`/api/classrooms/${classroomId}`)
            .then(res => {
                console.log("Dữ liệu lớp học:", res.data.data);
                setClassroom(res.data.data);
                return api.get(`/api/members/my-courses`, {
                    params: { classroomId }
                });
            })
            .then(res => {
                console.log("Dữ liệu member:", res.data.data.content);
                const userMember = res.data.data.content.find(m => m.classroomId === classroomId);
                if (userMember) {
                    setMember(userMember);
                } else {
                    setError("Bạn chưa đăng ký lớp học này.");
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi khi tải dữ liệu:", err);
                if (err.response) {
                    console.log("Chi tiết lỗi từ server:", err.response.data);
                }
                setError("Không thể tải thông tin lớp học. Vui lòng thử lại sau.");
                setLoading(false);
            });
    }, [classroomId, navigate]);

    if (loading) {
        return (
            <Container sx={{ py: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    const handleCancel = () => {
        if (!window.confirm("Bạn có chắc muốn hủy đăng ký lớp này?")) return;
        api.delete(`/api/members/delete/${classroomId}`)
            .then(() => {
                navigate('/user/my-courses', {
                    state: {
                        keyword: location.state?.keyword || "",
                        page: location.state?.page || 0,
                        rowsPerPage: location.state?.rowsPerPage || 10
                    }
                });
            })
            .catch(error => {
                console.error("Lỗi khi hủy đăng ký:", error);
                alert("Hủy đăng ký thất bại!");
            });
    };

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                Chi tiết lớp học: {classroom.name}
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Thông tin của bạn</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ minWidth: 120, display: 'flex', justifyContent: 'center' }}>
                            {member.studentAvatar ? (
                                <img src={member.studentAvatar} alt={member.studentName} style={{ width: 100, height: 100, borderRadius: '50%' }} />
                            ) : (
                                <Typography color="textSecondary">Chưa có ảnh đại diện</Typography>
                            )}
                        </Box>
                        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                            <Typography sx={{ mb: 1 }}><strong>Tên:</strong> {member.studentName || 'Chưa có thông tin'}</Typography>
                            <Typography sx={{ mb: 1 }}><strong>Ngày sinh:</strong> {member.studentDob ? dayjs(member.studentDob).format('DD/MM/YYYY') : 'Chưa có thông tin'}</Typography>
                            <Typography sx={{ mb: 1 }}><strong>Email:</strong> {member.studentEmail || 'Chưa có thông tin'}</Typography>
                            <Typography sx={{ mb: 1 }}><strong>Số điện thoại:</strong> {member.studentPhone || 'Chưa có thông tin'}</Typography>
                            <Typography sx={{ mb: 1 }}><strong>Trạng thái học:</strong> {learningStatusMap[member.learningStatus] || 'Không xác định'}</Typography>
                            <Typography sx={{ mb: 1 }}><strong>Trạng thái học phí:</strong> {tuitionStatusMap[member.tuitionStatus] || 'Không xác định'}</Typography>
                            <Typography sx={{ mb: 1 }}><strong>Điểm số:</strong> {member.score != null ? member.score : 'Chưa có'}</Typography>
                        </Box>
                        <Box sx={{ minWidth: 120 }} />
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Thông tin lớp học</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Tên lớp:</strong> {classroom.name || 'Chưa có thông tin'}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Ngày bắt đầu:</strong> {classroom.startDate ? dayjs(classroom.startDate).format('DD/MM/YYYY') : 'Chưa có thông tin'}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Ngày kết thúc:</strong> {classroom.endDate ? dayjs(classroom.endDate).format('DD/MM/YYYY') : 'Chưa có thông tin'}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Địa điểm:</strong> {classroom.place || 'Chưa có thông tin'}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Số lượng đăng ký:</strong> {classroom.enrolled}/{classroom.capacity}</Typography>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Thông tin giảng viên</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ minWidth: 120, display: 'flex', justifyContent: 'center' }}>
                            {classroom.lecturerAvatar ? (
                                <img src={classroom.lecturerAvatar} alt={classroom.lecturerName} style={{ width: 100, height: 100, borderRadius: '50%' }} />
                            ) : (
                                <Typography color="textSecondary">Chưa có ảnh đại diện</Typography>
                            )}
                        </Box>
                        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                            <Typography sx={{ mb: 1 }}><strong>Tên:</strong> {classroom.lecturerName || 'Chưa có thông tin'}</Typography>
                            <Typography sx={{ mb: 1 }}><strong>Ngày sinh:</strong> {classroom.lecturerDob ? dayjs(classroom.lecturerDob).format('DD/MM/YYYY') : 'Chưa có thông tin'}</Typography>
                            <Typography sx={{ mb: 1 }}><strong>Email:</strong> {classroom.lecturerEmail || 'Chưa có thông tin'}</Typography>
                            <Typography sx={{ mb: 1 }}><strong>Số điện thoại:</strong> {classroom.lecturerPhone || 'Chưa có thông tin'}</Typography>
                        </Box>
                        <Box sx={{ minWidth: 120 }} />
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Thông tin khóa học</Typography>
                    {classroom.courseThumbnail ? (
                        <img src={classroom.courseThumbnail} alt={classroom.courseName} style={{ width: '100%', maxHeight: 300, objectFit: 'cover', mb: 2 }} />
                    ) : (
                        <Typography color="textSecondary" sx={{ mb: 2 }}>Chưa có hình ảnh khóa học</Typography>
                    )}
                    <Typography sx={{ mb: 1 }}><strong>Tên khóa học:</strong> {classroom.courseName || 'Chưa có thông tin'}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Giá:</strong> {classroom.coursePrice != null ? `${classroom.coursePrice} VND` : 'Chưa có thông tin'}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Chuyên ngành:</strong> {classroom.categoryName || 'Chưa có thông tin'}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Đối tượng phù hợp:</strong></Typography>
                    <Typography> {classroom.courseSuitable || 'Chưa có thông tin'}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Mô tả:</strong></Typography>
                    <Typography>{classroom.courseDescription || 'Chưa có thông tin'}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Nội dung:</strong></Typography>
                    <Typography>{classroom.courseContent || 'Chưa có thông tin'}</Typography>
                    {classroom.coursePromoVideo ? (
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ mb: 1 }}><strong>Video giới thiệu:</strong></Typography>
                            <video controls src={classroom.coursePromoVideo} style={{ width: '100%', maxHeight: 400 }} />
                        </Box>
                    ) : (
                        <Typography sx={{ mb: 1 }}><strong>Video giới thiệu:</strong> Chưa có video</Typography>
                    )}
                </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="contained"
                    onClick={() => navigate('/user/my-courses', {
                        state: {
                            keyword: location.state?.keyword || "",
                            page: location.state?.page || 0,
                            rowsPerPage: location.state?.rowsPerPage || 10
                        }
                    })}
                >
                    Quay lại danh sách
                </Button>
                {!dayjs().isAfter(dayjs(classroom.startDate), 'day') && (
                    <Button variant="outlined" color="error" onClick={handleCancel}>
                        Hủy đăng ký
                    </Button>
                )}
            </Box>
        </Container>
    );
}