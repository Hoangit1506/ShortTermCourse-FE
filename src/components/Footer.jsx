import { Box, Typography, Container, Link } from '@mui/material';

export default function Footer() {
    return (
        <Box
            sx={{
                backgroundColor: '#333',
                color: '#fff',
                py: 4,
                mt: 6,
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body1" align="center">
                    © 2025 ShortTermCourse. All rights reserved.
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                    <Link href="/privacy" color="inherit" underline="hover">
                        Privacy Policy
                    </Link>{' '}
                    |{' '}
                    <Link href="/terms" color="inherit" underline="hover">
                        Terms of Service
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
}