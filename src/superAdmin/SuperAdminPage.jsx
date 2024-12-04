import { Routes, Route } from 'react-router-dom';
import {
    SuperAdminManagesAdministratorContextProvider
} from "./SuperAdminManageAdmin/SuperAdminManagesAdministratorContext.jsx";
import {
    SuperAdminManageConsortiumContextProvider
} from "./SuperAdminManageConsortium/SuperAdminManageConsortiumContext.jsx";
import SuperAdminManagesAdministrator from "./SuperAdminManageAdmin/SuperAdminManagesAdministrator.jsx";
import SuperAdminManagesConsortia from "./SuperAdminManageConsortium/SuperAdminManagesConsortia.jsx";
import AdminDashboard from "../administrator/AdminDashboard.jsx";
import SuperAdminDashboard from "./SuperAdminDashboard.jsx";


function SuperAdminPage() {
    return (
        <SuperAdminManagesAdministratorContextProvider>
            <SuperAdminManageConsortiumContextProvider>
                <Routes>
                    <Route path="/" element={<SuperAdminDashboard/>} />
                    {/* Ruta para la lista de administradores */}
                    <Route path="/administradores" element={<SuperAdminManagesAdministrator />} />

                    {/* Ruta para la gestión de consorcios */}
                    <Route path="/consorcios" element={<SuperAdminManagesConsortia />} />
                </Routes>
            </SuperAdminManageConsortiumContextProvider>
        </SuperAdminManagesAdministratorContextProvider>
    );
}

export default SuperAdminPage;