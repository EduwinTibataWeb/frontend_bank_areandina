import React, { Component } from "react";
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import './PageEnviar.css';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const urlUsers="http://localhost:9000/api/users"
const urltransacciones="http://localhost:9000/api/transacciones"



class PageEnviar extends Component {
    state={
        form:{
            ID_Usuario:  '',
            Saldo: 0
        },
        user_1:{
            ID_Usuario: (cookies.get('ID_Usuario')),
            Nombre:  (cookies.get('Nombre')),
            Contrasena: (cookies.get('Contrasena')),
            Correo:(cookies.get('Correo')),
            Saldo: (cookies.get('Saldo')),
            Fecha_Activacion: (cookies.get('Fecha_Activacion'))
        },
        data_user_send:{
            
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

    sendMoney=async()=>{
        let user=this.state.form.ID_Usuario
        let saldo=this.state.form.Saldo
        if(user.length<=0 || saldo.length<=0){
            alert('Se requieren todos los datos')
            return "Datos Vacios"
        }
        
        await axios.get(urlUsers+ '/' + user)
        .then(response=>{
            return response.data
        }).then(response=>{
            var resp=response[0]
            if(response.length>0){
                this.setState({data_user_send:resp});
                this.peticionPost();
            }else{
                alert("Verificar Usario y/o Clave")
            }
        })
        .catch(error=>{
            console.log(error)
        })
    }

    peticionPost = async () => {
        try {
            const user = this.state.form.ID_Usuario;
            const saldo = Math.floor(this.state.form.Saldo);
    
            // Modificar el saldo en el objeto data_user_send
            this.state.data_user_send.Saldo += saldo;

            await axios.put(urlUsers + '/' + user, this.state.data_user_send);
            
        } catch (error) {
            console.error('Error en la solicitud PUT:', error.message);
            console.error('Detalles del error:', error.response.data);
        }
    }

    render(){
        return(
            <>
                <main className="main_enviar">
                    <section className="tarjeta_cedula">
                        <h1>Envia dinero a</h1>
                        <section className="barra_busqueda">
                            <label htmlFor="ID_Usuario"><FontAwesomeIcon icon={faMagnifyingGlass} /></label>
                            <input type="number" name="ID_Usuario" id="ID_Usuario" placeholder="C.C.: 1001091881" onChange={this.handleChange}/>
                        </section>
                        <h1>Valor</h1>
                        <section className="barra_busqueda">
                            <label htmlFor="Saldo"><FontAwesomeIcon icon={faMagnifyingGlass} /></label>
                            <input type="number" name="Saldo" id="Saldo" onChange={this.handleChange} placeholder="$ 30.000" />
                        </section>
                        <button className="btn_app_verde" onClick={() => this.sendMoney()}> Enviar <FontAwesomeIcon icon={faArrowRight} /> </button>
                    </section>
                    <section className="tarjeta_cedula">
                        <h1>Envio exitoso:</h1>
                        <button className="btn_app_verde"> Ir al inicio <FontAwesomeIcon icon={faArrowRight} /> </button>
                    </section>
                </main>
            </>
        )
    }
}

export default PageEnviar;