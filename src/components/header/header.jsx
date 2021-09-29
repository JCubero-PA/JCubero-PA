import React,{ useContext,useEffect,useState} from "react";
import { Menu, Button, Dropdown, Row, Col} from "antd";
import { UserOutlined } from '@ant-design/icons';
import "./header.css";
import { SesionContext } from "../../../src/contexts/sesionContext";
import { useHistory, useRouteMatch } from "react-router";
import logo from "./logo192.png";





const Header = () => {
  let { path } = useRouteMatch();
    let history = useHistory();
  const { sesions,LogOut} =  useContext(SesionContext);
  const userName = JSON.parse(localStorage.getItem("user"));
  

//----------------------------------------------------------------------


// }, [sesions]);

//if(permiso){

 
//}


//-----------------------------------------------------------------------

   

  const menu = (
    <Menu>
      
      <Menu.Item key="1">
        <a target="_blank" rel="noopener noreferrer" href="./">
          Account Info
        </a>
      </Menu.Item>
      <Menu.Item key="2" onClick={e => { logOut();   }}>
     
     


          Log Out
      </Menu.Item>
      
    </Menu>
    
  );
  
function valid()
{
  //  if(sesions._usuario[0].rol.nombre)
  //  {
  //   return (sesions._usuario[0].rol.nombre.toUpperCase())
  //  }
  //  else {
  //    return "NO HAY"
  //  }
//console.log("Sesion:"+JSON.stringify(sesions))
  if (sesions){
  if(sesions._usuario[0].rol===2)
  {
   return ("PALO ALTO")
  }
  else {
    return "PALO ALTO"
  }
}


};

 

  function  logOut() {
    LogOut();
    history.push("/login");
    //DeleteSesion();
    //message.success('Log Out');
    //localStorage.clear();
    //history.push("/login");
   //*//window.location.reload();

  }

  return (
    <header className="main-header">
      {/* { localStorage.getItem("token")?sesions? */}
      <Row>
      {/* <Col span={8} className="labels-header">{ sesions ? valid() :"PALO ALTO - Especialista en Pisos" }</Col> */}
      <Col span={8} className="labels-header">
      <a href={`${path}`}>
        <img src={logo} alt="logo" style={{
        height:"30px",
        width:"30px",
        marginLeft:"10px"

      }} />
       </a>
      
      </Col>

      {/* <Col span={8} className="labels-header">PALO ALTO - Especialista en Pisos</Col> */}
      <Col span={8}></Col>
      <Col span={8} className="icons-end-header"><Dropdown overlay={menu} placement="bottomLeft">
        <Button icon={<UserOutlined />}>{sesions._usuario[0].nombre}</Button>
        </Dropdown>
      </Col>
    </Row>
    {/* :null
    :history.push("/login")    } */}
    </header>
  );
};

export default Header;
