import { Component } from "react";
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCircleUser, faCirclePlus, faPowerOff, faUserPlus, faFaceSmile} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import './Menu.css';
import Cookies from 'universal-cookie'
const cookies = new Cookies();
//Imports - Menu

const url= "http://localhost:9000/api/users"
const url_deportes= "http://localhost:9000/api/users";
//URL BD Deportes - para el Menu 

class Menu extends Component{
  
  //Estados React para los cambios del Menu
  constructor(props) {
    super(props);
    this.state = {
      menu: "desactive_menu_items",
      icon: "desactive_menu_icon",
      iconUser: "desactive_iconUser",
      data:[],
      data_deporte:[],//Donde se guardan los datos BD Deportes
      deporte_menu: "",
      agregar_menu: "",
      data_usuario:[],
      logueado: true,
      userName: "",
    };
    this.menuActive = this.menuActive.bind(this); 
    this.userLogActive = this.userLogActive.bind(this); 
  }


  // Funciones Para el Responsive del Menu
  menuActive() {
    var menuState = (this.state.menu === "desactive_menu_items") ? "active_menu_items" : "desactive_menu_items";
    var iconState = (this.state.icon === "desactive_menu_icon") ? "active_menu_icon" : "desactive_menu_icon";
    this.setState({
       menu: menuState,
       icon: iconState
    });
  }

  activeItem = (id_deporte, deporte) =>{
    this.setState({deporte_menu: deporte});
    this.setState({deporte_menu_id: id_deporte});
    cookies.set("deporte_menu" ,deporte,{path:"/"})
    cookies.set("deporte_menu_id", id_deporte,{path:"/"})
    window.location.href='./PageDeporte';
  }

  activeAgregar = (agregar) =>{
    this.setState({agregar_menu: agregar});
    cookies.set("agregar_menu" ,agregar,{path:"/"})
    window.location.href='./PageAgregar';
  }

  userLogActive() {
    var iconUserAction = (this.state.iconUser === "desactive_iconUser") ? "active_menu_items" : "desactive_iconUser";
    this.setState({
      iconUser: iconUserAction,
    });
  }

  userLogOut = () =>{
    this.setState({logueado:false})
    cookies.remove("Correo",{path:"/"})
    cookies.remove("Nombre",{path:"/"})
    cookies.remove("Saldo",{path:"/"})
    cookies.remove("ID_Usuario", {path:"/"})
    cookies.remove("Fecha_Activacion", {path:"/"})
    window.location.href='./'
  }
  

  // Funciones Para traer la informacion de la BD Deportes
  peticion_get_deportes= ()=>{
    axios.get(url_deportes).then(response=>{
      this.setState({data_deporte:response.data})
    })
    .catch(error => {
      console.log(error.message)
    }
    )
  }
  peticion_get_usuarios= ()=>{
    axios.get(url).then(response=>{
      this.setState({data_usuario:response.data})
    })
    .catch(error => {
      console.log(error.message)
    }
    )
  }

  // Funciones Para Inicializar cuando el Dom este listo
  componentDidMount(){
    this.peticion_get_deportes()
    this.peticion_get_usuarios()
    if(cookies.get("usu_nombre")){
      this.setState({logueado:true})
    }else{
        this.setState({logueado:false})
    }
  }

  render(){
    return(
        <nav className="menu_top">
          <div className="menu_img">
          </div>
          <ul className={`menu_items ${this.state.menu}`}>
            <li className="menu_item">
              <Link to='/'>Inicio</Link>
            </li>
            <li className="menu_item">
              <Link to='/PageEnviar'>Enviar</Link>
            </li>
            <li className="menu_item" onClick={this.userLogOut}>
              <a>Cerrar sesión</a>  
            </li>
          </ul>
          
          <div className={`icon_menu_top ${this.state.icon}`} onClick={this.menuActive}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </nav>
        )
  }

}

export default Menu;