import React, { useEffect, useState } from "react";
import { Avatar, Button, Divider, List } from "antd";
import { Spin } from "antd";
import { PageHeader } from "antd";
import { Row, Col } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LoadingOutlined,
  HomeOutlined
} from "@ant-design/icons";

import "./stocks.css";
import { useDispatch, useSelector } from "react-redux";
import {
  /*getGruposLineaBySubgrupo,*/
  getGruposByLineaMarca,
  getMarcasByLinea,
  getLineas,
  getSubgrupos,
} from "../../../_redux/ducks/productoStocks.duck";
// import { getProductosByGrupo } from "../../../_redux/ducks/productoStocks.duck";
import ProductoList from "../../productos/productoList/productoList";
import { useHistory, useRouteMatch } from "react-router";

const ProductoStocks = () => {
  console.log("ENTRAAA EN ELL Q ")
  // const subgrupos = useSelector((state) => state.stocks.subgrupos);
  // const productos = useSelector((state) => state.productos.productos);
  // const grupos = useSelector((state) => state.stocks.grupos);
  // const _lineas = useSelector((state) => state.stocks.lineas);

  const subgrupos = useSelector((state) => state.productostocks.subgrupos);
  // console.log("EL SATESTOCKS2222: ", subgrupos)
  const productos = useSelector((state) => state.productos.productos);
  const grupos = useSelector((state) => state.productostocks.grupos);
  const marcas = useSelector((state) => state.productostocks.marcas); // CREADO JC + MC
  const _lineas = useSelector((state) => state.productostocks.lineas);
  // console.log("EL SATESTOCKS2222 DE LINEAS: ", _lineas)


  // console.log("LAS LINEAS DEL SELECTOR: ", _lineas)
  // console.log("EL GETLINEAS: ", getLineas)
  // const loading = useSelector((state) => state.stocks.loading);
  const loading = useSelector((state) => state.productostocks.loading);
  const [lineas, setLineas] = useState(null);
  // console.log("LAS LINEAS DEL STATE: ", lineas)
  // const [marcas, setMarcas] = useState([]);  **OJO
  const [_grupos, set_Grupos] = useState(null);
  const [checkPoint, setCheckPoint] = useState(null);
  const [selectedLineaID, setSelectedLineaID] = useState(null);
  const [selectedMarcaID, setSelectedMarcaID] = useState(null);
  const [selectedGrupoID, setSelectedGrupoID] = useState(null);
  const [hasReturn, setHasReturn] = useState(false);
  const [title, setTitle] = useState("LÍNEAS");
  // const [title, setTitle] = useState("TIPO");
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const history = useHistory();
  const dispatch = useDispatch();
  let { path } = useRouteMatch();

  useEffect(() => {

    // dispatch(getSubgrupos());
    // console.log("LO QUE TENGGO DE SUBGRUPOS PROPIOO: ", subgrupos)

    dispatch(getLineas());
    console.log("LO QUE TENGGO DE LINEAS DISPATCH PROPIO: ", lineas)
    // console.log("LO QUE TENGGO DE SUBGRUPOS DISPATCH : ", subgrupos)

  }, [dispatch]);

  useEffect(() => {
    // console.log("LO QUE TENFO DE SUBGRUPOS PERO OTRO USEEFFECT : ", subgrupos)
    // console.log("LO QUE TENFO DE LINEAS PERO OTRO USEEFFECT : ", lineas)
    console.log("ENTRA AL USEFEECT Q ME PUEDE SALVAR de GRUPOS : ", grupos)

    /*if (grupos) {
      console.log("VA A SETEAR LAS LINEAS Y TIENE ESTOS GRUPOS: ", grupos)
      setLineas(
        grupos
          .map((g) => g.fk_lineamarca.fk_linea)
          .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
      );
      console.log("DESPUES DEL SETEO LINEAS : ", lineas)
    }*/
    if (grupos) {
      // alert("hara la magia: ", lineas)
      // console.log("VA A SETEAR LAS LINEAS Y TIENE ESTOS GRUPOS: ", grupos)
      /*setLineas(
        grupos
          .map((g) => g.fk_lineamarca.fk_linea)
          .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
      );*/
      // console.log("DESPUES DEL SETEO LINEAS : ", lineas)
    }
  }, [grupos]);

  useEffect(() => {
    // console.log("ENTRA EN ESTE USEEFEEEC ", _lineas)
    // alert("ACA SIII")
    setLineas(_lineas);
  }, [_lineas]);

  useEffect(() => {
    if (productos) {
      console.log("Los productos", productos);
    }
  }, [productos]);

  const goGrupos = (id) => {
    setTitle("GRUPOS");
    // alert("ENTRA AL GOGRUPOS! ")
    console.log("LA DATA DE GRUPOS EN GOGRUPOS: ", JSON.stringify(grupos))
    setSelectedMarcaID(id);
    console.log(
      "los grupos",
      grupos.filter((g) => g.fk_lineamarca.fk_linea.id === id)
    );
    set_Grupos(
      grupos.filter(
        (g) =>
          g.fk_lineamarca.fk_marca.id === id &&
          g.fk_lineamarca.fk_linea.id === selectedLineaID
      )
    );
  };
  const goGrupos2 = (item) => {
    setTitle("GRUPOS");
    setHasReturn(true)
    console.log("TODO EL ITEM EN GRUPOS2: ", item)
    // console.log("DATA DE GRUPOS: ", JSON.stringify(_grupos))
    // alert("ENTRA AL GOGRUPOS22222! CON ID: "+ id)
    // setSelectedGrupoID(id);
    // console.log("EL GO LINEAS() , ", marcas)
    setSelectedMarcaID(item.id);
    dispatch(getGruposByLineaMarca(item.lineamarca_id));
    // console.log("LO QUE TENFO FESOUES DE DISOACTH: ", grupos)
    // } 
    // setMarcas()
    setCheckPoint(true);

  };

  const goMarcas = (id) => {
    setTitle("MARCAS");
    // alert("SE VA A MARCAS Y EL ID ES: " + id);
    setSelectedLineaID(id);

    // console.log("ASDF", id)
    /*grupos
        .filter((g) => g.fk_lineamarca.fk_linea.id === id)
        .map((g) => g.fk_lineamarca.fk_marca)
        .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)*/
    console.log("LA DATA A MAPPEAR DE LINEAS: ", JSON.stringify(lineas))
    // console.log("LA DATA A MAPPEAR DE GRUPOS: ", JSON.stringify(grupos))

    // console.log("LA DATA A MAPPEAR: ", JSON.stringify(lineas))


    //-----
    //setLineas(
    // lineas
    //   .map((g) => g.marcas_nn.fk_linea)
    //   .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
    //);

    console.log("LA DATA EN EL INTENTO DE MAPPEAR: ", JSON.stringify(lineas.map((l) => l.marcas_nn).filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)))
    //----
    // setMarcas(
    /*lineas
      .filter((g) => g.marca_nn.linea_marca.fk_linea_id === id)
      .map((g) => g.marca_nn.linea_marca)
      .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)*/
    // lineas
    // .filter((g) => g.marcas_nn[0].linea_marca.fk_linea_id === id)
    // .map((g) => g.marcas_nn[0].linea_marca)
    // .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
    // estoo    lineas.map((l) => l.marcas_nn).filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
    // estoo);

    setCheckPoint(true);
  };

  const goMarcas2 = (id) => {
    setTitle("MARCAS");
    setHasReturn(true);

    setSelectedLineaID(id);
    console.log("EL GO LINEAS() , ", marcas)
    /*if (id === 'all') {
      dispatch(getLineas());
    } else {*/
    dispatch(getMarcasByLinea(id));

    console.log("LOQ UE TENFO FESOUES DE DISOACTH: ", marcas)
    // }

    // setMarcas()
    setCheckPoint(true);

  };

  const goLineas = (id) => {
    setTitle("LÍNEAS");
    setHasReturn(true);
    // console.log("EL GO LINEAS()")
    if (id === 'all') {
      dispatch(getLineas());
    } else {
      dispatch(getMarcasByLinea(id));
    }
  };

  const goProductos = (id) => {
    // alert("QUIERE IRSE A PRODUCTOS CON ID GRUPO: ", id)
    setSelectedGrupoID(id);
    
  };

  const getAll = () => {
    setHasReturn(true)
    setTitle("LINEAS")
    dispatch(getLineas());
  };

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  });

  const goBack = (id) => {
    // console.log("EL ID DE GOBACK = ", id)
    if (lineas){
      if (!selectedLineaID) {
        // alert("ENTRA  IF selectedLineaID: " + selectedLineaID)
      } else if (!selectedMarcaID) {
        // alert("ENTRA  IF selectedMarcaID: " + selectedMarcaID)
        // setSelectedLineaID(null);
        // setMarcasByLinea(null)
        // setTitle("LÍNEAS");
        // // setLineas(null)
        // // setMarcasByLinea(null)
        // dispatch(getLineas());
// 
        window.location.reload();

      } else if (!selectedGrupoID) {
        // alert("ENTRA  IF selectedGrupoID: " + selectedGrupoID)

        // setGruposByLineaMarca(dis null)
        // dispatch(setGruposByLineaMarca())
        // set_Grupos(null);
        setSelectedMarcaID(null);
        setTitle("MARCAS");

      } else {
          // console.log("EMNTRO A ESTO DE DISPACTH EN GO")
          setSelectedGrupoID(null);
          // alert("ULTIMO ELSE")
          // dispatch(getSubgrupos());
          // NUEVO
          dispatch(getLineas());
        }
      
    }

    /*if (grupos) {
      if (!selectedLineaID) {
        alert("entra AL HOME")
        alert("A ESTE ALERT 111")
        setHasReturn(false); 
        setLineas(null);
        setTitle("TIPO");
      } else if (!selectedMarcaID) {
        // estoo setMarcas(null);
        alert("A ESTE ALERT 222")
        setSelectedLineaID(null);
        setTitle("LÍNEAS");
      } else if (!selectedGrupoID) {
        alert("A ESTE ALERT 333")
        set_Grupos(null);
        setSelectedMarcaID(null);
        setTitle("MARCAS");
      }   else {
        // console.log("EMNTRO A ESTO DE DISPACTH EN GO")
        setSelectedGrupoID(null);
        alert("A ESTE ALERT")
        // dispatch(getSubgrupos());
        // NUEVO
        dispatch(getLineas());
      }
    }*/
  };

  const goBackHome = (id) => {
    
    // setLineas(null);
    // 
    // set_Grupos(null);
    // setSelectedLineaID(null);
    // setSelectedMarcaID(null);
    // setTitle("LÍNEAS");
    window.location.reload();

  };

  // if (!selectedGrupoID) {
  //   return !loading ? (
  //     <>
  //       {hasReturn && (
  //         <div><Button
  //           type="primary"
  //           style={{ marginLeft: "91vw" }}
  //           icon={<ArrowLeftOutlined />}
  //           onClick={() => goBack()}
  //         />&nbsp;<Button
  //             type="primary"
  //             // style={{ marginLeft: "91vw" }}
  //             icon={<HomeOutlined />}
  //            onClick={() => goBackHome()}
  //           /></div>
  //       )}

  //       <Divider orientation="left">{title} </Divider>
  //       {/*<Divider className="titleFont" orientation="left">{"LINEA SLEECTED: " + selectedLineaID}</Divider>
  //       <Divider className="titleFont">{"GRUPO SLEECTED: " + selectedGrupoID}</Divider>
  //       <Divider className="titleFont">{"MARCA SLEECTED: " + selectedMarcaID}</Divider>
  //       <Divider className="titleFont">{"GRUPOS DATA: " + JSON.stringify(grupos)}</Divider>
  //       <Divider className="titleFont">{"CHECKPOINT: " + checkPoint}</Divider>
  //       <Divider className="titleFont">{"HASRETURN: " + hasReturn}</Divider>
  //       <Divider className="titleFont">{"SUBGRUPOS DATA: " + JSON.stringify(subgrupos)}</Divider>
  //       <Divider className="titleFont">{"MARCAS DATA: " + JSON.stringify(marcas)}</Divider>
  //       <Divider className="titleFont">{"LINEAS DATA: " + JSON.stringify(lineas)}</Divider> */}
  //       {/* <Button type="primary" style={{width:'100%', textAlign:'left'}} onClick={(()=>{lineas ? goMarcas('all'): goLineas('all')})}>TODOS <ArrowRightOutlined/></Button> */}
  //       <List
  //         itemLayout="horizontal"
  //         style={{ marginTop: "8vh" }}
  //         dataSource={
  //           grupos
  //             ? grupos
  //             : marcas && checkPoint
  //               ? marcas
  //               : marcas
  //                 ? lineas
  //                 : lineas
  //           // lineas ? lineas :  marcas && checkPoint
  //           // ? marcas : []

  //           /* marcas && checkPoint
  //            ? marcas
  //            : marcas
  //              ? lineas
  //              : lineas*/

  //           // marcas && checkPoint ? marcas : lineas ? lineas : []

  //         }
  //         renderItem={(item) => (
  //           <List.Item
  //             style={{ textAlign: "left", marginLeft: "3vw", cursor: "pointer" }}
  //             onClick={() =>
  //               /*_grupos
  //                 ? goProductos(item.id)
  //                 : marcas && checkPoint
  //                   ? goGrupos2(item.id)
  //                   : lineas
  //                     ? goMarcas2(item.id)
  //                     : goLineas(item.id)*/
  //                 grupos
  //                 ? goProductos(item.id)
  //                 : marcas && checkPoint
  //                   ? goGrupos2(item)
  //                   : lineas
  //                     ? goMarcas2(item.id)
  //                     : goLineas(item.id)
  //             }
  //           >
  //             {/* grupos
  //             ? grupos
  //             : marcas && checkPoint
  //               ? marcas
  //               : marcas
  //                 ? lineas
  //                 : lineas */}
  //             <List.Item.Meta
  //               // avatar={ 
  //               //   marcas && checkPoint ? item.countgrupos :
  //               //   lineas ? (item.marcas_nn).length > 0 ? (item.marcas_nn).length : "0" : ""}




  //               // avatar={
  //               //   <Avatar
  //               //     style={{ color: "black", backgroundColor: "#8a8a8a" }}
  //               //   >
  //               //     {(item.marcas_nn).length}
                    
  //               //   </Avatar>
  //               // }
  //               title={<p style={{ fontWeight: "bold" }}>{/*item.id*/}{item.nombre}</p>}
  //               // description={_grupos && item.fk_lineamarca.fk_marca.nombre}
  //             />
  //             <ArrowRightOutlined style={{ marginRight: "3vw" }} />
  //           </List.Item>
  //         )}
  //       />
  //     </>
  //   ) : (
  //     <Spin indicator={antIcon} className="loading" />
  //   );
  // } else {
    return (
      <>
        {hasReturn && (
          <Button
            type="primary"
            style={{ marginLeft: "91vw" }}
            icon={<ArrowLeftOutlined />}
            onClick={() => goBack()}
          />
        )}
        <Divider>WWWW222</Divider>
        <ProductoList
          // stocks={true}
          visualizador={true}
          // lineaV={selectedLineaID}
          // marcaV={selectedMarcaID}
          // grupoV={selectedGrupoID}
        />
      </>
    );
  
};

export default ProductoStocks;
