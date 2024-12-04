import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Elimina el token del localStorage
        localStorage.removeItem('token');

        // Redirige al usuario a la página de inicio de sesión
        navigate('/login');
    };

    return (
        <button onClick={handleLogout}>Cerrar sesión</button>
    );
}

export default Logout;