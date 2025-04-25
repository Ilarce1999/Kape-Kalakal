import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
// import customFetch from '../../utils/customFetch.js'

//const resp = await customFetch.get('/test');
//console.log(resp);


//fetch('/api/v1/test').then((res)=>res.json()).then((data)=> console.log(data));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer position='top-center'/>
  </StrictMode>,
)
