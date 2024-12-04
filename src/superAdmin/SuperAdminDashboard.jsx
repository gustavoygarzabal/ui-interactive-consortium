import React from 'react';
import { Box, Typography, Container, Paper, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment'; // Ícono para Consorcios
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'; // Ícono para Administradores
import { useNavigate } from 'react-router-dom';

const options = [
    {
        title: 'Consorcios',
        icon: <ApartmentIcon style={{ fontSize: 80, color: '#002776' }} />,
        path: '/superAdmin/management/consorcios',
    },
    {
        title: 'Administradores',
        icon: <SupervisorAccountIcon style={{ fontSize: 80, color: '#002776' }} />,
        path: '/superAdmin/management/administradores',
    },
];

const SuperAdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* Título del Dashboard */}
            <Box
                sx={{
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center',
                    paddingX: { xs: '10px', sm: '20px', md: '40px' },
                }}
            >
                <Typography
                    variant="h6"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: '#003366',
                        fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                    }}
                >
                    Panel de Administración
                </Typography>
            </Box>

            {/* Contenedor de las opciones */}
            <Container
                maxWidth="lg"
                sx={{
                    marginTop: '80px',
                    marginBottom: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    elevation={2}
                    sx={{
                        padding: '40px',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '900px',
                    }}
                >
                    <Grid container spacing={4} justifyContent="center" alignItems="center">
                        {options.map((option) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                key={option.title}
                                sx={{ display: 'flex', justifyContent: 'center' }}
                            >
                                <Card
                                    sx={{
                                        width: '200px',
                                        height: '200px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => navigate(option.path)}
                                        sx={{ height: '100%', width: '100%' }}
                                    >
                                        <CardContent sx={{ textAlign: 'center' }}>
                                            {option.icon}
                                            <Typography variant="h6" sx={{ marginTop: '10px' }}>
                                                {option.title}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Container>
        </div>
    );
};

export default SuperAdminDashboard;