import { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Box, Button,
    IconButton, Menu, MenuItem, Container
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import api from '../api/axios';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [cats, setCats] = useState([]);
    useEffect(() => {
        api.get('/api/categories?size=100')
            .then(r => setCats(r.data.data.content))
            .catch(console.error);
    }, []);

    const [anchorCat, setAnchorCat] = useState(null);
    const openCat = Boolean(anchorCat);
    const [anchorUser, setAnchorUser] = useState(null);
    const openUser = Boolean(anchorUser);
    const onUserOpen = e => setAnchorUser(e.currentTarget);
    const onUserClose = () => setAnchorUser(null);

    const buildMenuItems = () => {
        if (!user) return null;

        const roles = user.roles || [];
        const has = role => roles.includes(role);
        const items = [];

        if (has('ADMIN')) {
            items.push(
                { label: 'Danh mục', to: '/admin/categories' },
                { label: 'Khóa học', to: '/admin/courses' },
                { label: 'Giảng viên', to: '/admin/lecturers' },
                { label: 'Lớp học', to: '/admin/classroom' },
            );
        }

        if (!has('ADMIN') && has('LECTURER')) {
            items.push(
                { label: 'Hồ sơ', to: '/profile' },
                { label: 'Lớp của tôi', to: '/lecturer/classes' },
            );
        }

        if (!has('LECTURER') && !has('ADMIN')) {
            items.push(
                { label: 'Hồ sơ', to: '/profile' },
                { label: 'Khóa học của tôi', to: '/my-classes' },
            );
        }

        items.push({ label: 'Đăng xuất', action: logout });
        return items;
    };

    const items = buildMenuItems();

    return (
        <AppBar position="static" color="primary">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{ color: 'inherit', textDecoration: 'none', mr: 4 }}
                    >
                        🎓 ShortTermCourse
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                        <Button component={RouterLink} to="/" color="inherit">Trang chủ</Button>
                        <Button component={RouterLink} to="/categories" color="inherit">Danh mục chuyên ngành</Button>
                        <Button component={RouterLink} to="/courses/open-course" color="inherit">
                            Khóa học đang mở
                        </Button>
                    </Box>

                    {user ? (
                        <>
                            <IconButton color="inherit" onClick={onUserOpen}>
                                <AccountCircle />
                            </IconButton>
                            <Menu anchorEl={anchorUser} open={openUser} onClose={onUserClose}>
                                {items.map((it, i) => (
                                    <MenuItem
                                        key={i}
                                        component={it.to ? RouterLink : 'button'}
                                        to={it.to}
                                        onClick={() => {
                                            onUserClose();
                                            it.action?.();
                                        }}
                                    >
                                        {it.label}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    ) : (
                        <Box>
                            <Button component={RouterLink} to="/login" color="inherit">Đăng nhập</Button>
                            <Button component={RouterLink} to="/register" color="inherit">Đăng ký</Button>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
