import React, { createContext, useState, useEffect } from "react";
import { GrupoService } from "../services/grupoService";
import { LineasMarcasService } from "../services/lineasMarcasService";

export const GrupoContext = createContext();

const GrupoContextProvider = (props) => {

  const grupoService = new GrupoService();
  const lineasMarcasService = new LineasMarcasService();
  const [grupos, setGrupos] = useState([]);
  const [grupo_marcas_nn, set_grupo_marcas_nn] = useState([]);
  const [grupo_marca_subgrupo, set_grupo_marcas_subgrupo] = useState([]);
  const [editGrupo, setEditGrupo] = useState(null);
  const [permiso, setPermiso] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(async() => {
    await grupoService.getAll().then((data) => setGrupos(data));
    // console.log("useeffect");
   await grupoService.get_grupo_marcas_nn().then((data) => set_grupo_marcas_nn(data));

   await grupoService.get_grupo_marca_subgrupo().then((data) => set_grupo_marcas_subgrupo(data));
  }, []);

  const createGrupo = async(grupo) => {
    // console.log("LO QUE VIENE PARA CREAR GRUPO EM CONTEXT: " + grupo)

    const data = await grupoService.create(grupo);
    
    if (data.message === "OK CREATE") {
        grupoService.getAll().then((data) => setGrupos(data));
        grupoService.get_grupo_marcas_nn().then((data) => set_grupo_marcas_nn(data));
    }
    return data;
  }

  const softDeleteGrupo = async(grupo) => {
    const data = await grupoService.softDelete(grupo);

    if (data.message === "OK SOFTDELETE") {
        grupoService.getAll().then((data) => { if (data.length===0) setIsEmpty(true) ; setGrupos(data)});
        grupoService.get_grupo_marcas_nn().then((data) => set_grupo_marcas_nn(data));
    }
    setEditGrupo(null);
    return data;
  };

  const findGrupo = async(id) => {
    // OBSERVACIÓN: 01/09/2021 SE CAMBIO LA LÓGINA DE LAS MARCAS POR GRUPO, AHORA SOLO EXISTE UNA MARCA POR GRUPO

    // console.log("LO QUE VA A MAPPEAR: " + JSON.stringify(grupos))
    // console.log("EL ID PARA FINDGRUPO: " + id);

    const grupo = grupos.find((g) => g.id === id);
    // console.log("ACA SE DEBE ASIGNAR EL FK_LINEA_ID PARA EL FRONT Y TENGO: " + JSON.stringify(grupo_marcas_nn))
    
    if (grupo){
      
      // console.log("EL GRUPO QUE ME MAPPEO: ", grupo)
      // OBSERVACIÓN: 01/09/2021 SE CAMBIO LA LÓGINA DE LAS MARCAS POR GRUPO, AHORA SOLO EXISTE UNA MARCA POR GRUPO

      // OBSERVACIÓN: 01/09/2021 SE DEBE TRAER TODO DESDE EL SEQUELIZE, PERO  YA QUE ESTE MANEJA OTRO TIPO DE NIVEL DE CONSULTA SE TENDRÁ EN PENDIENTE

      // grupo.fk_linea_id = '61252dc1c2ac82f8cc563b5f';
      // grupo.linea = 'NOMBRE LINEA';
      // grupo.fk_marca_id = '60d4c50a77fa7bb632c22e64';
      // grupo.marca = 'QWERTY';
      // console.log("VOY A BUSVCAR EN LINEA_MARCA CON: ", grupo.fk_linea_marca)

      const lineamarca =  await lineasMarcasService.getAllLineasmarcas().then((data) => {
        // console.log("LA DATA COMO NO DEBE SER: ", data)
        // console.log("LA DATA FILTEREDDD: ", data.filter((lm) => lm.id === grupo.fk_linea_marca))
        return data.filter((lm) => lm.id === grupo.fk_linea_marca);
      });

      if (lineamarca){
        // console.log("EL LINEAMARCA: ", lineamarca[0])
        grupo.fk_linea_id = lineamarca[0].fk_linea.id;
        grupo.linea = lineamarca[0].fk_linea.nombre;
        grupo.fk_marca_id = lineamarca[0].fk_marca.id;
        grupo.marca = lineamarca[0].fk_marca.nombre;
      }

    }
    /*
    // const grupo = grupo_marcas_nn.find((g) => g.id === id);
    // console.log("ACA SE DEBE ASIGNAR EL FK_LINEA_ID PARA EL FRONT Y TENGO: " + JSON.stringify(grupo_marcas_nn))
    if (grupo){
      // console.log("EL LENGTH= " + grupo.grupo_marcas_nn.length)
      grupo.grupo_marcas_nn_in = grupo.grupo_marcas_nn.map(x=>x.id)

      // console.log("LO QUE YA LE QUIERO ASIGNAR A FKLI: " + grupo.grupo_marcas_nn[0].grupo_marca.fk_linea_id)
      // 06/08/2021 - OBSERVACIÓN: ACÁ SE DEBE DEFINIR DE MEJOR MANERA LA ASIGNACION DEL FK_LINEA_ID -MC
      
      if (grupo.grupo_marcas_nn.length > 0){
        grupo.grupo_marcas_nn[0].grupo_marca.fk_linea_id ?
        grupo.fk_linea_id = grupo.grupo_marcas_nn[0].grupo_marca.fk_linea_id 
        : grupo.fk_linea_id = '';
      } else {
        grupo.fk_linea_id = '';
      }

      if (grupo.fk_subgrupo){
        grupo.fk_subgrupo_nombre = grupo.fk_subgrupo.nombre 
      } else {
        grupo.fk_subgrupo_nombre = '';
      }

      setEditGrupo(grupo);
    }*/
    setEditGrupo(grupo);

  };

  const updateGrupo = async(grupo) => {

    const data = await grupoService.update(grupo);
    
    if (data.message === "OK UPDATE") {
        grupoService.getAll().then((data) => setGrupos(data));
        // grupoService.get_grupo_marcas_nn().then((data) => set_grupo_marcas_nn(data));
    }

    setEditGrupo(null);
    return data;
  };

  return (
    <GrupoContext.Provider value={{
        createGrupo,
        findGrupo,
        updateGrupo,
        softDeleteGrupo,
        editGrupo,
        grupos,
        grupo_marcas_nn,
        grupo_marca_subgrupo,
        permiso,
        setPermiso,
        setEditGrupo,
        isEmpty
      }}
    >
      {props.children}
    </GrupoContext.Provider>
  );
};

export default GrupoContextProvider;
