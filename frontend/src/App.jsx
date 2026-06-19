import React from 'react'
import Homepage from './pages/Homepage'
import { BrowserRouter, Route } from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import { Routes } from 'react-router-dom'
import Loginpage from './pages/Loginpage'
import Registerpage from './pages/registerpage'
import Profilepage from './pages/profilepage'
import ProtectedRoute from './component/Protectedroute'
import Forgotpassword from './pages/Forgotpassword'
import { Provider } from 'react-redux'
import store from './store/store'

const App = () => {
  return (
    <>
    <Provider store={store}>
     <BrowserRouter>
         <Toaster/>
       <Routes>
         
         <Route path="/login" element={<Loginpage/>} />
         <Route path="/register" element={<Registerpage />} />
         <Route path='/forgotpassword' element={<Forgotpassword/>}/>
         <Route  element ={<ProtectedRoute/>} >
           <Route path="/" element={<Homepage />} />
           <Route path="/profile" element={<Profilepage />} />
           
           

          
         </Route>

        </Routes>
     </BrowserRouter>
     </Provider>
    </>
  )
}

export default App

