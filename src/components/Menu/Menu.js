import { Component } from "react";
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faCircleUser, faCirclePlus, faPowerOff, faUserPlus, faFaceSmile} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import './Menu.css';
import Cookies from 'universal-cookie'
const cookies = new Cookies();
//Imports - Menu

const url= "http://localhost:9000/api/usuarios"
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
    cookies.remove("ID_Usuario", {path:"/"})
    cookies.remove("rol", {path:"/"})
    window.location.href='./'
  }
  

  // Funciones Para traer la informacion de la BD Deportes
  peticion_get_usuarios= ()=>{
    axios.get(url + '/' + cookies.get('ID_Usuario')).then(response=>{
      this.setState({data_usuario:response.data[0]})
    })
    .catch(error => {
      console.log(error.message)
    }
    )
  }

  // Funciones Para Inicializar cuando el Dom este listo
  componentDidMount(){
    
    if(cookies.get("ID_Usuario")){
      this.setState({logueado:true})
      this.peticion_get_usuarios()
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
          <Link to='/'>INICIO</Link>
        </li>
        
      </ul>
      {this.state.logueado
      ?<div className={`user_login ${this.state.logueado}`}>
        <FontAwesomeIcon  onClick={this.userLogActive} icon={faCircleUser}/>
        <ul className={`submenu_login ${this.state.iconUser}`}>
            <li className="submenu_header">{this.state.data_usuario.Nombre}<br/> <span>{this.state.data_usuario.rol}</span> </li>
            <hr/>
            {(this.state.data_usuario.rol === "admin" || this.state.data_usuario.rol === "sa")?
            <>
            <li className="submenu_item"><Link to='/PageUsuarios'> <FontAwesomeIcon icon={faUserPlus}/> Administrador de usuarios </Link></li>
            <li className="submenu_item"><Link to='/PageTransacciones'> <FontAwesomeIcon icon={faCirclePlus}/> A. de transacciones </Link></li>
            
            <hr/>
            </>
            :<>
            <li className="submenu_item"><FontAwesomeIcon icon={faFaceSmile} /> Bienvenido</li>
            <hr/></>
          }
            <li className="submenu_item log-out" onClick={this.userLogOut}><FontAwesomeIcon icon={faPowerOff}/> Cerrar sesión</li>
        </ul>
      </div>
      : <ul className={`menu_items ${this.state.menu} `}>
          <li className="menu_item">
            <Link to='/PageSesion'>Iniciar sesión</Link>
          </li>
          <li className="menu_item item_borde">
            <Link to='/PageRegistro'>Registrarse</Link>
          </li>
        </ul>
      }
      
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