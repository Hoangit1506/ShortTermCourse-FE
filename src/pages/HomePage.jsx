// src/pages/HomePage.jsx
import { Box, Typography, Container } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HomePage() {
    return (
        <>
            <Header />

            {/* Hero section */}
            <Box
                sx={{
                    height: 650,
                    backgroundImage: 'url(https://res.cloudinary.com/dww8kbh3f/image/upload/v1744560670/CTUWebsiteSlide_odru0l.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                }}
            >
                <Typography variant="h3" align="center">
                    Chào mừng đến với ShortTermCourse
                </Typography>
            </Box>

            {/* Giới thiệu hệ thống */}
            <Container maxWidth="md" sx={{ py: 6 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Hệ thống đào tạo ngắn hạn chất lượng cao
                </Typography>
                <Typography sx={{ fontSize: 18, color: 'text.secondary', mb: 4 }} align="center">
                    ShortTermCourse là nền tảng học tập hiện đại, cung cấp các khóa đào tạo ngắn hạn với nội dung
                    thực tiễn, đội ngũ giảng viên chất lượng và mô hình lớp học tối ưu. Học viên có thể dễ dàng
                    tiếp cận kiến thức chuyên ngành từ cơ bản đến nâng cao, phù hợp với mọi đối tượng.
                </Typography>

                <Typography variant="h5" gutterBottom>
                    Điểm nổi bật:
                </Typography>
                <ul style={{ fontSize: 16, color: '#555' }}>
                    <li>📚 Hàng trăm khóa học được phân loại theo chuyên ngành</li>
                    <li>👨‍🏫 Giảng viên giàu kinh nghiệm và tâm huyết</li>
                    <li>💻 Đăng ký khóa học trực tuyến linh hoạt mọi lúc mọi nơi</li>
                    <li>🎓 Chứng chỉ xác nhận sau mỗi khóa học</li>
                </ul>
            </Container>

            {/* Footer */}
            <Footer />
        </>
    );
}