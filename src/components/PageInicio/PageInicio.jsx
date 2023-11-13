import React, { Component } from "react";
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import './PageInicio.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const url_transacciones = "http://localhost:9000/api/transacciones/user/";

class PageInicio extends Component {

    constructor(props) {
        super(props);
        this.state = {
          data_transacciones: [],
        };
    }
    peticionGetTranssacciones = () => {
        axios.get(url_transacciones + cookies.get('ID_Usuario')).then(response => {
          this.setState({data_transacciones:response.data});
        }).catch(error => {
          console.log(error.message);
        })

       
    }

    componentDidMount(){
        this.peticionGetTranssacciones();
    }

    render(){
        return(
            <>
                <header className="Header_index">
                    <h1>Hola { (cookies.get('Nombre'))}</h1>
                    <p>Como estas el dia de hoy?</p>
                </header>
                <main className="content_main">
                    <section className="aside_part_main">
                        <article className="tarjeta_saldo">
                            <h2>Tú saldo es:</h2>
                            <h3>{ (cookies.get('Saldo'))}</h3>
                            <p>Disponible</p>
                            <Link to='/' className="btn_app_verde"> Enviar <FontAwesomeIcon icon={faArrowRight} /> </Link>
                        </article>
                    </section>
                    <aside className="aside_part">
                        <h3>Movimientos recientes</h3>
                        <section>
                        {this.state.data_transacciones.map((transaccion) =>{
                            
                            return (
                            <article key={transaccion.Usuario_origen_id} className="tarjeta_movimiento">
                                <div>
                                    <h4>{transaccion.Usuario_origen_id}</h4>
                                    <p>{transaccion.Fecha_Movimiento}</p>
                                </div>
                                <div>
                                    <h3>{transaccion.Tipo_Movimiento}</h3>
                                    <p>{transaccion.Saldo_Movimiento}</p>
                                </div>
                            </article>
                            )   
                        })}
                           
                            <Link to='/' className="btn_app_verde"> Ver más <FontAwesomeIcon icon={faMoneyBillTransfer} /> </Link>
                        </section>
                    </aside>
                </main>
            </>
        )
    }
}

export default PageInicio;