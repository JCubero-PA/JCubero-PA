import React, { createContext, useState, useEffect } from "react";
import { MarcaService } from "../services/marcaService";

export const MarcaContext = createContext();

const MarcaContextProvider = (props) => {

  const marcaService = new MarcaService();
  // const [marcas, setMarcas] = useState([]);
  const [marcas_lineas_nn, set_marcas_lineas_nn] = useState([]);
  const [editMarca, setEditMarca] = useState(null);
  const [permiso, setPermiso] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    // marcaService.getAll().then((data) => setMarcas(data));
    marcaService.get_marcas_lineas_nn().then((data) => set_marcas_lineas_nn(data));
  }, []);

  const createMarca = async(marca) => {
    const data = await marcaService.create(marca);
    if (data.message === "OK CREATE") {
      // marcaService.getAll().then((data) => setMarcas(data));
      marcaService.get_marcas_lineas_nn().then((data) => set_marcas_lineas_nn(data));
    }
    return data;
  }

  const softDeleteMarca = async(marca) => {
    const data = await marcaService.softDelete(marca);
    if (data.message === "OK SOFTDELETE") {
      // marcaService.getAll().then((data) => { if (data.length===0) setIsEmpty(true) ; setMarcas(data)});
      marcaService.get_marcas_lineas_nn().then((data) => set_marcas_lineas_nn(data));
    }
    setEditMarca(null);
    return data;
  };

  const findMarca = (id) => {

    const marca = marcas_lineas_nn.find((m) => m.id === id);


    
    if (marca){
      marca.lineas_nn_in = marca.lineas_nn.map(x=>x.id)
      setEditMarca(marca);
    }

  };

  const updateMarca = async(marca) => {

    const data = await marcaService.update(marca);
    // console.log("LA DATA QUE REGRESA DE UPDATEMARCA : ", JSON.stringify(data));
    if (data.message === "OK UPDATE") {
      // marcaService.getAll().then((data) => setMarcas(data));
      marcaService.get_marcas_lineas_nn().then((data) => set_marcas_lineas_nn(data)); // PREGUNTAR SI VA ESTO O CÓMO DEBERÍA IR
    }

    setEditMarca(null);
    return data;
  };

  return (
    <MarcaContext.Provider value={{
        createMarca,
        findMarca,
        updateMarca,
        softDeleteMarca,
        editMarca,
        /*marcas,*/
        marcas_lineas_nn,
        permiso,
        setPermiso,
        setEditMarca,
        isEmpty
      }}
    >
      {props.children}
    </MarcaContext.Provider>
  );
};

export default MarcaContextProvider;
