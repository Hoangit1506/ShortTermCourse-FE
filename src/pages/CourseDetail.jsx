// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {
//     Container, Typography, Box, Grid, Card, CardContent, Button, CardMedia, Divider
// } from "@mui/material";
// import Header from "../components/Header";
// import api from "../api/axios";
// import { useAuth } from "../contexts/auth";

// export default function CourseDetail() {
//     const { id } = useParams(); // courseId
//     const [course, setCourse] = useState(null);
//     const [classrooms, setClassrooms] = useState([]);
//     const { user } = useAuth();

//     useEffect(() => {
//         api.get(`/api/courses/${id}`)
//             .then(res => setCourse(res.data.data))
//             .catch(console.error);

//         api.get(`/api/classrooms?courseId=${id}`)
//             .then(res => setClassrooms(res.data.data.content))
//             .catch(console.error);
//     }, [id]);

//     if (!course) return <div>Đang tải...</div>;

//     return (
//         <>
//             <Header />
//             <Container sx={{ mt: 4 }}>
//                 <Typography variant="h4" gutterBottom color="primary">{course.name}</Typography>

//                 {/* Thumbnail + Info */}
//                 <Grid container spacing={3}>
//                     <Grid item xs={12} md={5}>
//                         {course.thumbnail && (
//                             <CardMedia
//                                 component="img"
//                                 image={course.thumbnail}
//                                 alt={course.name}
//                                 sx={{ width: "100%", borderRadius: 2, maxHeight: 300, objectFit: "cover" }}
//                             />
//                         )}
//                     </Grid>

//                     <Grid item xs={12} md={7}>
//                         <Typography variant="body1" gutterBottom>
//                             <strong>Đối tượng phù hợp:</strong> {course.suitable}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                             <strong>Mô tả:</strong> {course.description}
//                         </Typography>
//                         <Typography variant="body1" gutterBottom>
//                             <strong>Giá:</strong> ${course.price}
//                         </Typography>
//                     </Grid>
//                 </Grid>

//                 {/* Promo Video */}
//                 {course.promoVideo && (
//                     <Box mt={4}>
//                         <Typography variant="h6" gutterBottom color="secondary">Video giới thiệu</Typography>
//                         <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
//                             <iframe
//                                 src={course.promoVideo}
//                                 title="Promo Video"
//                                 allowFullScreen
//                                 style={{
//                                     position: "absolute",
//                                     top: 0, left: 0,
//                                     width: "100%", height: "100%",
//                                     border: "none"
//                                 }}
//                             />
//                         </Box>
//                     </Box>
//                 )}

//                 {/* Content */}
//                 {course.content && (
//                     <Box mt={4}>
//                         <Typography variant="h6" gutterBottom color="secondary">Nội dung chi tiết</Typography>
//                         <Box
//                             dangerouslySetInnerHTML={{ __html: course.content }}
//                             sx={{
//                                 p: 2,
//                                 border: 1,
//                                 borderColor: "divider",
//                                 borderRadius: 2,
//                                 bgcolor: "#fdfdfd"
//                             }}
//                         />
//                     </Box>
//                 )}

//                 {/* Classrooms */}
//                 <Box mt={6}>
//                     <Divider sx={{ mb: 2 }} />
//                     <Typography variant="h5" gutterBottom color="primary">Các lớp học</Typography>
//                     <Grid container spacing={3}>
//                         {classrooms.map(cl => (
//                             <Grid item xs={12} md={6} key={cl.id}>
//                                 <Card>
//                                     <CardContent>
//                                         <Typography variant="h6">{cl.name}</Typography>
//                                         <Typography><strong>Thời gian:</strong> {cl.startDate} → {cl.endDate}</Typography>
//                                         <Typography><strong>Địa điểm:</strong> {cl.place}</Typography>
//                                         <Typography><strong>Số lượng:</strong> {cl.enrolled}/{cl.capacity}</Typography>
//                                     </CardContent>

//                                     {user?.role === "USER" && (
//                                         <Box sx={{ p: 2 }}>
//                                             <Button
//                                                 variant="contained"
//                                                 fullWidth
//                                                 disabled={cl.enrolled >= cl.capacity}
//                                                 onClick={() => {
//                                                     api.post("/api/members", { classroomId: cl.id })
//                                                         .then(() => {
//                                                             alert("Đăng ký thành công!");
//                                                         })
//                                                         .catch(err => {
//                                                             alert(err.response?.data?.message || "Đăng ký thất bại");
//                                                         });
//                                                 }}
//                                             >
//                                                 {cl.enrolled >= cl.capacity ? "Hết chỗ" : "Đăng ký lớp này"}
//                                             </Button>
//                                         </Box>
//                                     )}
//                                 </Card>
//                             </Grid>
//                         ))}
//                     </Grid>
//                 </Box>
//             </Container>
//         </>
//     );
// }



// import { useEffect, useState } from "react";
// import {
//     Box, Typography, Container, Card, CardMedia,
//     CardContent, Divider
// } from "@mui/material";
// import { useParams } from "react-router-dom";
// import Header from "../components/Header";
// import api from "../api/axios";

// export default function CourseDetail() {
//     const { id } = useParams();
//     const [course, setCourse] = useState(null);

//     useEffect(() => {
//         api.get(`/api/courses/${id}`)
//             .then(res => setCourse(res.data.data))
//             .catch(console.error);
//     }, [id]);

//     if (!course) return null;

//     return (
//         <>
//             <Header />

//             <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
//                 <Typography variant="h4" align="center" color="primary" gutterBottom>
//                     CHƯƠNG TRÌNH TẬP HUẤN NGẮN HẠN CÔNG NGHỆ KỸ THUẬT
//                 </Typography>

//                 <Card sx={{ mb: 3 }}>
//                     <CardMedia
//                         component="img"
//                         height="240"
//                         image={course.thumbnail || "/placeholder.png"}
//                         alt={course.name}
//                     />
//                 </Card>

//                 <Box sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 2, bgcolor: "#fafafa" }}>
//                     <Typography><strong>Tên chương trình:</strong> {course.name}</Typography>
//                     <Typography><strong>Thời gian tập huấn:</strong> 5 ngày</Typography>
//                     <Typography><strong>Thời điểm tổ chức:</strong> Theo yêu cầu</Typography>
//                     <Typography><strong>Đối tượng & số lượng:</strong> {course.suitable || "Không giới hạn"}</Typography>

//                     <Divider sx={{ my: 2 }} />

//                     <Typography variant="h6" color="secondary" gutterBottom>
//                         Nội dung tập huấn:
//                     </Typography>

//                     <Box sx={{ pl: 2 }}>
//                         <Typography>★ {course.description || "Chưa cập nhật nội dung mô tả khóa học."}</Typography>
//                         <Typography sx={{ mt: 1 }}>
//                             ★ Tập huấn lý thuyết và thực hành tại Trường Đại học Cần Thơ (trực tiếp hoặc trực tuyến)
//                         </Typography>
//                         <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
//                             <li>Chương 1. Giới thiệu</li>
//                             <li>Chương 2. Phần cứng: lập trình IO</li>
//                             <li>Chương 3. Kiến trúc phần mềm, xây dựng thư viện</li>
//                             <li>Chương 4. Lập trình thời gian thực</li>
//                             <li>Chương 5. Hệ điều hành nhúng</li>
//                             <li>Chương 6. Lập trình hệ thống nhiều trạng thái</li>
//                         </ul>
//                     </Box>

//                     <Divider sx={{ my: 2 }} />

//                     <Typography><strong>Chịu trách nhiệm chính:</strong> TS. Trần Thanh Hùng</Typography>
//                     <Typography>
//                         <strong>Thông tin liên hệ:</strong> Email: tthung@ctu.edu.vn — Điện thoại: 0906 684 723
//                     </Typography>
//                 </Box>

//                 {/* Video giới thiệu nếu có */}
//                 {course.promoVideo && (
//                     <Box sx={{ mt: 4 }}>
//                         <Typography variant="h6" gutterBottom color="primary">
//                             Video giới thiệu:
//                         </Typography>
//                         <Box sx={{ position: "relative", pb: "56.25%", height: 0 }}>
//                             <iframe
//                                 src={course.promoVideo}
//                                 title="Video giới thiệu"
//                                 frameBorder="0"
//                                 allowFullScreen
//                                 style={{
//                                     position: "absolute", top: 0, left: 0, width: "100%", height: "100%"
//                                 }}
//                             />
//                         </Box>
//                     </Box>
//                 )}
//             </Container>
//         </>
//     );
// }


// CourseDetail.jsx
import React, { useEffect, useState } from 'react'
import { Box, Typography, Container, Card, CardMedia, CardContent, Divider } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import api from '../api/axios'

export default function CourseDetail() {
    const { id } = useParams()
    const [course, setCourse] = useState(null)

    useEffect(() => {
        api.get(`/api/courses/${id}`)
            .then(res => setCourse(res.data.data))
            .catch(console.error)
    }, [id])

    if (!course) return null

    return (
        <>
            <Header />
            <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {course.name}
                </Typography>
                <Card sx={{ mb: 3 }}>
                    <CardMedia
                        component="img"
                        height="240"
                        image={course.thumbnail || 'url(https://res.cloudinary.com/dww8kbh3f/image/upload/v1744560670/CTUWebsiteSlide_odru0l.png)'}
                        alt={course.name}
                    />
                </Card>

                <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: '#fafafa' }}>
                    <Typography><strong>Thời gian:</strong> {course.contentTime || '5 ngày'}</Typography>
                    <Typography><strong>Đối tượng:</strong> {course.suitable}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ pl: 2, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: '#fafafa' }}>
                    <Typography><strong>Mô tả khóa học:</strong></Typography>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {course.description || 'Chưa có mô tả.'}
                    </ReactMarkdown>
                    <Typography><strong>Nội dung khóa học:</strong></Typography>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {course.content || 'Chưa có nội dung.'}
                    </ReactMarkdown>
                </Box>

                {course.promoVideo && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>Video giới thiệu</Typography>
                        <Box sx={{ position: 'relative', pb: '56.25%', height: 0 }}>
                            <iframe
                                src={course.promoVideo}
                                title="promo"
                                frameBorder="0"
                                allowFullScreen
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            />
                        </Box>
                    </>
                )}
            </Container>
        </>
    )
}
