import React, { useContext, useEffect, useState } from "react";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import SideMenu from "../../components/menu/sidemenu";
import ProductoList from "../../components/productos/productoList/productoList";
import ProductoForm from "../../components/productos/productoForm/productoForm";
import ProductoContextProvider from "../../contexts/productoContext";
import LineaList from "../../components/lineas/lineaList/lineaList";
import LineaForm from "../../components/lineas/lineaForm/lineaForm";
import LineaContextProvider from "../../contexts/lineaContext";
import MarcaList from "../../components/marcas/marcaList/marcaList";
import MarcaForm from "../../components/marcas/marcaForm/marcaForm";
import MarcaContextProvider from "../../contexts/marcaContext";
import ProveedorList from "../../components/proveedores/proveedorList/proveedorList";
import ProveedorForm from "../../components/proveedores/proveedorForm/proveedorForm";
import ProveedorContextProvider from "../../contexts/proveedorContext";
import GrupoList from "../../components/grupos/grupoList/grupoList";
import GrupoForm from "../../components/grupos/grupoForm/grupoForm";
import GrupoContextProvider from "../../contexts/grupoContext";
import { useHistory } from "react-router";

// import ModeloList from "../../components/modelo/modeloList/modeloList";
// import ModeloForm from "../../components/modelo/modeloForm/modeloForm";
// import ModeloContextProvider from "../../contexts/modeloContext";


import { Layout } from "antd";
import "./home.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import es_ES from "antd/es/locale/es_ES";
import SubgrupoForm from "../../components/subgrupo/subgrupoForm/subgrupoForm";
import { SubgrupoList } from "../../components/subgrupo/subgrupoList/subgrupoList";
import SubgrupoContextProvider from "../../contexts/subgrupoContext";
import { SesionContext } from "../../contexts/sesionContext";
import Stocks from "../../components/visualizadores/stocks/stocks";
const Home = () => {
  var { setMoved, sesions,redirect } = useContext(SesionContext);
  let history = useHistory();
  // const Sesion= async()=>{

  //   const { usuario} =  useContext(SesionContext);

  //     return await usuario();
  // }

  function prueba()
  {
    
  try
    {
      console.log("");
    }
    catch(e)
    {

    }
      

  }
  //console.log("SESION: "+Sesion());
  let { path } = useRouteMatch();


  return (
    <>
      {localStorage.getItem("token")?sesions?
       <>
     <Header />
      <main>
        <SideMenu />
        <Router>
          <Switch>
            <Route exact path={`${path}/productos`}>
              <ConfigProvider locale={es_ES}>
                  <ProductoList />
              </ConfigProvider>
            </Route>
            <Route exact path={`${path}/visualizadores/productos`}>
              <ConfigProvider locale={es_ES}>
                  <ProductoList visualizador={true} />
              </ConfigProvider>
            </Route>
            <Route exact path={`${path}/visualizadores/stocks`}>
                <Stocks />
            </Route>
            
            <Route path={`${path}/(productos|visualizadores/stocks|visualizadores/productos)/:codigo?/:operacion?`}>
              <ConfigProvider locale={es_ES}>                
                <ProductoForm />
              </ConfigProvider>

            </Route>
            

           
            <Route exact path={`${path}`}>
              <Layout
                style={{
                  height: "62vh",
                  backgroundColor: "white",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "black",
                    fontSize: "45px",
                    fontWeight: "bold",
                  }}
                >
                  PRODUCTOS - PALO ALTO
                </span>
              </Layout>
            </Route>
            <Route exact path={`${path}/lineas`}>
              <LineaContextProvider>
                <LineaList />
              </LineaContextProvider>
            </Route>
            <Route path={`${path}/lineas/:codigo?/:operacion?`}>
              <LineaContextProvider>
                <LineaForm />
              </LineaContextProvider>
            </Route>
            <Route exact path={`${path}/marcas`}>
              <MarcaContextProvider>
                <MarcaList />
              </MarcaContextProvider>
            </Route>
            <Route path={`${path}/marcas/:codigo?/:operacion?`}>
              <MarcaContextProvider>
                <MarcaForm />
              </MarcaContextProvider>
            </Route>
            <Route exact path={`${path}/subgrupo`}>
              <SubgrupoContextProvider>
                <SubgrupoList />
              </SubgrupoContextProvider>
            </Route>
            <Route path={`${path}/subgrupo/:codigo?/:operacion?`}>
              <SubgrupoContextProvider>
                <SubgrupoForm />
              </SubgrupoContextProvider>
            </Route>
            <Route exact path={`${path}/proveedores`}>
              <ProveedorContextProvider>
                <ProveedorList />
              </ProveedorContextProvider>
            </Route>
            <Route path={`${path}/proveedores/:codigo?/:operacion?`}>
              <ProveedorContextProvider>
                <ProveedorForm />
              </ProveedorContextProvider>
            </Route>
            <Route exact path={`${path}/grupos`}>
              <GrupoContextProvider>
                <GrupoList />
              </GrupoContextProvider>
            </Route>
            <Route path={`${path}/grupos/:codigo?/:operacion?`}>
              <GrupoContextProvider>
                <GrupoForm />
              </GrupoContextProvider>
            </Route>
            {/* <Route exact path={`${path}/modelos`}>
              <ModeloContextProvider>
                <ModeloList />
              </ModeloContextProvider>
            </Route>
            <Route path={`${path}/modelos/:codigo?/:operacion?`}>
              <ModeloContextProvider>
                <ModeloForm />
              </ModeloContextProvider>
            </Route> */}
          </Switch>

          {/* <ProveedorContextProvider Provider>
          <Switch>
          <Route exact path={`${path}/proveedores`}>
              <ProveedorList />
          </Route>
          <Route path={`${path}/proveedores/:codigo?/:operacion?`}>
              <ProveedorForm />
          </Route>
          </Switch>
          </ProveedorContextProvider>
          <GrupoContextProvider Provider>
          <Switch>
          <Route exact path={`${path}/grupos`}>
              <GrupoList />
          </Route>
          <Route path={`${path}/grupos/:codigo?/:operacion?`}>
              <GrupoForm />
          </Route>
          </Switch>
          </GrupoContextProvider>
          <ModeloContextProvider Provider>
          <Switch>
          <Route exact path={`${path}/modelos`}>
              <ModeloList />
          </Route>
          <Route path={`${path}/modelos/:codigo?/:operacion?`}>
              <ModeloForm />
          </Route>
          </Switch>
          </ModeloContextProvider>
            {/*<Route path="*">
              <p>404 NOT FOUND</p>
  </Route>*/}
        </Router>
      </main>
      <Footer />
      </>
      :null
            :history.push("/login")}
    </>
  );
          



};

export default Home;