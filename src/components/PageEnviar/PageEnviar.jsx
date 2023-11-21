import React, { Component } from "react";
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import './PageEnviar.css';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const urlUsers="http://localhost:9000/api/usuarios"
const urltransacciones="http://localhost:9000/api/transacciones"



class PageEnviar extends Component {
    state={
        form:{
            Id:  '',
            Saldo: ''
        },
        user_login:{
            Id:  cookies.get("ID_Usuario"),
            Saldo: ''
        },
        data_user_send:{},
        estatus: false,
        trasaccion:{
            Usuario_origen_id: 0,
            Usuario_destino_id: 0,
            Tipo_Movimiento: "consigancion",
            Fecha_Movimiento: new Date(),
            Saldo_Anterior: 0,
            Saldo_Movimiento: 0,
            Saldo_Disponible: 0
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

    sendMoney = async () => {
        let user = this.state.form.Id;
        let saldo = this.state.form.Saldo;
        
        let user_login = this.state.user_login.Id;


        if (!user || !saldo || user == user_login) {
            alert('Se requieren todos los datos');
            return "Datos Vacios";
        }else{
            this.state.estatus = true;
        }

        try {
            const response = await axios.get(urlUsers + '/' + user);
            const userData = response.data[0];

            const response_login = await axios.get(urlUsers + '/' + user_login);
            const userData_login = response_login.data[0];
    
            if (!userData) {
                alert('No se encontraron datos para el usuario:', user);
                return;
            }
            
            this.setState({ data_user_send: userData, user_login: userData_login }, () => {
                if(this.state.user_login.Saldo < saldo){
                    alert('Saldo insuficiente')
                }else{
                    this.peticionUpdate();
                }
            });
        } catch (error) {
            console.log('Error en la solicitud GET:', error);
        }
    };
    
    peticionUpdate = async () => {
        try {
            const user = this.state.form.Id;
            const saldo = Math.floor(this.state.form.Saldo);
            
            let user_login = this.state.user_login.Id;
            
            this.state.trasaccion.Usuario_origen_id = user_login * 1;
            this.state.trasaccion.Usuario_destino_id = user * 1;
            this.state.trasaccion.Saldo_Anterior = this.state.user_login.Saldo;
            this.state.trasaccion.Saldo_Movimiento = saldo;
            
            const newDataUserSend = { ...this.state.data_user_send, Saldo: this.state.data_user_send.Saldo + saldo };
            const newDataUserLogin = { ...this.state.user_login, Saldo: this.state.user_login.Saldo - saldo };
            
            console.log(newDataUserSend, newDataUserLogin, this.state.trasaccion);
            
            this.state.trasaccion.Saldo_Disponible = newDataUserLogin.Saldo;

            await axios.post(urltransacciones, this.state.trasaccion);
            
            await axios.put(urlUsers + '/' + user, newDataUserSend);
            await axios.put(urlUsers + '/' + user_login, newDataUserLogin);
            

        } catch (error) {
            console.error('Error en la solicitud PUT:', error.message);
            console.error('Detalles del error:', error.response?.data);
        }
    };

    render(){
        return(
            <>
                <main className="main_enviar">
                {(this.state.estatus === false) ?
                    <section className="tarjeta_cedula">
                        <h1>Envia dinero a</h1>
                        <section className="barra_busqueda">
                            <label htmlFor="Id"><FontAwesomeIcon icon={faMagnifyingGlass} /></label>
                            <input type="number" name="Id" id="Id" placeholder="C.C.: 1001091881" onChange={this.handleChange}/>
                        </section>
                        <h1>Valor</h1>
                        <section className="barra_busqueda">
                            <label htmlFor="Saldo"><FontAwesomeIcon icon={faMagnifyingGlass} /></label>
                            <input type="number" name="Saldo" id="Saldo" onChange={this.handleChange} placeholder="$ 30.000" />
                        </section>
                        <button className="btn_app_verde" onClick={() => this.sendMoney()}> Enviar <FontAwesomeIcon icon={faArrowRight} /> </button>
                    </section>
                    :
                    <section className="tarjeta_cedula">
                        <h1>Envio exitoso:</h1>
                        <button className="btn_app_verde"><Link to="/"> Ir al inicio <FontAwesomeIcon icon={faArrowRight} /></Link></button>
                    </section>
                }
                </main>
            </>
        )
    }
}

export default PageEnviar;