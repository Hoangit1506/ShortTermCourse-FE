// src/pages/Categories.jsx
import { useEffect, useState } from "react";
import {
    Box, Typography, Container, Grid, Card, CardMedia,
    CardContent, CardActions, CardActionArea, Button,
    List, ListItemButton, ListItemText, Divider
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Header from "../components/Header";
import Footer from '../components/Footer';
import api from "../api/axios";

export default function Categories() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        api.get("/api/categories?size=100")
            .then(res => {
                const cats = res.data.data.content;
                return Promise.all(cats.map(cat =>
                    api.get("/api/courses", { params: { categoryId: cat.id, size: 100 } })
                        .then(r => ({ ...cat, courses: r.data.data.content }))
                ));
            })
            .then(setCategories)
            .catch(console.error);
    }, []);

    const handleScrollTo = id => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <Header />

            <Box sx={{ display: "flex", mt: 4, mb: 6 }}>
                <Box
                    component="nav"
                    sx={{
                        width: 240, flexShrink: 0, pr: 2,
                        display: { xs: "none", md: "block" },
                        position: "sticky", top: 88,
                        bgcolor: "background.paper",
                        borderRight: 1, borderColor: "divider",
                        borderRadius: 1, boxShadow: 1, p: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
                        Danh mục chuyên ngành
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <List>
                        {categories.map(cat => (
                            <ListItemButton
                                key={cat.id}
                                onClick={() => handleScrollTo(cat.id)}
                                sx={{
                                    borderRadius: 1, mb: 0.5,
                                    "&:hover": {
                                        bgcolor: "primary.light",
                                        color: "primary.contrastText"
                                    }
                                }}
                            >
                                <ListItemText primary={cat.name} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>

                <Container maxWidth="lg">
                    <Typography variant="h4" gutterBottom sx={{ color: "primary.dark" }}>
                        Danh sách khóa học theo chuyên ngành
                    </Typography>

                    {categories.map(cat => (
                        <Box
                            key={cat.id}
                            id={cat.id}
                            sx={{
                                mt: 5, mb: 5, p: 3,
                                bgcolor: "background.default",
                                border: 1, borderColor: "divider",
                                borderRadius: 2, boxShadow: 1,
                            }}
                        >
                            <Typography variant="h5" gutterBottom sx={{ color: "secondary.main" }}>
                                {cat.name}
                            </Typography>
                            {cat.description && (
                                <Typography variant="body1" gutterBottom>
                                    {cat.description}
                                </Typography>
                            )}

                            {cat.courses.length === 0 ? (
                                <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
                                    Chưa có khóa học nào trong chuyên ngành này.
                                </Typography>
                            ) : (
                                <>
                                    <Grid container spacing={3} alignItems="stretch">
                                        {cat.courses.slice(0, 8).map(course => (
                                            <Grid item xs={12} sm={6} md={3} key={course.id}>
                                                <Card
                                                    elevation={3}
                                                    sx={{
                                                        height: "100%",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        borderRadius: 2,
                                                        transition: "transform 0.2s",
                                                        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                                                    }}
                                                >
                                                    <CardActionArea
                                                        component={RouterLink}
                                                        to={`/courses/${course.id}`}
                                                        sx={{
                                                            flexGrow: 1,
                                                            display: "flex",
                                                            flexDirection: "column",
                                                        }}
                                                    >
                                                        <Box sx={{ height: 150, overflow: "hidden" }}>
                                                            <CardMedia
                                                                component="img"
                                                                image={course.thumbnail}
                                                                alt={course.name}
                                                                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                            />
                                                        </Box>

                                                        <CardContent sx={{
                                                            flexGrow: 1,
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            textAlign: "center",
                                                            p: 2
                                                        }}>
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    display: "-webkit-box",
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: "vertical",
                                                                    overflow: "hidden",
                                                                    fontWeight: "bold"
                                                                }}
                                                            >
                                                                {course.name}
                                                            </Typography>
                                                            <Box sx={{ flexGrow: 1 }} />
                                                        </CardContent>
                                                    </CardActionArea>

                                                    <CardActions sx={{ justifyContent: "center", pb: 1 }}>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            component={RouterLink}
                                                            to={`/courses/${course.id}`}
                                                        >
                                                            Xem chi tiết
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {cat.courses.length > 8 && (
                                        <Box mt={2} textAlign="right">
                                            <Button
                                                component={RouterLink}
                                                to={`/courses?categoryId=${cat.id}`}
                                                variant="outlined"
                                                color="primary"
                                            >
                                                Xem thêm khóa học
                                            </Button>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                    ))}
                </Container>
            </Box>

            <Footer />
        </>
    );
}
