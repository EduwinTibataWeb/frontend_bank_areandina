import React, { Component } from 'react'
import { Link } from "react-router-dom";
import './PageRegistro.css'
import Cookies from 'universal-cookie'
import axios from 'axios'


const urlRegsitro="http://localhost:9000/api/users"


const cookies = new Cookies();

class PageRegistro extends Component {
    state={
        data: [],
        form:{
            Nombre:'', 
            Saldo:0, 
            Correo:'',  
            Contrasena:'',
            ID_Usuario:'',
            Fecha_Activacion: new Date()
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
        let saldo=this.state.form.Saldo;
        let email=this.state.form.Correo;
        let contrasena=this.state.form.Contrasena;

        let fechaHora = new Date();

        let id=this.state.form.ID_Usuario
        
        if(nombre.length<=0 || contrasena.length<=0 || email.length<=0){
            alert('Se requieren todos los datos')
            return "Algunos o Todos Los Estan Datos Vacios"
        }else{
            cookies.set("Correo",email,{path:"/"})
            cookies.set("Nombre",nombre,{path:"/"})
            cookies.set("Saldo",saldo,{path:"/"})
            cookies.set("Contrasena",contrasena,{path:"/"})
            cookies.set("ID_Usuario",id, {path:"/"})
            cookies.set("Fecha_Activacion",fechaHora, {path:"/"})
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
                <label htmlFor='ID_Usuario'>Cedula</label>
                <input type="number" name="ID_Usuario" id='ID_Usuario' onChange={this.handleChange}></input>
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