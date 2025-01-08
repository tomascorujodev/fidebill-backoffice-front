import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Menu from './views/Menu'
import Clientes from './views/Clientes'
import Puntos from './views/Puntos'


function App() {

  return (
    <>
      <div className="container">
        <h1>Fidebill</h1>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='inicio' element={<Menu></Menu>}></Route>
          <Route path='agregar-cliente' element={<Clientes></Clientes>}></Route>
          <Route path="puntos" element={<Puntos />} />
        </Routes>
      </BrowserRouter> 
    </>
  )
}

export default App
