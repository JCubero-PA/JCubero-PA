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

// import "./stocks.css";
import { useDispatch, useSelector } from "react-redux";
// import {
//   /*getGruposLineaBySubgrupo,*/
//   getGruposByLineaMarca,
//   getMarcasByLinea,
//   getLineas,
//   getSubgrupos,
// } from "../../../_redux/ducks/ProductosPalo.duck";
// import { getProductosByGrupo } from "../../../_redux/ducks/ProductosPalo.duck";
import ProductoList from "../../productos/productoList/productoList";

import { useHistory, useRouteMatch } from "react-router";

console.log("ENTRAAAA PROODUCTOS PALO!! V2")

const ProductosPalo = () => {
    console.log("SUQUITOOOOSSSSS")
  // const subgrupos = useSelector((state) => state.stocks.subgrupos);
  // const productos = useSelector((state) => state.productos.productos);
  // const grupos = useSelector((state) => state.stocks.grupos);
  // const _lineas = useSelector((state) => state.stocks.lineas);

    //   const subgrupos = useSelector((state) => state.ProductosPalo.subgrupos);
    //   // console.log("EL SATESTOCKS2222: ", subgrupos)
    //   const productos = useSelector((state) => state.productos.productos);
    //   const grupos = useSelector((state) => state.ProductosPalo.grupos);
    //   const marcas = useSelector((state) => state.ProductosPalo.marcas); // CREADO JC + MC
    //   const _lineas = useSelector((state) => state.ProductosPalo.lineas);
  // console.log("EL SATESTOCKS2222 DE LINEAS: ", _lineas)


  // console.log("LAS LINEAS DEL SELECTOR: ", _lineas)
  // console.log("EL GETLINEAS: ", getLineas)
  // const loading = useSelector((state) => state.stocks.loading);
  // const loading = useSelector((state) => state.ProductosPalo.loading);
  // const [lineas, setLineas] = useState(null);
  // // console.log("LAS LINEAS DEL STATE: ", lineas)
  // // const [marcas, setMarcas] = useState([]);  **OJO
  // const [_grupos, set_Grupos] = useState(null);
  // const [checkPoint, setCheckPoint] = useState(null);
  // const [selectedLineaID, setSelectedLineaID] = useState(null);
  // const [selectedMarcaID, setSelectedMarcaID] = useState(null);
  // const [selectedGrupoID, setSelectedGrupoID] = useState(null);
  // const [hasReturn, setHasReturn] = useState(false);
  // const [title, setTitle] = useState("LÍNEAS");
  // // const [title, setTitle] = useState("TIPO");
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const history = useHistory();
  const dispatch = useDispatch();
  let { path } = useRouteMatch();

    useEffect(() => {
      // dispatch(getSubgrupos());
      // console.log("LO QUE TENGGO DE SUBGRUPOS PROPIOO: ", subgrupos)
      // dispatch(getLineas());
      // console.log("LO QUE TENGGO DE LINEAS DISPATCH PROPIO: ", lineas)
      // console.log("LO QUE TENGGO DE SUBGRUPOS DISPATCH : ", subgrupos)
    }, [dispatch]);



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
        <Divider>WWWWPPP</Divider>
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

export default ProductosPalo;