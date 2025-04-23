// src/components/UserLayout.jsx
import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import {
    Box, Drawer, List, ListItemButton,
    ListItemText, Toolbar, Typography, IconButton
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function UserLayout() {
    const menu = [
        { label: 'Hồ sơ', to: '/user/profile' },
        { label: 'Khóa học của tôi', to: '/user/my-courses' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: 200,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { width: 200, boxSizing: 'border-box' }
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">User</Typography>
                    <IconButton component={RouterLink} to="/" color="inherit">
                        <HomeIcon />
                    </IconButton>
                </Toolbar>
                <List>
                    {menu.map(item => (
                        <ListItemButton
                            key={item.to}
                            component={RouterLink}
                            to={item.to}
                        >
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}
