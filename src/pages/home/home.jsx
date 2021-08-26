import React, { useContext, useEffect, useState } from "react";
// import Footer from "../../components/footer/footer";
// import Header from "../../components/header/header";
// import SideMenu from "../../components/menu/sidemenu";
// import ProductoList from "../../components/productos/productoList/productoList";
// import ProductoForm from "../../components/productos/productoForm/productoForm";
// import ProductoContextProvider from "../../contexts/productoContext";
// import LineaList from "../../components/lineas/lineaList/lineaList";
// import LineaForm from "../../components/lineas/lineaForm/lineaForm";
// import LineaContextProvider from "../../contexts/lineaContext";
// import MarcaList from "../../components/marcas/marcaList/marcaList";
// import MarcaForm from "../../components/marcas/marcaForm/marcaForm";
// import MarcaContextProvider from "../../contexts/marcaContext";
// import ProveedorList from "../../components/proveedores/proveedorList/proveedorList";
// import ProveedorForm from "../../components/proveedores/proveedorForm/proveedorForm";
// import ProveedorContextProvider from "../../contexts/proveedorContext";
// import GrupoList from "../../components/grupos/grupoList/grupoList";
// import GrupoForm from "../../components/grupos/grupoForm/grupoForm";
// import GrupoContextProvider from "../../contexts/grupoContext";
// import ModeloList from "../../components/modelo/modeloList/modeloList";
// import ModeloForm from "../../components/modelo/modeloForm/modeloForm";
// import ModeloContextProvider from "../../contexts/modeloContext";



import { Layout } from "antd";
import "./home.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch
} from "react-router-dom";
// import { ConfigProvider } from 'antd';
// import es_ES from 'antd/es/locale/es_ES';
// import SubgrupoForm from "../../components/subgrupo/subgrupoForm/subgrupoForm";
// import { SubgrupoList } from "../../components/subgrupo/subgrupoList/subgrupoList";
// import SubgrupoContextProvider from "../../contexts/subgrupoContext";
const Home = () => {
  
// const Sesion= async()=>{

//   const { usuario} =  useContext(SesionContext);

//     return await usuario(); 
// }

//console.log("SESION: "+Sesion());
  
  
  let { path } = useRouteMatch();

  return (
    <>
      
        <div className="caja"></div>
      
    {/* <Header />
      <main>
        <SideMenu />
        <Router>
          <ProductoContextProvider Provider>
            <Switch>
              <Route exact path={`${path}/productos`}>
              <ConfigProvider locale={es_ES}>
                <ProductoList />
                </ConfigProvider>
              </Route>
              <Route path={`${path}/productos/:codigo?/:operacion?`}>
                <ProductoForm />
              </Route>
              <Route exact path={`${path}`}>
                <Layout style={{ height: "62vh", backgroundColor: "white", justifyContent: "center",}}>
                  <span style={{ color: "black", fontSize: "45px", fontWeight: "bold", }}>
                    PRODUCTOS - PALO ALTO
                  </span>
                </Layout>
              </Route>
            </Switch>
          </ProductoContextProvider>
          <LineaContextProvider Provider>
          <Switch>
          <Route exact path={`${path}/lineas`}>
              <LineaList />
          </Route>
          <Route path={`${path}/lineas/:codigo?/:operacion?`}>
              <LineaForm />
          </Route>
          </Switch>
            </LineaContextProvider>
          <MarcaContextProvider Provider>
          <Switch>
          <Route exact path={`${path}/marcas`}>
              <MarcaList />
          </Route>
          <Route path={`${path}/marcas/:codigo?/:operacion?`}>
              <MarcaForm />
          </Route>
          </Switch>
          </MarcaContextProvider>
          <ProveedorContextProvider Provider>
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


          <SubgrupoContextProvider>
          <Switch>
          <Route exact path={`${path}/subgrupo`}>
              <SubgrupoList />
          </Route>
          <Route path={`${path}/subgrupo/:codigo?/:operacion?`}>
              <SubgrupoForm />
          </Route>
          </Switch>
          </SubgrupoContextProvider>

            {/*<Route path="*">
              <p>404 NOT FOUND</p>
  </Route>*/}
        {/*</Router>
      </main>
      <Footer /> */}
    </>
  );
};

export default Home;
