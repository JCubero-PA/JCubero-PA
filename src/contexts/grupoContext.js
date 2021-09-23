import React, { createContext, useState, useEffect } from "react";
import { GrupoService } from "../services/grupoService";
import { LineasMarcasService } from "../services/lineasMarcasService";

export const GrupoContext = createContext();

const GrupoContextProvider = (props) => {

  const grupoService = new GrupoService();
  const lineasMarcasService = new LineasMarcasService();
  // const [grupos, setGrupos] = useState([]);
  // const [grupo_marcas_nn, set_grupo_marcas_nn] = useState([]);
  const [grupo_marca_subgrupo, set_grupo_marcas_subgrupo] = useState([]);
  const [editGrupo, setEditGrupo] = useState(null);
  const [permiso, setPermiso] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(async () => {
    // await grupoService.getAll().then((data) => setGrupos(data));
    // await grupoService.get_grupo_marcas_nn().then((data) => set_grupo_marcas_nn(data));
    await grupoService.get_grupo_marca_subgrupo().then((data) => set_grupo_marcas_subgrupo(data));
  }, []);

  const createGrupo = async (grupo) => {
    // console.log("LO QUE VIENE PARA CREAR GRUPO EM CONTEXT: " + grupo)
    const data = await grupoService.create(grupo);

    if (data.message === "OK CREATE") {
      // grupoService.getAll().then((data) => setGrupos(data));
      // grupoService.get_grupo_marcas_nn().then((data) => set_grupo_marcas_nn(data));
      grupoService.get_grupo_marca_subgrupo().then((data) => set_grupo_marcas_subgrupo(data));
    }
    return data;
  }

  const softDeleteGrupo = async (grupo) => {
    const data = await grupoService.softDelete(grupo);

    if (data.message === "OK SOFTDELETE") {
      // grupoService.getAll().then((data) => { if (data.length===0) setIsEmpty(true) ; setGrupos(data)});
      // grupoService.get_grupo_marcas_nn().then((data) => set_grupo_marcas_nn(data));
      grupoService.get_grupo_marca_subgrupo().then((data) => set_grupo_marcas_subgrupo(data));
    }
    setEditGrupo(null);
    return data;
  };

  const findGrupo = async (id) => {
    // OBSERVACIÓN: 01/09/2021 SE CAMBIO LA LÓGINA DE LAS MARCAS POR GRUPO, AHORA SOLO EXISTE UNA MARCA POR GRUPO
    // console.log("LO QUE VA A MAPPEAR: " + JSON.stringify(grupo_marca_subgrupo))
    // console.log("EL ID PARA FINDGRUPO: " + id)
    // const grupo = grupos.find((g) => g.id === id);
    const grupo = grupo_marca_subgrupo.find((g) => g.id === id);
    // console.log("ACA SE DEBE ASIGNAR EL FK_LINEA_ID PARA EL FRONT Y TENGO: " + JSON.stringify(grupo_marcas_nn))
    // console
    if (grupo) {
      // OBSERVACIÓN: 01/09/2021 SE CAMBIO LA LÓGICA DE LAS MARCAS POR GRUPO, AHORA SOLO EXISTE UNA MARCA POR GRUPO
      // OBSERVACIÓN: 01/09/2021 SE DEBE TRAER TODO DESDE EL SEQUELIZE, PERO  YA QUE ESTE MANEJA OTRO TIPO DE NIVEL DE CONSULTA SE TENDRÁ EN PENDIENTE
      // OBSERVACIÓN: 15/09/2021 SE DEBE DEPURAR  ESTA PARTE DE ACÁ
      /*const lineamarca = await lineasMarcasService.getAllLineasmarcas().then((data) => {
        // console.log("LA DATA COMO NO DEBE SER: ", data)
        // console.log("LA DATA FILTEREDDD: ", data.filter((lm) => lm.id === grupo.fk_linea_marca))
        // return data.filter((lm) => lm.id === grupo.fk_linea_marca); // OBSERVACIÓN: 15/09/2021 COMO ESTABA ANTES, SE DEBE DEPURAR POR NUEVA ESTRUCTURA DE DATOS
        return data.filter((lm) => lm.id === grupo.fk_lineamarca.id);
      });*/
      // OBSERVACIÓN: 15/09/2021 SE DEBE DEPURAR  ESTA PARTE DE ACÁ
      grupo.fk_linea_id = grupo.fk_lineamarca.fk_linea.id;
      grupo.linea = grupo.fk_lineamarca.fk_linea.nombre;
      grupo.fk_marca_id = grupo.fk_lineamarca.fk_marca.id;
      grupo.marca = grupo.fk_lineamarca.fk_marca.nombre;

    }
    setEditGrupo(grupo);
  };

  const updateGrupo = async (grupo) => {

    const data = await grupoService.update(grupo);

    if (data.message === "OK UPDATE") {
      // grupoService.getAll().then((data) => setGrupos(data));
      // grupoService.get_grupo_marcas_nn().then((data) => set_grupo_marcas_nn(data));
      grupoService.get_grupo_marca_subgrupo().then((data) => set_grupo_marcas_subgrupo(data));
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
      /*grupos,
      grupo_marcas_nn,*/
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
