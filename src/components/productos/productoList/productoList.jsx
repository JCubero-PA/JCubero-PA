import React, { useContext, useEffect, useState } from "react";
import { Col, Divider, Row, Spin } from "antd";
import { Button } from "antd";
import { Table } from "antd";
import { PlusOutlined, SmileOutlined, StopOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { ProductoContext } from "../../../contexts/productoContext";
import CrudButton from "../../crudButton/crudButton";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import Search from "antd/lib/input/Search";
import "./productoList.css";
import SelectOpciones from "../../selectOpciones/selectOpciones";
import Checkbox from "antd/lib/checkbox/Checkbox";
import QueryButton from "./queryButton";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductos,
  getProductosByLinea,
  _softDeleteProducto,
} from "../../../_redux/ducks/producto.duck";
import { SesionContext } from "../../../contexts/sesionContext";

const ProductoList = (props) => {
  const { setMoved, sesions } = useContext(SesionContext);
  const { lineaV, marcaV, grupoV, visualizador, stocks } = props;
  // const {
  //   // productos,
  //   setPermiso,
  //   setEditProducto,
  //   isEmpty,
  //   softDeleteProducto,
  //   editProducto,
  //   filterProductos,
  // } = useContext(ProductoContext);
  let { path } = useRouteMatch();
  const [value, setValue] = useState(null);
  const productos = useSelector((state) => state.productos.productos);
  const producto = useSelector((state) => state.productos.producto);
  const loading = useSelector((state) => state.productos.loading);
  const response = useSelector((state) => state.productos.response);
  const grupos = useSelector((state) => state.stocks.grupos);
  const [selectedLineaId, setSelectedLineaId] = useState(
    grupos
      ? lineaV
      : !producto
      ? !response
        ? "60d4c046e600f1b5e85d075c"
        : response.data.fk_linea_id
      : producto.fk_linea_id
  );

  const [selectedMarcaId, setSelectedMarcaId] = useState(
    grupos
      ? marcaV
      : !producto
      ? !response
        ? null
        : response.data.fk_marca_id
      : producto.fk_marca_id
  );
  const [selectedGrupoId, setSelectedGrupoId] = useState(
    grupos
      ? grupoV
      : !producto
      ? !response
        ? null
        : response.data.fk_grupo_id
      : producto.fk_grupo_id
  );
  const [filtro, setFiltro] = useState(null);
  const [filterAll, setFilterAll] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [rowState, setRowState] = useState(true);
  const [click, setClick] = useState(0.8);
  console.log("path");
  const [filteredInfo, setFilteredInfo] = useState([]);
  // const size = useWindowSize();
  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);

    setFilteredInfo(filters);
  };

  // useEffect(() => {
  //   setEditProducto(null);
  //   console.log("LOS PRODUCTOS", productos);
  //   setPermiso(false);
  //   if (!value && !filtro ) {
  //     setDataSource(productos);
  //   }
  // });
  console.log("state", productos);
  const dispatch = useDispatch();

  useEffect(() => {
    //dispatch(getProducto('005-004-001-001'));
    //dispatch(getProductosByLinea('60d4c0476e8514b5e8c66fd5'));
    dispatch(
      selectedLineaId ? getProductosByLinea(selectedLineaId) : getProductos()
    );
  }, [dispatch, selectedLineaId]);

  useEffect(() => {
    //dispatch(getProducto('005-004-001-001'));
    //dispatch(getProductosByLinea('60d4c0476e8514b5e8c66fd5'));
    //  console.log("el filtro", filtro)
    // if (productos && producto){

    //   if (selectedMarcaId){

    //       filtrarM(selectedMarcaId)
    //   }

    //   if (selectedGrupoId){

    //       filtrarG(selectedGrupoId);
    //   }
    // }

    if (!value && !filtro) {
      setDataSource(productos);
    }
  });

  useEffect(() => {
    // filtrarG(producto.fk_grupo_id)
    setDataSource(productos);

    if (productos) {
      if (selectedMarcaId) {
        filtrarM(selectedMarcaId);
      }

      if (selectedGrupoId) {
        filtrarG(selectedGrupoId);
      }
    }
  }, [productos]);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const columns =
    sesions && sesions._usuario[0].rol === 2
      ? [
          {
            title: "CÓDIGO",
            dataIndex: "codigo_interno",
            key: "codigo_interno",
            sorter: {
              compare: (a, b) =>
                a.codigo_interno.localeCompare(b.codigo_interno),
            },
            showSorterTooltip: false,
            width: "16%",
          },
          {
            title: "PRODUCTO",
            dataIndex: "nombre",
            key: "nombre",
            sorter: {
              compare: (a, b) => a.nombre.localeCompare(b.nombre),
            },
            showSorterTooltip: false,
            width: "34%",

            // render:(text)=><Link to='/inicio'>{text}</Link>
          },
          {
            title: "UNIDAD MEDIDA",
            dataIndex: "unidad_medida_abreviatura",
            key: "unidad_medida_abreviatura",
            sorter: {
              compare: (a, b) => a.nombre.localeCompare(b.nombre),
            },
            showSorterTooltip: false,
            width: "5%",
            align: "center",

            // render:(text)=><Link to='/inicio'>{text}</Link>
          },
          {
            title: "COSTO",
            dataIndex: "costo",
            key: "costo",
            sorter: {
              compare: (a, b) => a.nombre.localeCompare(b.nombre),
            },
            showSorterTooltip: false,
            width: "5%",
            align: "center",
            render: (text, record) =>
              record.costo && (
                <p
                // onClick={() => {
                //   record["permiso"] = false;
                //   history.push(`${path}/${record.codigo_interno}/ver`, record);
                // }}
                >
                  {"$" + text}
                </p>
              ),
            // render:(text)=><Link to='/inicio'>{text}</Link>
          },
          // {
          //   title: "TIPO DE INVENTARIO",
          //   dataIndex: "tipo_inventario",
          //   key: "tipo_inventario",
          //   align:'center',
          //   sorter: {
          //     compare: (a, b) =>
          //       a.tipo_inventario.localeCompare(b.tipo_inventario),
          //   },
          //   filters: [
          //     { text: "PERMANENTE", value: "PERMANENTE" },
          //     { text: "BAJO PEDIDO", value: "BAJO PEDIDO" },
          //   ],
          //   filteredValue: filteredInfo.tipo_inventario || null,
          //   onFilter: (value, record) => record.tipo_inventario.includes(value),
          //   ellipsis: true,
          //   showSorterTooltip: false,
          //   render: (text, record) =>
          //     record.fk_linea_id === "60a7d6e408be1a4c6d9f019d" ? (
          //       <p style={{ color: "blue" }}>
          //         {" "}
          //         <SmileOutlined /> {text}
          //       </p>
          //     ) : (
          //       <p style={{ color: "black" }}>{text}</p>
          //     ),
          // },
          {
            title: "PRECIO",
            dataIndex: "precio",
            key: "precio",
            sorter: {
              compare: (a, b) => a.precio - b.precio,
            },
            align: "center",
            width: "5%",
            showSorterTooltip: false,
            render: (text, record) => (
              <p
              // onClick={() => {
              //   record["permiso"] = false;
              //   history.push(`${path}/${record.codigo_interno}/ver`, record);
              // }}
              >
                {"$" + text}
              </p>
            ),
          },

          {
            title: "ESPECIALISTA",
            dataIndex: "limite_descuento1",
            key: "limite_descuento1",
            sorter: {
              compare: (a, b) => a.precio - b.precio,
            },
            align: "center",
            width: "5%",
            showSorterTooltip: false,
            filters: [
              { text: "0%", value: "0" },
              { text: "5%", value: "5" },
              { text: "10%", value: "10" },
              { text: "40%", value: "40" },
              { text: "50%", value: "50" },
            ],
            filteredValue: filteredInfo.limite_descuento1 || null,
            onFilter: (value, record) => record.limite_descuento1 === value,
            render: (text, record) => (
              <p
              // onClick={() => {
              //   record["permiso"] = false;
              //   history.push(`${path}/${record.codigo_interno}/ver`, record);
              // }}
              >
                {text + "%"}
              </p>
            ),
          },

          {
            title: "LÍDER RETAIL",
            dataIndex: "limite_descuento2",
            key: "limite_descuento2",
            sorter: {
              compare: (a, b) => a.precio - b.precio,
            },
            align: "center",
            width: "5%",
            filters: [
              { text: "0%", value: "0" },
              { text: "5%", value: "5" },
              { text: "10%", value: "10" },
              { text: "15%", value: "15" },
            ],
            filteredValue: filteredInfo.limite_descuento2 || null,
            onFilter: (value, record) => record.limite_descuento2 === value,
            showSorterTooltip: false,
            render: (text, record) => (
              <p
              // onClick={() => {
              //   record["permiso"] = false;
              //   history.push(`${path}/${record.codigo_interno}/ver`, record);
              // }}
              >
                {text + "%"}
              </p>
            ),
          },

          {
            title: "LÍDER PROYECTOS",
            dataIndex: "limite_descuento3",
            key: "limite_descuento3",
            sorter: {
              compare: (a, b) => a.precio - b.precio,
            },
            align: "center",
            width: "5%",
            showSorterTooltip: false,
            filters: [
              { text: "0%", value: "0" },
              { text: "5%", value: "5" },
              { text: "15%", value: "15" },
              { text: "18%", value: "18" },
              { text: "20%", value: "20" },
              { text: "25%", value: "25" },
              { text: "35%", value: "35" },
            ],
            filteredValue: filteredInfo.limite_descuento3 || null,
            onFilter: (value, record) => record.limite_descuento3 === value,
            render: (text, record) => (
              <p
              // onClick={() => {
              //   record["permiso"] = false;
              //   history.push(`${path}/${record.codigo_interno}/ver`, record);
              // }}
              >
                {text + "%"}
              </p>
            ),
          },

          {
            title: "STOCK GENERAL",
            dataIndex: "",
            key: "y",
            render: (_, record) => <QueryButton record={record} />,
            align: "center",
            width: "5%",
          },

          {
            title: "ACCIONES",
            dataIndex: "",
            key: "x",
            align: "center",
            render: (_, record) =>
              record.url_pagina_web || !visualizador ? (
                <CrudButton
                  record={record}
                  softDelete={_softDeleteProducto}
                  setRowState={setRowState}
                  permiso={sesions && sesions._usuario[0].rol === 2}
                  visualizador={visualizador}
                />
              ) : (
                <StopOutlined style={{ fontSize: 18, marginLeft: "2vw" }} />
              ),
            width: "5%",
          },
        ]
      : [
          {
            title: "CÓDIGO",
            dataIndex: "codigo_interno",
            key: "codigo_interno",
            sorter: {
              compare: (a, b) =>
                a.codigo_interno.localeCompare(b.codigo_interno),
            },
            showSorterTooltip: false,
            width: "16%",
          },
          {
            title: "PRODUCTO",
            dataIndex: "nombre",
            key: "nombre",
            sorter: {
              compare: (a, b) => a.nombre.localeCompare(b.nombre),
            },
            showSorterTooltip: false,
            width: "34%",

            // render:(text)=><Link to='/inicio'>{text}</Link>
          },
          {
            title: "UNIDAD MEDIDA",
            dataIndex: "unidad_medida_abreviatura",
            key: "unidad_medida_abreviatura",
            sorter: {
              compare: (a, b) => a.nombre.localeCompare(b.nombre),
            },
            showSorterTooltip: false,
            width: "5%",
            align: "center",

            // render:(text)=><Link to='/inicio'>{text}</Link>
          },
          {
            title: "COSTO",
            dataIndex: "costo",
            key: "costo",
            sorter: {
              compare: (a, b) => a.nombre.localeCompare(b.nombre),
            },
            showSorterTooltip: false,
            width: "5%",
            align: "center",
            render: (text, record) =>
              record.costo && (
                <p
                // onClick={() => {
                //   record["permiso"] = false;
                //   history.push(`${path}/${record.codigo_interno}/ver`, record);
                // }}
                >
                  {"$" + text}
                </p>
              ),
            // render:(text)=><Link to='/inicio'>{text}</Link>
          },
          // {
          //   title: "TIPO DE INVENTARIO",
          //   dataIndex: "tipo_inventario",
          //   key: "tipo_inventario",
          //   align:'center',
          //   sorter: {
          //     compare: (a, b) =>
          //       a.tipo_inventario.localeCompare(b.tipo_inventario),
          //   },
          //   filters: [
          //     { text: "PERMANENTE", value: "PERMANENTE" },
          //     { text: "BAJO PEDIDO", value: "BAJO PEDIDO" },
          //   ],
          //   filteredValue: filteredInfo.tipo_inventario || null,
          //   onFilter: (value, record) => record.tipo_inventario.includes(value),
          //   ellipsis: true,
          //   showSorterTooltip: false,
          //   render: (text, record) =>
          //     record.fk_linea_id === "60a7d6e408be1a4c6d9f019d" ? (
          //       <p style={{ color: "blue" }}>
          //         {" "}
          //         <SmileOutlined /> {text}
          //       </p>
          //     ) : (
          //       <p style={{ color: "black" }}>{text}</p>
          //     ),
          // },
          {
            title: "PRECIO",
            dataIndex: "precio",
            key: "precio",
            sorter: {
              compare: (a, b) => a.precio - b.precio,
            },
            align: "center",
            width: "5%",
            showSorterTooltip: false,
            render: (text, record) => (
              <p
              // onClick={() => {
              //   record["permiso"] = false;
              //   history.push(`${path}/${record.codigo_interno}/ver`, record);
              // }}
              >
                {"$" + text}
              </p>
            ),
          },

          {
            title: "ESPECIALISTA",
            dataIndex: "limite_descuento1",
            key: "limite_descuento1",
            sorter: {
              compare: (a, b) => a.precio - b.precio,
            },
            align: "center",
            width: "5%",
            showSorterTooltip: false,
            filters: [
              { text: "0%", value: "0" },
              { text: "5%", value: "5" },
              { text: "10%", value: "10" },
              { text: "40%", value: "40" },
              { text: "50%", value: "50" },
            ],
            filteredValue: filteredInfo.limite_descuento1 || null,
            onFilter: (value, record) => record.limite_descuento1 === value,
            render: (text, record) => (
              <p
              // onClick={() => {
              //   record["permiso"] = false;
              //   history.push(`${path}/${record.codigo_interno}/ver`, record);
              // }}
              >
                {text + "%"}
              </p>
            ),
          },

          {
            title: "LÍDER RETAIL",
            dataIndex: "limite_descuento2",
            key: "limite_descuento2",
            sorter: {
              compare: (a, b) => a.precio - b.precio,
            },
            align: "center",
            width: "5%",
            filters: [
              { text: "0%", value: "0" },
              { text: "5%", value: "5" },
              { text: "10%", value: "10" },
              { text: "15%", value: "15" },
            ],
            filteredValue: filteredInfo.limite_descuento2 || null,
            onFilter: (value, record) => record.limite_descuento2 === value,
            showSorterTooltip: false,
            render: (text, record) => (
              <p
              // onClick={() => {
              //   record["permiso"] = false;
              //   history.push(`${path}/${record.codigo_interno}/ver`, record);
              // }}
              >
                {text + "%"}
              </p>
            ),
          },

          {
            title: "LÍDER PROYECTOS",
            dataIndex: "limite_descuento3",
            key: "limite_descuento3",
            sorter: {
              compare: (a, b) => a.precio - b.precio,
            },
            align: "center",
            width: "5%",
            showSorterTooltip: false,
            filters: [
              { text: "0%", value: "0" },
              { text: "5%", value: "5" },
              { text: "15%", value: "15" },
              { text: "18%", value: "18" },
              { text: "20%", value: "20" },
              { text: "25%", value: "25" },
              { text: "35%", value: "35" },
            ],
            filteredValue: filteredInfo.limite_descuento3 || null,
            onFilter: (value, record) => record.limite_descuento3 === value,
            render: (text, record) => (
              <p
              // onClick={() => {
              //   record["permiso"] = false;
              //   history.push(`${path}/${record.codigo_interno}/ver`, record);
              // }}
              >
                {text + "%"}
              </p>
            ),
          },

          {
            title: "STOCK GENERAL",
            dataIndex: "",
            key: "y",
            render: (_, record) => (
              <QueryButton record={record} setClick={setClick} />
            ),
            align: "center",
            width: "5%",
          },

          {
            title: "ACCIONES",
            dataIndex: "",
            key: "x",
            align: "center",
            render: (_, record) =>
              record.url_pagina_web ? (
                <CrudButton
                  record={record}
                  softDelete={_softDeleteProducto}
                  setRowState={setRowState}
                  permiso={sesions && sesions._usuario[0].rol === 2}
                  visualizador={visualizador}
                />
              ) : (
                <StopOutlined style={{ fontSize: 18, marginLeft: "2vw" }} />
              ),
            width: "5%",
          },
        ];

  let history = useHistory();

  function handleClick() {
    //filterProductos("60d4c046e600f1b5e85d075c");
    //setPermiso(true);
    let record = {
      permiso: true,
      nuevo: true,
    };

    history.push(`${path}/nuevo/`, record);
  }

  function ver(record) {
    //filterProductos(record.fk_linea_id);
    record["permiso"] = false;
    history.push(`${path}/${record.codigo_interno}/ver`, record);
  }

  const filtrarB = (e) => {
    const currValue = e.target.value;
    setValue(currValue);
    const filteredData = productos.filter(
      (entry) =>
        (entry.codigo_interno.toLowerCase().includes(currValue.toLowerCase()) ||
          entry.nombre.toLowerCase().includes(currValue.toLowerCase()) ||
          entry.unidad_medida_abreviatura
            .toLowerCase()
            .includes(currValue.toLowerCase()) ||
          entry.precio.toString().includes(currValue)) &&
        (selectedMarcaId ? entry.fk_marca_id === selectedMarcaId : true) &&
        (selectedGrupoId ? entry.fk_grupo_id === selectedGrupoId : true)
    );

    setDataSource(filteredData);
  };

  const filtrarM = (e) => {
    setFiltro(e);

    const filteredData = productos.filter((entry) => entry.fk_marca_id === e);

    console.log("FILTRADOS X MARCA", filteredData);

    setDataSource(filteredData);
  };

  const filtrarG = (e) => {
    setFiltro(e);

    const filteredData = productos.filter(
      (entry) =>
        entry.fk_grupo_id === e && entry.fk_marca_id === selectedMarcaId
    );

    console.log("FILTRADOS X GRUPO", filteredData);

    setDataSource(filteredData);
  };

  const filtroGlobal = (e) => {
    if (e.target.checked) {
      //filterProductos("all");
      setSelectedLineaId(null);
      setSelectedMarcaId(null);
      setSelectedGrupoId(null);
    } else {
      console.log("AQUI!!!!");
      setSelectedLineaId("60d4c046e600f1b5e85d075c");
      //filterProductos("60d4c046e600f1b5e85d075c");
    }

    setFilterAll(e.target.checked);
    setFiltro(null);
  };

  //---------------------------------------------------------------------

  //-----------------------------------------------------------------------

  return (
    <div>
      <br />
      <Divider>PRODUCTOS</Divider>
      <br />
      <Row>
        {visualizador ? (
          <Col span={1}></Col>
        ) : (
          <Col span={3}>
            <Button
              type="primary"
              className="success"
              icon={<PlusOutlined />}
              onClick={() => handleClick()}
              disabled={sesions && sesions._usuario[0].rol === 2 ? false : true}
            >
              Nuevo
            </Button>
          </Col>
        )}

        <Col span={5}>
          <SelectOpciones
            tipo="línea"
            onChange={(e) => {
              dispatch(getProductosByLinea(e));
              setSelectedLineaId(e);
              setSelectedMarcaId(null);
              setSelectedGrupoId(null);
              setFiltro(null);
              setValue(null);
              setFilterAll(false);
            }}
            value={selectedLineaId}
          />
        </Col>
        <Col span={5}>
          <SelectOpciones
            tipo="marca"
            filter={selectedLineaId}
            onChange={(e) => {
              setSelectedMarcaId(e);
              setSelectedGrupoId(null);
              setDataSource(null);
              filtrarM(e);
            }}
            value={selectedMarcaId}
          />
        </Col>
        <Col span={5}>
          <SelectOpciones
            tipo="grupo"
            filter={selectedMarcaId}
            filter2={selectedLineaId}
            onChange={(e) => {
              setSelectedGrupoId(e);
              filtrarG(e);
            }}
            value={selectedGrupoId}
          />
        </Col>
        <Col span={4}>
          <Search
            placeholder="Buscar producto..."
            value={value}
            onChange={(e) => filtrarB(e)}
            style={{ width: 200 }}
          />
        </Col>
        <Col span={2}>
          <Checkbox onChange={(e) => filtroGlobal(e)} checked={filterAll}>
            Todos
          </Checkbox>
        </Col>
      </Row>

      <br />
      {!loading ? (
        <Table
          locale={{ emptyText: "No hay productos" }}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          onChange={handleChange}
          pagination={{ defaultPageSize: 20 }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                console.log(event);

                if (
                  event.clientX < window.innerWidth * click &&
                  rowState &&
                  !stocks
                ) {
                  // record["permiso"] = false;
                  // history.push(`${path}/${record.codigo_interno}/ver`, record);
                  ver(record);
                }
              },
            };
          }}
        />
      ) : (
        <Spin indicator={antIcon} className="loading" />
      )}
      {/* {JSON.stringify(productos)}  */}
    </div>
  );
};

// function useWindowSize() {
//   const [windowSize, setWindowSize] = useState({
//     width: undefined,
//     height: undefined,
//   });
//   useEffect(() => {
//     function handleResize() {
//       setWindowSize({
//         width: window.innerWidth,
//         height: window.innerHeight,
//       });
//     }
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return windowSize;
// }
export default ProductoList;
