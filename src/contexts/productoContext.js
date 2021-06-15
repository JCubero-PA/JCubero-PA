import React, { createContext, useState, useEffect } from "react";
import { ProductoService } from "../services/productoService";

export const ProductoContext = createContext();

const ProductoContextProvider = (props) => {
  const productoService = new ProductoService();

  const [productos, setProductos] = useState([]);

  const [editProducto, setEditProducto] = useState(null);

  const [permiso, setPermiso] = useState(false);

  useEffect(() => {
    productoService.getProductos().then((data) => setProductos(data));
  }, []);

  const createProducto = async (producto) => {
    const data = await productoService.createProducto(producto);

    console.log("err:", data);
    if (data.message === "OK CREATE") {
      setProductos([...productos, data.data]);
    }

    return data.message;
  };

  const softDeleteProducto = (producto) => {
    productoService
      .softDeleteProducto(producto)
      .then(() => setProductos(productos.filter((p) => p.id !== producto.id)));
  };

  const findProducto = (id) => {
    console.log(id);
    const producto = productos.find((p) => p.id === id);

    setEditProducto(producto);
  };

  const updateProducto = async(producto) => {
   

    const data = await productoService.updateProducto(producto);

    console.log("err:", data);
    if (data.message === "OK UPDATE") {
      productoService.getProductos().then((data) => setProductos(data));
      //setProductos(productos.map((p) => (p.id === producto.id ? data.data : p)))
    }

    setEditProducto(null);

    return data.message;

  };

  return (
    <ProductoContext.Provider
      value={{
        createProducto,
        findProducto,
        updateProducto,
        softDeleteProducto,
        editProducto,
        productos,
        permiso,
        setPermiso,
      }}
    >
      {props.children}
    </ProductoContext.Provider>
  );
};

export default ProductoContextProvider;
