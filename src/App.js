import './App.css';

import  Menu  from "./components/Menu/Menu"
import PageSesion from './components/PageSesion/PageSesion';
import PageInicio from './components/PageInicio/PageInicio';
import PageRegistro from './components/PageRegistro/PageRegistro';
import PageEnviar from './components/PageEnviar/PageEnviar';
import PageUsuarios from './components/PageUsuarios/PageUsuarios';
import PageTransacciones from './components/PageTransacciones/PageTransacciones';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Cookies from 'universal-cookie'
const cookies = new Cookies();


function App() {
  return (
    <>
        <BrowserRouter >
          <Menu />
          <Routes>
            <Route path="/" element={((cookies.get("ID_Usuario") != null)? <PageInicio/> :<PageSesion/> )}/>
            <Route path="/PageRegistro" element={<PageRegistro/>}/>
            <Route path="/PageSesion" element={<PageSesion/>}/>
            <Route path="/PageInicio" element={((cookies.get("ID_Usuario") != null)? <PageInicio/> :<PageSesion/> )}/>
            <Route path="/PageEnviar" element={<PageEnviar/>}/>
            <Route path="/PageUsuarios" element={((cookies.get("rol") == 'admin' || cookies.get("rol") == 'sa')?   <PageUsuarios/> : <PageInicio/>  )}/>
            <Route path="/PageTransacciones" element={((cookies.get("rol") == 'admin' || cookies.get("rol") == 'sa')?  <PageTransacciones/> : <PageInicio/>   )}/>
          </Routes>
        </BrowserRouter>

      </>
  );
}

export default App;
