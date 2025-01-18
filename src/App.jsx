import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from "./views/Menu";
import ViewClientes from "./views/ViewClientes";
import ViewPuntos from "./views/ViewPuntos";
import FormAgregarCliente from "./views/FormAgregarCliente";
import BackOffice from "./Layout/Backoffice";
import ViewCompras from "./views/ViewCompras";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BackOffice />}>
          <Route path="/" element={<Menu></Menu>}></Route>
          <Route path="cliente" element={<ViewClientes></ViewClientes>}></Route>
          <Route path="cliente/agregar-cliente" element={<FormAgregarCliente></FormAgregarCliente>}/>
          <Route path="compras" element={<ViewCompras></ViewCompras>}></Route>
          <Route path="puntos" element={<ViewPuntos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
