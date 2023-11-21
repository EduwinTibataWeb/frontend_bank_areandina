import React, { Component } from 'react'
import { Link } from "react-router-dom";
import './PageRegistro.css'
import Cookies from 'universal-cookie'
import axios from 'axios'


const urlRegsitro="http://localhost:9000/api/usuarios"


const cookies = new Cookies();

class PageRegistro extends Component {
    state={
        data: [],
        form:{
            Nombre:'', 
            Saldo:0, 
            Correo:'',  
            Contrasena:'',
            Id:'',
            rol:'user',
            Fecha_Activacion: new Date(),
        },
    }


    handleChange=async e=>{
        e.persist();
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]:e.target.value
            }
        })
        console.log(this.state.form)
        cookies.set("prueba", this.state.form,{path:"/"})
        window.localStorage.setItem("tipo", this.state.form.Nombre)
    }

    suscribirse=async()=>{
        let nombre=this.state.form.Nombre;
        let rol=this.state.form.rol;
        let email=this.state.form.Correo;
        let contrasena=this.state.form.Contrasena;

        let fechaHora = new Date();

        let id=this.state.form.Id
        
        if(nombre.length<=0 || contrasena.length<=0 || email.length<=0){
            alert('Se requieren todos los datos')
            return "Algunos o Todos Los Estan Datos Vacios"
        }else{
            cookies.set("ID_Usuario",id, {path:"/"})
            cookies.set("rol",rol, {path:"/"})
        }

        await axios
        .post(urlRegsitro, this.state.form)
        .then(response=>{
            console.log(response.data)
            window.location.href='./'
        })
        .catch(error=>{
            console.log(error)
        })

    }

    render() {
        return(
            <div className="formulario_login">
            <div className="formulario_items">
              <div className="formulario_header">
                <h2> Registro </h2>
              </div>
              <form className="formulario_form">
                <label htmlFor='Id'>Cedula</label>
                <input type="number" name="Id" id='Id' onChange={this.handleChange}></input>
                <label htmlFor='Correo'>Correo</label>
                <input type="email" name="Correo" id='Correo' onChange={this.handleChange}></input>
                <label htmlFor='Contrasena'>Contraseña</label>
                <input type="password" name="Contrasena" id='Contrasena' onChange={this.handleChange}></input>
                <label htmlFor='Nombre'>Nombre</label>
                <input type="text" name="Nombre" id='Nombre' onChange={this.handleChange}></input>
                <div className='boton-login' onClick={() => this.suscribirse()}>Registrarse</div>
              </form>
              <p>¿Ya tienes una cuenta? <Link to="/PageSesion">Inicia sesión</Link> </p>
            </div>
            <div className="formulario_img">
              <img src="./assets/img_registrarse.png" alt='Imagen_Registro'/>
            </div>
            <div className="icon_menu_top2" onClick={()=>window.location.href='./PageInicio'}>
              <div></div>
              <div></div>
              <div></div>
            </div>
        </div>
        )
    }
}

export default PageRegistro;