import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Component } from 'react';
import "./PageTransacciones.css";
import Cookies from 'universal-cookie'
const cookies = new Cookies();

const url= "http://localhost:9000/api/transacciones";

class PageTransacciones extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: [],
          modalInsertar: false,
          modalEliminar: false,
          tipoModal:'',
          form:{
            
          }
        };
    }

    peticionGet = () => {
      axios.get(url).then(response => {
        console.log(response.data);
        this.setState({data:response.data})
      }).catch(error => {
        console.log(error.message);
      })
    }
  
    peticionPost = async () => {
      await axios.post(url, this.state.form).then(response => {
        this.modalInsertar()
        this.peticionGet()
      }).catch(error => {
        console.log(error.message);
      })
    }
  
    peticionPut = () => {
      axios.put(url+"/"+this.state.form.Id, this.state.form).then(response => {
        this.modalInsertar()
        this.peticionGet()
      }).catch(error => {
        console.log(error.message);
      })
    }
  
    peticionDelete = () => {
      axios.delete(url+"/"+this.state.form.Id).then(response => {
        this.modalEliminar()
        this.peticionGet()
      }).catch(error => {
        console.log(error.message);
      })
    }
  
  
    seleccionarUsuario=(usuario)=>{
      this.setState({
        tipoModal: 'actualizar',
        form: {
          Id: usuario.Id,
          Correo: usuario.Correo,
          Contrasena: usuario.Contrasena,
          Nombre: usuario.Nombre,
          rol: usuario.rol,
          Saldo: usuario.Saldo,
          Fecha_Activacion: usuario.Fecha_Activacion
        }
      })
    }
  
    modalInsertar = () =>{
      this.setState({modalInsertar:!this.state.modalInsertar})
    }
  
    modalEliminar = () =>{
      this.setState({modalEliminar:!this.state.modalEliminar})
    }
  
    handleChange = async e=>{  /// función para capturar los datos del usuario. Es en 2do plano debe ser asincrona
      e.persist();           /// y por eso debemos especificar persistencia
      await this.setState({   /// await regresa la ejecución de la función asincrona despues de terminar
        form:{
          ...this.state.form, /// esta linea sirve para conservar los datos que ya tenia el arreglo
          [e.target.name]: e.target.value  /// los nombres de los imputs deben ser iguales a los del arreglo
        }
      });
      console.log(this.state.form);  /// probar por consola lo que se guarda
    }
  
    //se ejecuta cuando lo realiza
    componentDidMount(){
      this.peticionGet();
    }
  
    render(){  
  
      const form = this.state.form
  
      return (
        <div className="App content_tabla" >
          <br /><br /><br />
          <button className="btn btn-success" onClick={()=> {this.setState({form:null, tipoModal:'insertar', form:{Id: this.state.data.length+1000}}); this.modalInsertar()}} >Agregar Usuario</button>
          <br /><br />
          <table className="table tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>U. origen</th>
              <th>U. destino</th>
              <th>Tipo_Movimiento</th>
              <th>Fecha_Movimiento</th>
              <th>S. Anterior</th>
              <th>S. Movimiento</th>
              <th>S. Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(transaccion => {
              return(
                <tr key={transaccion.Id}>
                  <td>{transaccion.Id}</td> 
                  <td>{transaccion.Usuario_origen_id}</td> 
                  <td>{transaccion.Usuario_destino_id}</td>
                  <td>{transaccion.Tipo_Movimiento}</td>
                  <td>{transaccion.Fecha_Movimiento}</td>
                  <td>{transaccion.Saldo_Anterior}</td>
                  <td>{transaccion.Saldo_Movimiento}</td>
                  <td>{transaccion.Saldo_Disponible}</td>
                  {(cookies.get('rol') === "sa" )?
                    <td>
                        <button className="btn btn-primary"><FontAwesomeIcon icon={faEdit} onClick = {()=>{this.seleccionarUsuario(transaccion); this.modalInsertar()}}/></button>
                        {" "}
                        <button className="btn btn-danger"><FontAwesomeIcon icon={faTrashAlt} onClick = {()=>{this.seleccionarUsuario(transaccion); this.modalEliminar()}}/></button>
                    </td>
                    :
                    <td>
                      No tienes permiso sa
                    </td>
                  }
                </tr>
              )
            })}
          </tbody>
          </table>
  
          <Modal isOpen={this.state.modalInsertar}>
            <ModalHeader style={{display:'block'}}>
            </ModalHeader>
            <ModalBody>
              <div>
                <label htmlFor="Id">ID</label>
                <input className="form-control" type="text" name="Id" id="Id" readOnly onChange={this.handleChange} value = {form ? form.Id : this.state.data.length+1}></input>
                <br />
                <label htmlFor="Correo">Email</label>
                <input className="form-control" type="text" name="Correo" id="Correo" onChange={this.handleChange} value = {form ? form.Correo : ''}></input>
                <br />
                <label htmlFor="Contrasena">Clave</label>
                <input className="form-control" type="text" name="Contrasena" id="Contrasena" onChange={this.handleChange} value = {form ? form.Contrasena : ''}></input>
                <br />
                <label htmlFor="Nombre">Nombres</label>
                <input className="form-control" type="text" name="Nombre" id="Nombre" onChange={this.handleChange} value = {form ? form.Nombre : ''}></input>
                <br />
                <label htmlFor="rol">Acesso</label>
                <select className="form-select" aria-label="Default select" name="rol" id="rol"  onChange={this.handleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="sa">sa</option>
                </select>
                <br />
              </div>
            </ModalBody>
            <ModalFooter>
              {
                this.state.tipoModal === 'insertar' ?
                <button className="btn btn-success" onClick={()=> this.peticionPost()}>Insertar</button>
                :
                <button className="btn btn-success" onClick={()=> this.peticionPut()}>Modificar</button>
              }
              <button className="btn btn-danger" onClick={()=> this.modalInsertar()} >Cancelar</button>
            </ModalFooter>
          </Modal>
  
          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
              ¿Estas seguro que deseas eliminar?
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=> this.peticionDelete()} >Si</button>
              <button className="btn btn-success" onClick={()=> this.modalEliminar()} >No</button>
            </ModalFooter>
          </Modal>
  
        </div>
    )}
}

export default PageTransacciones;