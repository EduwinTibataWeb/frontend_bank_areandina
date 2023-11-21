import React, { Component } from "react";
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import './PageInicio.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const urlUsers="http://localhost:9000/api/usuarios"
const url_transacciones = "http://localhost:9000/api/transacciones/usuarios/";

class PageInicio extends Component {

    constructor(props) {
        super(props);
        this.state = {
          data_transacciones: [],
          user_login:{
            ID_Usuario: cookies.get("ID_Usuario")
          }
        };
    }
    peticionGetusuario = async () => {

        let user_login = this.state.user_login.ID_Usuario;

        try {
            const response = await axios.get(urlUsers + '/' +user_login);
            const userData = response.data[0];
            
            this.setState({ user_login: userData });
        } catch (error) {
            console.log('Error en la solicitud GET:', error);
        }
    };

    peticionGetTranssacciones = () => {
        axios.get(url_transacciones + cookies.get('ID_Usuario')).then(response => {
          this.setState({data_transacciones:response.data});
        }).catch(error => {
          console.log(error.message);
        })       
    }


    componentDidMount(){
        this.peticionGetTranssacciones();
        this.peticionGetusuario();
    }

    render(){
        return(
            <>
                <header className="Header_index">
                    <h1>Hola {this.state.user_login.Nombre}</h1>
                    <p>Como estas el dia de hoy?</p>
                </header>
                <main className="content_main">
                    <section className="aside_part_main">
                        <article className="tarjeta_saldo">
                            <h2>Tú saldo es:</h2>
                            <h3>$ { this.state.user_login.Saldo}</h3>
                            <p>Disponible</p>
                            <Link to='/PageEnviar' className="btn_app_verde"> Enviar <FontAwesomeIcon icon={faArrowRight} /> </Link>
                        </article>
                    </section>
                    <aside className="aside_part">
                        <h3>Movimientos recientes</h3>
                        <section className="transacciones_all">
                        {this.state.data_transacciones.map((transaccion) =>{
                            
                            return (
                            <article key={transaccion.ID_Movimiento} className="tarjeta_movimiento">
                                <div>
                                    {(transaccion.Usuario_origen_id == cookies.get("ID_Usuario")) ?
                                        <h4>{transaccion.Usuario_destino_id}</h4>: 
                                        <h4>{transaccion.Usuario_origen_id}</h4>
                                    }
                                    
                                    <p>{transaccion.Fecha_Movimiento.substring(0, 10)}</p>
                                </div>
                                <div>
                                    {(transaccion.Usuario_origen_id == cookies.get("ID_Usuario")) ?
                                    <h4 className="encontra">$ - {transaccion.Saldo_Movimiento}</h4>: 
                                    <h4 className="afavor">$ + {transaccion.Saldo_Movimiento}</h4>
                                    }
                                </div>
                            </article>
                            )   
                        })}
                           
                        </section>
                        <Link to='/' className="btn_app_verde"> Ver más <FontAwesomeIcon icon={faMoneyBillTransfer} /> </Link>
                    </aside>
                </main>
            </>
        )
    }
}

export default PageInicio;