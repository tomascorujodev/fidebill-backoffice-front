import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Menu from './views/Menu'
import Clientes from './views/Clientes'


function App() {

  return (
    <>
      <h1>Fidebill</h1>
      <BrowserRouter>
        <Routes>
          <Route path='inicio' element={<Menu></Menu>}></Route>
          <Route path='agregar-cliente' element={<Clientes></Clientes>}></Route>
        </Routes>
      </BrowserRouter> 
    </>
  )
}

export default App
