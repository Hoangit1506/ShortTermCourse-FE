import { Container, Typography } from '@mui/material'

export default function NotFound() {
    return (
        <Container sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h3">404 – Page Not Found</Typography>
        </Container>
    )
}
