import { BrowserRouter, Route, Routes } from "react-router-dom";
import ViewMenu from "./views/ViewMenu";
import ViewClientes from "./views/ViewClientes";
import ViewPuntos from "./views/ViewPuntos";
import FormAgregarCliente from "./views/FormAgregarCliente";
import BackOffice from "./layout/Backoffice";
import ViewCompras from "./views/ViewCompras";
import ViewSoporte from "./views/ViewSoporte";
import ViewLogin from "./views/ViewLogin";
import { useEffect, useState } from "react";
import ViewCanjes from "./views/ViewCanjes";
import { GET } from "./services/Fetch";
import FormModificarCliente from "./views/FormModificarCliente";
import ViewModificarBeneficio from "./views/beneficios/ViewModificarBeneficio.jsx";
import ViewCrearBeneficios from "./views/beneficios/ViewCrearBeneficios";
import ViewBeneficios from "./views/beneficios/ViewBeneficios";
import ViewAppClientes from "./views/ViewAppClientes";
import ViewFunciones from "./views/ViewFunciones";
import jwtDecode from "./utils/jwtDecode";
import VerPremios from "./views/premios/VerPremios.jsx";
import CrearPremios from "./views/premios/CrearPremios.jsx";
import ModificarPremio from "./views/premios/ModificarPremios.jsx";
import CrearCatalogo from "./views/catalogo/CrearCatalogo.jsx";
import ViewSellos from "./views/premios/ViewSellos.jsx";
import ViewPremiosCanjeados from "./views/premios/ViewPremiosCanjeados.jsx";

function App() {
  const [isLogedIn, setIsLoggedIn] = useState(false);
  let token = sessionStorage.getItem("token");
  let tokenDecoded = jwtDecode(sessionStorage.getItem("token"));
  useEffect(() => {
    async function validateFunction() {
      if (token) {
        let response = await GET("auth/validatetoken");
        if (response?.ok) {
          setIsLoggedIn(true);
        } else {
          sessionStorage.clear();
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    }
    validateFunction();
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        {
          isLogedIn ?
            <Route element={<BackOffice />}>
              <Route path="/*" element={<ViewMenu></ViewMenu>}></Route>
              <Route path="/appclientes" element={<ViewAppClientes></ViewAppClientes>}></Route>
              <Route path="/funciones" element={<ViewFunciones></ViewFunciones>}></Route>
              <Route path="cliente" element={<ViewClientes></ViewClientes>}></Route>
              <Route path="cliente/agregar-cliente" element={<FormAgregarCliente></FormAgregarCliente>} />
              <Route path="cliente/modificar-cliente/:id" element={<FormModificarCliente></FormModificarCliente>} />
              <Route path="compras" element={<ViewCompras></ViewCompras>}></Route>
              <Route path="canjes" element={<ViewCanjes></ViewCanjes>} />
              <Route path="puntos" element={<ViewPuntos />} />
              <Route path="premios">
                <Route path="sellos" element={<ViewSellos />} />
                <Route path="historial" element={<ViewPremiosCanjeados />} />
                {
                  tokenDecoded?.rol && (
                    <>
                      <Route path="crear" element={<CrearPremios />} />
                      <Route path="ver" element={<VerPremios />} />
                      <Route path="modificar" element={<ModificarPremio />} />
                    </>
                  )
                }
              </Route>
              <Route path="ayuda" element={<ViewSoporte />} />
              {
                tokenDecoded?.rol && (
                  <>
                    <Route path="beneficios">
                      <Route path="crear" element={<ViewCrearBeneficios />} />
                      <Route path="ver" element={<ViewBeneficios />} />
                      <Route path="modificar" element={<ViewModificarBeneficio />} />
                    </Route>
                    <Route path="catalogos">
                      <Route path="crear" element={<CrearCatalogo />}></Route>
                    </Route>
                  </>
                )
              }
            </Route>
            :
            <>
              <Route path="/*" element={<ViewLogin setIsLoggedIn={setIsLoggedIn}></ViewLogin>}></Route>
              <Route path="/Admin" element={<ViewLogin setIsLoggedIn={setIsLoggedIn}></ViewLogin>}></Route>
            </>
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
