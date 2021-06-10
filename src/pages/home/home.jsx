import React from "react";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import ProductoList from "../../components/productos/productoList/productoList";
import ProductoForm from "../../components/productos/productoForm/productoForm";
import ProductoContextProvider from "../../contexts/productoContext";
import Login from "../../pages/login/login";

import "./home.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";



const Home = () => {
  return (
    <>
      <Header />
      <main>
        <ProductoContextProvider>
          <Router>
            <Switch>
              <Route exact path="/">
                <ProductoList />
              </Route>
              <Route path="/producto">
                <ProductoForm/>
              </Route>
              <Route path="/login">
                <Login/>
              </Route>
            </Switch>
          </Router>
        </ProductoContextProvider>
      </main>
      <Footer />
    </>
  );
};

export default Home;
