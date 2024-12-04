import {createContext, useState} from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

export const SuperAdminManagesAdministratorContext= createContext()

export function SuperAdminManagesAdministratorContextProvider(props){
    const [allAdministrator , setAllAdministrator] = useState([])

    const getAllAdministrator = async () => {
        const token = localStorage.getItem('token'); // Obtén el token almacenado

        if (!token) {
            alert("No estás autorizado. Por favor, inicia sesión.");
            return; // Detiene la ejecución si no hay token
        }

        try {
            // Decodifica el token y verifica si tiene el rol de SuperAdmin
            const decodedToken = jwtDecode(token);
            const isSuperAdmin = decodedToken?.role?.includes('ROLE_ROOT');

            if (!isSuperAdmin) {
                alert("No tienes permisos para acceder a esta información.");
                return; // Detiene la ejecución si no es SuperAdmin
            }

            // Continúa con la solicitud si el usuario está autorizado
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/administrators`, {
                headers: {
                    Authorization: `Bearer ${token}` // Incluye el token en el encabezado de la solicitud
                }
            });

            console.log(res.data);
            const administrators = res.data.content;
            setAllAdministrator(administrators.map(administrator => {
                return {
                    administratorId: administrator.administratorId,
                    name: administrator.name,
                    lastName: administrator.lastName,
                    mail: administrator.mail,
                    dni: administrator.dni
                };
            }));
        } catch (error) {
            console.error("Error al obtener la lista de administradores:", error);
            alert("Ocurrió un error al intentar obtener los administradores. Por favor, inténtalo nuevamente.");
        }
    };

    return(
    <SuperAdminManagesAdministratorContext.Provider value={{
        allAdministrator ,
        setAllAdministrator,
        getAllAdministrator
    }}>
        {props.children}
    </SuperAdminManagesAdministratorContext.Provider>
)
}