// src/pages/CourseDetail.jsx
import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
    Box, Typography, Container, Card, CardMedia, Divider,
    Grid, Button, CardActionArea
} from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import dayjs from 'dayjs'
import Header from '../components/Header'
import Footer from '../components/Footer'
import api from '../api/axios'

export default function CourseDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [course, setCourse] = useState(null)
    const [upcoming, setUpcoming] = useState([])
    const [searchParams] = useSearchParams();

    useEffect(() => {
        api.get(`/api/courses/${id}`)
            .then(res => setCourse(res.data.data))
            .catch(console.error)
    }, [id])

    useEffect(() => {
        if (!course) return
        const today = dayjs().format('YYYY-MM-DD')
        api.get('/api/classrooms', {
            params: {
                courseId: id,
                startDate: today,
                size: 100
            }
        })
            .then(res => setUpcoming(res.data.data.content))
            .catch(console.error)
    }, [course, id])

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
                        image={course.thumbnail || '/placeholder.png'}
                        alt={course.name}
                    />
                </Card>

                <Box textAlign="center" sx={{ mb: 3 }}>
                    <Typography variant="h5" color="text.primary">Chuyên ngành:</Typography>
                    <Typography variant="body1" gutterBottom>{course.categoryName}</Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h5" color="text.primary">Giá khóa học:</Typography>
                    <Typography variant="body1">
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            maximumFractionDigits: 0
                        }).format(course.price)}
                    </Typography>
                </Box>

                <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: '#fafafa' }}>
                    <Section title="Đối tượng phù hợp">
                        {course.suitable || 'Chưa có thông tin.'}
                    </Section>
                    <Divider sx={{ my: 2 }} />
                    <Section title="Mô tả khóa học">
                        {course.description || 'Chưa có mô tả.'}
                    </Section>
                    <Divider sx={{ my: 2 }} />
                    <Section title="Nội dung khóa học">
                        {course.content || 'Chưa có nội dung.'}
                    </Section>
                </Box>

                {course.promoVideo && (
                    <>
                        <Divider sx={{ my: 3 }} />
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

                <Divider sx={{ my: 2 }} />
                <Box textAlign="center" sx={{ mb: 4 }}>
                    <Button
                        variant="outlined"
                        component={RouterLink}
                        to={`/courses${searchParams.toString() ? '?' + searchParams.toString() : '?categoryId=' + course.categoryId}`}
                    >
                        Xem các khóa học khác
                    </Button>
                </Box>

                <Divider sx={{ my: 4 }} />
                <Typography variant="h5" align="center" gutterBottom>Các lớp sắp mở</Typography>
                {upcoming.length > 0 ? (
                    <Grid container spacing={2} justifyContent="center">
                        {upcoming.map(cl => (
                            <Grid item xs={12} sm={6} md={5} key={cl.id}>
                                <CardActionArea
                                    component={RouterLink}
                                    to={`/classrooms/${cl.id}`}
                                    sx={{ display: 'block', border: 1, borderColor: 'divider', borderRadius: 2 }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{ width: 100, height: 60, overflow: 'hidden', borderRadius: 1 }}>
                                            <CardMedia
                                                component="img"
                                                src={cl.courseThumbnail || '/placeholder.png'}
                                                alt={cl.courseName}
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </Box>
                                        <Box sx={{ ml: 2, flex: 1 }}>
                                            <Typography noWrap fontWeight="bold">{cl.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {dayjs(cl.startDate).format('DD/MM/YYYY')} – {dayjs(cl.endDate).format('DD/MM/YYYY')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardActionArea>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography>Chưa có lớp nào sắp mở.</Typography>
                )}
            </Container>

            <Footer />
        </>
    )
}

function Section({ title, children }) {
    return (
        <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {title}
            </Typography>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {children}
            </ReactMarkdown>
        </Box>
    )
}
