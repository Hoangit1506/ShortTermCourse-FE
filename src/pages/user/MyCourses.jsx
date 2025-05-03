// src/pages/user/MyCourses.jsx
import { useEffect, useState } from "react";
import {
    Container, Typography, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, TablePagination, TextField, Alert
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
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

export default function MyCourses() {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(location.state?.page || 0);
    const [rowsPerPage, setRowsPerPage] = useState(location.state?.rowsPerPage || 10);
    const [keyword, setKeyword] = useState(location.state?.keyword || "");

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const params = { page, size: rowsPerPage, keyword: keyword || undefined };
        api.get("/api/members/my-courses", { params })
            .then(res => {
                console.log("Dữ liệu trả về:", res.data.data.content);
                const { content, totalElements } = res.data.data;
                setData(content);
                setTotal(totalElements);
            })
            .catch(error => {
                console.error("Lỗi khi tải dữ liệu:", error);
                if (error.response) {
                    console.log("Chi tiết lỗi từ server:", error.response.data);
                }
                alert("Không thể tải danh sách lớp học. Vui lòng thử lại!");
            });
    }, [page, rowsPerPage, keyword]);

    const handleCancel = (classroomId) => {
        if (!window.confirm("Bạn có chắc muốn hủy đăng ký lớp này?")) return;
        api.delete(`/api/members/delete/${classroomId}`)
            .then(() => {
                setData(d => d.filter(m => m.classroomId !== classroomId));
                setTotal(t => t - 1);
            })
            .catch(error => {
                console.error("Lỗi khi hủy đăng ký:", error);
                alert("Hủy đăng ký thất bại!");
            });
    };

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom color="primary">
                Lớp học của tôi
            </Typography>

            <Box sx={{ mb: 3 }}>
                <TextField
                    size="small"
                    label="Tìm kiếm theo tên lớp học"
                    value={keyword}
                    onChange={e => {
                        setKeyword(e.target.value);
                        setPage(0);
                    }}
                    sx={{ width: 300 }}
                />
            </Box>

            {data.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                    Bạn chưa đăng ký lớp khóa học nào!
                </Alert>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="danh sách lớp học">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Tên lớp học</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Giảng viên</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái học</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Học phí</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Điểm số</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((m, index) => {
                                    const expired = dayjs().isAfter(dayjs(m.startDate), 'day');
                                    return (
                                        <TableRow key={m.classroomId}>
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{m.classroomName}</TableCell>
                                            <TableCell>{m.lecturerName}</TableCell>
                                            <TableCell>{learningStatusMap[m.learningStatus] || 'Không xác định'}</TableCell>
                                            <TableCell>{tuitionStatusMap[m.tuitionStatus] || 'Không xác định'}</TableCell>
                                            <TableCell>{m.score != null ? m.score : '-'}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    component={RouterLink}
                                                    to={`/user/classrooms/${m.classroomId}`}
                                                    state={{ keyword, page, rowsPerPage }}
                                                    sx={{ mr: 1 }}
                                                >
                                                    Xem thông tin
                                                </Button>
                                                {!expired && (
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleCancel(m.classroomId)}
                                                    >
                                                        Hủy đăng ký
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={e => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Box>
        </Container>
    );
}