import React, { Component } from "react";
import axios from "axios"
import './PageSesion.css'
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie'

const cookies = new Cookies();

const url= "http://localhost:9000/api/usuarios"

class PageSesion extends Component {
  
  state={
    form:{
        Id: '',
        Contrasena: ''
    }
}

handleChange=async e=>{
    await this.setState({
        form:{
            ...this.state.form,
            [e.target.name]:e.target.value
        }
    })
    console.log(this.state.form)
}

iniciarSesion=async()=>{
    let ID_Usuario=this.state.form.Id
    let pwd=this.state.form.Contrasena
    if(ID_Usuario.length<=0 || pwd.length<=0){
        alert('Se requieren todos los datos')
        return "Datos Vacios"
    }
    
    await axios.get(url+"/"+ID_Usuario+"/"+pwd)
    .then(response=>{
        console.log(response.data)
        return response.data
    }).then(response=>{
        if(response.length>0){
          var resp=response[0]
          cookies.set("ID_Usuario",resp.Id, {path:"/"})
          cookies.set("rol",resp.rol, {path:"/"})
          window.location.href='./'
        }else{
            alert("Verificar Usario y/o Clave")
        }
    })
    .catch(error=>{
        console.log(error)
    })

    }

    //render
    render(){
        return(
            <div className="formulario_login">
                <div className="formulario_items">
                  <div className="formulario_header">
                    <img src="./assets/logo.png" alt="Logo_bancoAreandina"/>
                    <h2> Iniciar Sesión </h2>
                  </div>
                  <form className="formulario_form">
                    <label htmlFor='Id'>Cedula</label>
                    <input type="text" name="Id" id='Id' onChange={this.handleChange}></input>
                    <label htmlFor='Contrasena'>Contraseña</label>
                    <input type="Contrasena" name="Contrasena" id='Contrasena' onChange={this.handleChange}></input>
                    <button className='boton-login' onClick={() => this.iniciarSesion()}>LOGIN</button>
                  </form>
                  <p>¿Todavía no tienes una cuenta? <Link to="/PageRegistro">Regístrate</Link> </p>
                </div>
                <div className="formulario_img">
                  <img src="./assets/img_login.png" alt="Banco_Img_Login"/>
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

export default PageSesion;
