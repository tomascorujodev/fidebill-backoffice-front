import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Menu from './views/Menu'
import ViewClientes from './views/ViewClientes'
import Puntos from './views/Puntos'
import FormAgregarCliente from './views/FormAgregarCliente'


function App() {

  return (
    <>
      <div className="container">
        <h1>Fidebill</h1>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Menu></Menu>}></Route>
          <Route path='cliente' element={<ViewClientes></ViewClientes>}></Route>
          <Route path='agregar-cliente' element={<FormAgregarCliente></FormAgregarCliente>}></Route>
          <Route path="puntos" element={<Puntos />} />
        </Routes>
      </BrowserRouter> 
    </>
  )
}

export default App
