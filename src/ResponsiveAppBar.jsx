import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button, Container, Box } from '@mui/material';
import { Menu as MenuIcon, AccountCircle as AccountCircleIcon, Apartment as ApartmentIcon, Business as BusinessIcon } from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';

const pages = [
    { name: 'Administradores', url: '/', icon: <AccountCircleIcon fontSize="small" /> },
    { name: 'Consorcios', url: '/consortia', icon: <ApartmentIcon fontSize="small" /> },
    { name: 'Mis Consorcios', url: '/admin/management', icon: <BusinessIcon fontSize="small" /> }
];

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token'); // Verificar si el usuario está autenticado

    // Maneja la apertura del menú de navegación
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    // Maneja el cierre del menú de navegación
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token'); // Eliminar token del localStorage
        navigate('/login'); // Redirigir al login
    };

    return (
        <AppBar position="static" sx={{ bgcolor: '#E0D9C0' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Botón de menú para el menú desplegable */}
                    <IconButton
                        size="large"
                        aria-label="open menu"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        sx={{ color: '#002776', mr: 1 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Título de la aplicación */}
                    <Typography
                        variant="h6"
                        noWrap
                        component={NavLink}
                        to="/"
                        sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: '#002776',
                            textDecoration: 'none',
                            ml: 1
                        }}
                    >
                        Consorcios interactivo
                    </Typography>

                    {/* Menú desplegable que contiene todas las opciones */}
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{ mt: '10px', boxShadow: 3, borderRadius: 2 }}
                    >
                        {pages.map((page) => (
                            <MenuItem
                                key={page.name}
                                component={NavLink}
                                to={page.url}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    '&:hover': { bgcolor: '#f0f0f0' }
                                }}
                            >
                                {page.icon}
                                <Typography textAlign="center" color="#002776">{page.name}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* Si el token existe, muestra el botón de "Cerrar sesión" */}
                    {token && (
                        <Box sx={{ ml: 'auto' }}>
                            <Button
                                onClick={handleLogout}
                                sx={{
                                    color: '#B2675E', // Color bordó/marrón
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        bgcolor: '#E0C69F', // Fondo claro al pasar el mouse (opcional)
                                    },
                                }}
                            >
                                Cerrar sesión
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;