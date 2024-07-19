import SuperAdminManagesAdministrator from "./SuperAdminManagesAdministrator.jsx";
import SuperAdminCreateAdministrator from "./SuperAdminCreateAdministrator.jsx";

function SuperAdminPage(){
    return (
        <div>
            <SuperAdminCreateAdministrator/>
            <SuperAdminManagesAdministrator/>
        </div>

    )
}
export default SuperAdminPage