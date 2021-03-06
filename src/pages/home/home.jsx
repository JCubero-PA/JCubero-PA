import React from "react";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import SideMenu from "../../components/menu/sidemenu";
import ProductoList from "../../components/productos/productoList/productoList";
import ProductoForm from "../../components/productos/productoForm/productoForm";
import ProductoContextProvider from "../../contexts/productoContext";
import { Layout } from "antd";
import "./home.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch
} from "react-router-dom";
import { ConfigProvider } from 'antd';
import es_ES from 'antd/es/locale/es_ES';
const Home = () => {
  
  let { path } = useRouteMatch();
  
  return (
    <>
      <Header />
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
              <Route path="*">
                <p>404 NOT FOUND</p>
              </Route>
            </Switch>
          </ProductoContextProvider>
        </Router>
      </main>
      <Footer />
    </>
  );
};

export default Home;
