import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
import AddProduct from './pages/AddProduct'
import Orders from './pages/Orders'
import Aboutus from './pages/Aboutus'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Products/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/add-product' element={<AddProduct/>}/>
      <Route path='/orders' element={<Orders/>}/>
       <Route path='/aboutus' element={<Aboutus/>}/>
    </Routes>
  )
}

export default App