import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from "./views/Menu";
import ViewClientes from "./views/ViewClientes";
import ViewPuntos from "./views/ViewPuntos";
import FormAgregarCliente from "./views/FormAgregarCliente";
import BackOffice from "./Layout/Backoffice";
import ViewCompras from "./views/ViewCompras";
import ViewSoporte from "./views/ViewSoporte";
import ViewLogin from "./views/ViewLogin";
import { useEffect, useState } from "react";
import ViewCanjes from "./views/ViewCanjes";
import { GET } from "./Services/Fetch";
import FormModificarCliente from "./views/FormModificarCliente";
import ViewBeneficios from "./views/ViewBeneficios";

function App() {
  const [isLogedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    async function validateFunction (){
      let token = sessionStorage.getItem("token");
      if(token){
        let response = await GET("auth/validatetoken");
        if(response.ok){
          setIsLoggedIn(true);
        }else{
          sessionStorage.clear();
          setIsLoggedIn(false);
        }
      }else{
        setIsLoggedIn(false);
      }
    }
    validateFunction();
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        {isLogedIn ?
          <Route element={<BackOffice />}>
            <Route path="/" element={<Menu></Menu>}></Route>
            <Route path="cliente" element={<ViewClientes></ViewClientes>}></Route>
            <Route path="cliente/agregar-cliente" element={<FormAgregarCliente></FormAgregarCliente>}/>
            <Route path="cliente/modificar-cliente/:id" element={<FormModificarCliente></FormModificarCliente>}/>
            <Route path="compras" element={<ViewCompras></ViewCompras>}></Route>
            <Route path="canjes" element={<ViewCanjes></ViewCanjes>}></Route>
            <Route path="puntos" element={<ViewPuntos />} />
            {/* <Route path="beneficios" element={<ViewBeneficios />} /> */}
            <Route path="ayuda" element={<ViewSoporte />} />
          </Route>
          :
          <Route path="/*" element={<ViewLogin setIsLoggedIn={setIsLoggedIn}></ViewLogin>}></Route>
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
