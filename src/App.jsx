import SuperAdminManagesConsortia from "./superAdmin/SuperAdminManagesConsortia.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ResponsiveAppBar from "./ResponsiveAppBar.jsx";
import SuperAdminPage from "./superAdmin/SuperAdminPage.jsx";


function App() {

  return (
      <div>
          <BrowserRouter>
              <ResponsiveAppBar/>
              <Routes>
                  <Route path="/" element={<SuperAdminPage/>}/>
                  <Route path="/consortia" element={<SuperAdminManagesConsortia/>} />
              </Routes>
          </BrowserRouter>
      </div>
  );
}

export default App
