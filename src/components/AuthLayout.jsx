import Footer from './Footer'
import Header from './Header'
import { Container, Box } from '@mui/material'

export default function AuthLayout({ children }) {
    return (
        <>
            <Header />
            <Container maxWidth="sm">
                <Box mt={4}>
                    {children}
                </Box>
            </Container>
            <Footer />
        </>
    )
}
