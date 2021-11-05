import React, { useContext, useEffect, useState } from "react";
import { Col, Divider, Row, Spin, Space, Radio, Select, Dropdown, Menu, message } from "antd";
import { Button } from "antd";
import { Table } from "antd";
import { DownloadOutlined, DownOutlined, FallOutlined, FileExcelOutlined, FilterFilled, PlusOutlined, SmileOutlined, StopOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { ProductoContext } from "../../../../../contexts/productoContext";
import CrudButton from "../../../../crudButton/crudButton";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import Search from "antd/lib/input/Search";
import "./productoPaloList.css";
// import SelectOpciones from "../../selectOpciones/selectOpciones";
// import Checkbox from "antd/lib/checkbox/Checkbox";
import QueryButton from "../../queryButton";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductos,
  getProductosByLinea,
  getProductosByEstado,
  _softDeleteProducto,
} from "../../../../../_redux/ducks/producto.duck";

import { useLocation } from 'react-router-dom';
import { SesionContext } from "../../../../../contexts/sesionContext";

let JsontoXls = require('json-as-xlsx')

const { Option } = Select;
const ProductoList = (props) => {
  const location = useLocation();
  const { setMoved, sesions } = useContext(SesionContext);
  const { lineaV, marcaV, grupoV, visualizador, stocks } = props;
  const praps = props;
  // //console.log("LO QUE ME TRAJO EL VI: " + lineaV + " MARCAV : " + marcaV + " EL GRUPO: " + grupoV + " EL VISUALIZADOR: " + visualizador + " LOS STOCKS: " + stocks)
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
  // const [valueRadio, setValueRadio] = useState(null);

  const productos = useSelector((state) => state.productos.productos);
  const productos_estado = useSelector((state) => state.productos.productos_estado);
  const producto = useSelector((state) => state.productos.producto);
  const prueba = useSelector((state) => state);

  const [lineasDropdown, setlineasDropdown] = useState(null);
  const [marcasDropdown, setmarcasDropdown] = useState(null);
  const [gruposDropdown, setgruposDropdown] = useState(null);
  const [subgrupoDropdown, setsubgrupoDropdown] = useState(null);
  const [metodoabcDropdown, setmetodoabcDropdown] = useState(null);
  const [inventarioDropdown, setinventarioDropdown] = useState(null);
  const [enpaginawebDropdown, setenpaginawebDropdown] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [stop, setstop] = useState(null);
  // const [valueEstado, setValueEstado] = useState(null);

  const loading = useSelector((state) => state.productos.loading);
  const response = useSelector((state) => state.productos.response);
  const grupos = null; // AGREGADO POR MANUEL CORONEL
  const [selectedSubgrupoId, setSelectedSubgrupoId] = useState();
  const [selectedInventarioId, setSelectedInventarioId] = useState();
  const [selectedMetodoabcId, setMetodoabcId] = useState();
  const [selectedEnpaginaId, setEnpaginawebId] = useState();

  const [valueEstado, setValueEstado] = useState(
    grupos
      ? lineaV
      : !producto
        ? !response
          ? null
          : 0
        : location.state ? location.state.estadoProd : null


  );
  const [selectedLineaId, setSelectedLineaId] = useState(
    grupos
      ? lineaV
      : !producto
        ? !response
          ? null
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

  const strForSearch = (str) => {
    return str
      ? str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
      : str;
  };

  const [dataSource, setDataSource] = useState(null);
  const [rowState, setRowState] = useState(true);
  const [click, setClick] = useState(0.8);
  const [filteredInfo, setFilteredInfo] = useState([]);
  const handleChange = (pagination, filters, sorter) => {
    //console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
  };

  const dispatch = useDispatch();

  useEffect(async () => {
    await dispatch(getProductosByEstado(""));
  }, []);

  useEffect(async () => {
    if (productos_estado) {
      // console.log("ERRORRR<<<<<<<<<<<<<<<<<")
      setstop(1);
      //console.log("Ya cargo.....");
      // setsubgrupoDropdown

      setsubgrupoDropdown([... new Set(productos_estado.sort(function (a, b) {
        if (a.subgrupo.toLowerCase() < b.subgrupo.toLowerCase()) return -1;
        if (a.subgrupo.toLowerCase() > b.subgrupo.toLowerCase()) return 1;
        return 0;
      }).map(function (item) {
        //console.log("data en item<<<<: ",item);
        const rObj = {};
        rObj.id = item.fk_subgrupo_id;
        rObj.nombre = item.subgrupo;
        return rObj;
      }).map(JSON.stringify))].map(JSON.parse))

      //console.log("dropdown subgrupos (USE EFFECT): ", subgrupoDropdown);


      setinventarioDropdown([... new Set(productos_estado.sort(function (a, b) {
        if (a.tipo_inventario.toLowerCase() < b.tipo_inventario.toLowerCase()) return -1;
        if (a.tipo_inventario.toLowerCase() > b.tipo_inventario.toLowerCase()) return 1;
        return 0;
      }).map(function (item) {
        //console.log("data en item<<<<: ",item);
        const rObj = {};
        rObj.id = item.fk_tipo_inventario_id;
        rObj.nombre = item.tipo_inventario;
        return rObj;
      }).map(JSON.stringify))].map(JSON.parse))
      //console.log("dropdown inventario: ", inventarioDropdown);

      setmetodoabcDropdown([... new Set(productos_estado.sort(function (a, b) {
        if (a.metodo_abc.toLowerCase() < b.metodo_abc.toLowerCase()) return -1;
        if (a.metodo_abc.toLowerCase() > b.metodo_abc.toLowerCase()) return 1;
        return 0;
      }).map(function (item) {
        //console.log("data en item<<<<: ",item);
        const rObj = {};
        rObj.id = item.fk_metodo_abc_id;
        rObj.nombre = item.metodo_abc;
        return rObj;
      }).map(JSON.stringify))].map(JSON.parse))

      //console.log("dropdown metodo_abc: ", metodoabcDropdown);

      setenpaginawebDropdown([... new Set(productos_estado.sort(function (a, b) {
        if (a.en_web.toLowerCase() > b.en_web.toLowerCase()) return -1;
        if (a.en_web.toLowerCase() < b.en_web.toLowerCase()) return 1;
        return 0;
      }).map(function (item) {
        //console.log("data en item<<<<: ",item);
        const rObj = {};
        rObj.id = item.fk_en_web_id;
        rObj.nombre = item.en_web;
        return rObj;
      }).map(JSON.stringify))].map(JSON.parse))

      //console.log("dropdown en web: ", enpaginawebDropdown);



    }
  }, [productos_estado]);

  useEffect(() => {
    if (valueEstado !== null) {
      // console.log("ERRORRR<<<<<<<<<<<<<<<<<")
      filtrarE(valueEstado);
      //console.log("PRODUCTOS: ",productos_estado);
      if (selectedLineaId) {
        filtrarL(selectedLineaId);
        //console.log("filtrar L: ",selectedLineaId);
      }
      if (selectedMarcaId) {
        filtrarM(selectedMarcaId);
        //console.log("filtrar L: ",selectedMarcaId);
      }
      if (selectedGrupoId) {
        filtrarG(selectedGrupoId);
        //console.log("filtrar G: ",selectedGrupoId);
      }
    }
    else {
      setSelectedLineaId(null);
      setSelectedMarcaId(null);
      setSelectedGrupoId(null);
    }

    // filtrarSub(selectedSubgrupoId,1);
    // filtrarInventario(selectedInventarioId,1);
    // filtrarMetodoabc(selectedMetodoabcId,1);

  }, [valueEstado, dispatch, selectedSubgrupoId, selectedInventarioId, selectedMetodoabcId]);

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
          width: "15%",
          align: "center",
        },
        {
          title: "PRODUCTO",
          dataIndex: "nombre",
          key: "nombre",
          sorter: {
            compare: (a, b) => a.nombre.localeCompare(b.nombre),
          },
          showSorterTooltip: false,
          width: "25%",
          align: "center",
        },
        {
          title: "UND. MED.",
          dataIndex: "unidad_medida_abreviatura",
          key: "unidad_medida_abreviatura",
          sorter: {
            compare: (a, b) => a.nombre.localeCompare(b.nombre),
          },
          showSorterTooltip: false,
          width: "10%",
          align: "center",
        },
        {
          title: "PRECIO",
          dataIndex: "precio",
          key: "precio",
          sorter: {
            compare: (a, b) => a.precio - b.precio,
          },
          align: "center",
          width: "10%",
          showSorterTooltip: false,
          render: (text, record) => (
            <p>{"$" + text}</p>
          ),
        },
        {
          title: "COSTO",
          dataIndex: "costo",
          key: "costo",
          sorter: {
            compare: (a, b) => a.costo - b.costo,
          },
          align: "center",
          width: "10%",
          showSorterTooltip: false,
          render: (text, record) => (
            <p>{"$" + text}</p>
          ),
        },

        {
          title: "DESC. 1",
          dataIndex: "limite_descuento1",
          key: "limite_descuento1",
          sorter: {
            compare: (a, b) => a.precio - b.precio,
          },
          align: "center",
          width: "10%",
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
          title: "DESC. 2",
          dataIndex: "limite_descuento2",
          key: "limite_descuento2",
          sorter: {
            compare: (a, b) => a.precio - b.precio,
          },
          align: "center",
          width: "10%",
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
            <p>
              {text + "%"}
            </p>
          ),
        },

        {
          title: "DESC. 3",
          dataIndex: "limite_descuento3",
          key: "limite_descuento3",
          sorter: {
            compare: (a, b) => a.precio - b.precio,
          },
          align: "center",
          width: "10%",
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
          title: "STOCK",
          dataIndex: "",
          key: "y",
          render: (_, record) => <QueryButton record={record} />,
          align: "center",
          width: "5%",
        },

        // {
        //   title: "ACCIONES",
        //   dataIndex: "",
        //   key: "x",
        //   align: "center",
        //   render: (_, record) =>
        //     record.url_pagina_web || !visualizador ? (
        //       <CrudButton
        //         record={record}
        //         softDelete={_softDeleteProducto}
        //         setRowState={setRowState}
        //         permiso={sesions && sesions._usuario[0].rol === 2}
        //         visualizador={visualizador}
        //       />
        //     ) : (
        //       <StopOutlined style={{ fontSize: 18, marginLeft: "2vw" }} />
        //     ),
        //   width: "5%",
        // },
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
        },
        {
          title: "UND. MED.",
          dataIndex: "unidad_medida_abreviatura",
          key: "unidad_medida_abreviatura",
          sorter: {
            compare: (a, b) => a.nombre.localeCompare(b.nombre),
          },
          showSorterTooltip: false,
          width: "5%",
          align: "center",
        },
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
          title: "DESC. 1",
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
          title: "DESC. 2",
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
          title: "DESC. 3",
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
          title: "STOCK",
          dataIndex: "",
          key: "y",
          render: (_, record) => (
            <QueryButton record={record} setClick={setClick} />
          ),
          align: "center",
          width: "5%",
        },

        // {
        //   title: "ACCIONES",
        //   dataIndex: "",
        //   key: "x",
        //   align: "center",
        //   render: (_, record) =>
        //     record.url_pagina_web ? (
        //       <CrudButton
        //         record={record}
        //         softDelete={_softDeleteProducto}
        //         setRowState={setRowState}
        //         permiso={sesions && sesions._usuario[0].rol === 2}
        //         visualizador={visualizador}
        //       />
        //     ) : (
        //       <StopOutlined style={{ fontSize: 18, marginLeft: "2vw" }} />
        //     ),
        //   width: "5%",
        // },
      ];

  let history = useHistory();

  function handleClick() {
    let record = {
      permiso: true,
      nuevo: true,
    };

    history.push(`${path}/nuevo/`, record);
  }
  const recordParams = { // OBSERVACIÓN: 17/08/2021 ESTA VARIABLE SE DEBE TRAER POR PROPS, PERO COMO EL COMPONENTE QUE LA TRAE USAN TODAS LAS RAMAS QUEDA AL PENDIENTE EL CAMBIO -MC
    isVisualizador: visualizador,
    incomingPath: location.pathname,
    estadoProd: valueEstado

  };
  function ver(record) {
    //filterProductos(record.fk_linea_id);
    // record.recordParams=typeTransactionData;
    record["permiso"] = false;
    //history.push(`${path}/${record.codigo_interno}/ver`, record);
    history.push({
      pathname: `${path}/${record.codigo_interno}/ver`,

      recordParams
    }
    );
    // console.log("ver path1: ",`${path}/`);
    // console.log("ver path2: ",location.pathname);
    //console.log("ver record: ",record);
  }

  const filtrarB = (e) => {
    const filteredData4 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId)&&(selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId)&&(selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));
    const currValue = e.target.value;
    setValue(currValue);

  
      const filteredData = filteredData4.filter(
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


  const filtrarE = async (e) => {
    const filteredData = productos_estado.filter((entry) => (e === 0 ? productos_estado : entry.estado === e) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));
    //console.log("FILTRADOS X ESTADO: ", filteredData);
    //console.log("productos estado: ", productos_estado);


    setDataSource(filteredData);

    setlineasDropdown([... new Set(filteredData.sort(function (a, b) {
      if (a.linea.toLowerCase() < b.linea.toLowerCase()) return -1;
      if (a.linea.toLowerCase() > b.linea.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      const rObj = {};
      rObj.id = item.fk_linea_id;
      rObj.nombre = item.linea;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))

    //--------------------------------------------------TIPO------------------------------------------------------
    const filteredData1 = productos_estado.filter((entry) => (e === 0 || !e ? productos_estado : entry.estado === e) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));


    setsubgrupoDropdown([... new Set(filteredData1.sort(function (a, b) {
      if (a.subgrupo.toLowerCase() < b.subgrupo.toLowerCase()) return -1;
      if (a.subgrupo.toLowerCase() > b.subgrupo.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      const rObj = {};
      rObj.id = item.fk_subgrupo_id;
      rObj.nombre = item.subgrupo;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))

    //console.log("dropdown subgrupos (ESTADO): ", subgrupoDropdown);

    //-----------------------------INVENTARIO----------------------------------------------------

    //filtrarInventario(selectedInventarioId,1)
    const filteredData2 = productos_estado.filter((entry) => (e === 0 || !e ? productos_estado : entry.estado === e) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));
    setinventarioDropdown([... new Set(filteredData2.sort(function (a, b) {
      if (a.tipo_inventario.toLowerCase() < b.tipo_inventario.toLowerCase()) return -1;
      if (a.tipo_inventario.toLowerCase() > b.tipo_inventario.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_tipo_inventario_id;
      rObj.nombre = item.tipo_inventario;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //console.log("dropdown inventario: ", inventarioDropdown);

    //---------------------------------------------------------------------------------

    //-----------------------------METODO ABC----------------------------------------------------

    //filtrarMetodoabc(selectedMetodoabcId,1)

    const filteredData3 = productos_estado.filter((entry) => (e === 0 || !e ? productos_estado : entry.estado === e) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));

    setmetodoabcDropdown([... new Set(filteredData3.sort(function (a, b) {
      if (a.metodo_abc.toLowerCase() < b.metodo_abc.toLowerCase()) return -1;
      if (a.metodo_abc.toLowerCase() > b.metodo_abc.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_metodo_abc_id;
      rObj.nombre = item.metodo_abc;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //-----------------------------------------------------------------------------------------------------
    const filteredData4 = productos_estado.filter((entry) => (e === 0 ? productos_estado : entry.estado === e) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId));
    //-------------------------------------dropdown En pagina Web---------------------------------------------------

    setenpaginawebDropdown([... new Set(filteredData4.sort(function (a, b) {
      if (a.en_web.toLowerCase() < b.en_web.toLowerCase()) return -1;
      if (a.en_web.toLowerCase() > b.en_web.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_en_web_id;
      rObj.nombre = item.en_web;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    console.log("dropdown inventario: ", inventarioDropdown);

    //---------------------------------------------------------------------------------

  }
  const filtrarL = (e) => {
    let filteredData = productos_estado.filter((entry) => (valueEstado === 0 ? productos_estado : entry.estado === valueEstado) && (e === 0 ? productos_estado : entry.fk_linea_id === e) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));
    // console.log("FILTRADOS X LINEA: ", filteredData);
    setDataSource(filteredData);
    setmarcasDropdown([... new Set(filteredData.sort(function (a, b) {
      if (a.marca.toLowerCase() < b.marca.toLowerCase()) return -1;
      if (a.marca.toLowerCase() > b.marca.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      const rObj = {};
      rObj.id = item.fk_marca_id;
      rObj.nombre = item.marca;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))


    //--------------------------------------------------TIPO------------------------------------------------------
    const filteredData1 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (e === 0 || !e ? productos_estado : entry.fk_linea_id === e) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));


    setsubgrupoDropdown([... new Set(filteredData1.sort(function (a, b) {
      if (a.subgrupo.toLowerCase() < b.subgrupo.toLowerCase()) return -1;
      if (a.subgrupo.toLowerCase() > b.subgrupo.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      const rObj = {};
      rObj.id = item.fk_subgrupo_id;
      rObj.nombre = item.subgrupo;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))

    //console.log("dropdown subgrupos (ESTADO): ", subgrupoDropdown);

    //-----------------------------INVENTARIO----------------------------------------------------

    //filtrarInventario(selectedInventarioId,1)
    const filteredData2 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (e === 0 || !e ? productos_estado : entry.fk_linea_id === e) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));
    setinventarioDropdown([... new Set(filteredData2.sort(function (a, b) {
      if (a.tipo_inventario.toLowerCase() < b.tipo_inventario.toLowerCase()) return -1;
      if (a.tipo_inventario.toLowerCase() > b.tipo_inventario.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_tipo_inventario_id;
      rObj.nombre = item.tipo_inventario;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //console.log("dropdown inventario: ", inventarioDropdown);

    //---------------------------------------------------------------------------------

    //-----------------------------METODO ABC----------------------------------------------------

    //filtrarMetodoabc(selectedMetodoabcId,1)

    const filteredData3 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (e === 0 || !e ? productos_estado : entry.fk_linea_id === e) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));

    setmetodoabcDropdown([... new Set(filteredData3.sort(function (a, b) {
      if (a.metodo_abc.toLowerCase() < b.metodo_abc.toLowerCase()) return -1;
      if (a.metodo_abc.toLowerCase() > b.metodo_abc.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_metodo_abc_id;
      rObj.nombre = item.metodo_abc;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //-----------------------------------------------------------------------------------------------------
    let filteredData4 = productos_estado.filter((entry) => (valueEstado === 0 ? productos_estado : entry.estado === valueEstado) && (e === 0 ? productos_estado : entry.fk_linea_id === e) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId));
    //-------------------------------------dropdown En pagina Web---------------------------------------------------

    setenpaginawebDropdown([... new Set(filteredData4.sort(function (a, b) {
      if (a.en_web.toLowerCase() < b.en_web.toLowerCase()) return -1;
      if (a.en_web.toLowerCase() > b.en_web.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_en_web_id;
      rObj.nombre = item.en_web;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //console.log("dropdown inventario: ", inventarioDropdown);

    //---------------------------------------------------------------------------------
  };

  const filtrarM = (e) => {
    let filteredData = productos_estado.filter((entry) => (valueEstado === 0 ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 ? productos_estado : entry.fk_linea_id === selectedLineaId) && (e === 0 ? productos_estado : entry.fk_marca_id === e) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));
    // console.log("FILTRADOS X MARCA: ", filteredData);
    setDataSource(filteredData);

    setgruposDropdown([... new Set(filteredData.sort(function (a, b) {
      if (a.grupo.toLowerCase() < b.grupo.toLowerCase()) return -1;
      if (a.grupo.toLowerCase() > b.grupo.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      const rObj = {};
      rObj.id = item.fk_grupo_id;
      rObj.nombre = item.grupo;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))

    //--------------------------------------------------TIPO------------------------------------------------------
    const filteredData1 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (e === 0 || !e ? productos_estado : entry.fk_marca_id === e) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));


    setsubgrupoDropdown([... new Set(filteredData1.sort(function (a, b) {
      if (a.subgrupo.toLowerCase() < b.subgrupo.toLowerCase()) return -1;
      if (a.subgrupo.toLowerCase() > b.subgrupo.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      const rObj = {};
      rObj.id = item.fk_subgrupo_id;
      rObj.nombre = item.subgrupo;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))

    //console.log("dropdown subgrupos (ESTADO): ", subgrupoDropdown);

    //-----------------------------INVENTARIO----------------------------------------------------

    //filtrarInventario(selectedInventarioId,1)
    const filteredData2 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (e === 0 || !e ? productos_estado : entry.fk_marca_id === e) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));
    setinventarioDropdown([... new Set(filteredData2.sort(function (a, b) {
      if (a.tipo_inventario.toLowerCase() < b.tipo_inventario.toLowerCase()) return -1;
      if (a.tipo_inventario.toLowerCase() > b.tipo_inventario.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_tipo_inventario_id;
      rObj.nombre = item.tipo_inventario;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //console.log("dropdown inventario: ", inventarioDropdown);

    //---------------------------------------------------------------------------------

    //-----------------------------METODO ABC----------------------------------------------------

    //filtrarMetodoabc(selectedMetodoabcId,1)

    const filteredData3 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (e === 0 || !e ? productos_estado : entry.fk_marca_id === e) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));

    setmetodoabcDropdown([... new Set(filteredData3.sort(function (a, b) {
      if (a.metodo_abc.toLowerCase() < b.metodo_abc.toLowerCase()) return -1;
      if (a.metodo_abc.toLowerCase() > b.metodo_abc.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_metodo_abc_id;
      rObj.nombre = item.metodo_abc;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //-----------------------------------------------------------------------------------------------------
    let filteredData4 = productos_estado.filter((entry) => (valueEstado === 0 ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 ? productos_estado : entry.fk_linea_id === selectedLineaId) && (e === 0 ? productos_estado : entry.fk_marca_id === e) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId));
    //-------------------------------------dropdown En pagina Web---------------------------------------------------

    setenpaginawebDropdown([... new Set(filteredData4.sort(function (a, b) {
      if (a.en_web.toLowerCase() < b.en_web.toLowerCase()) return -1;
      if (a.en_web.toLowerCase() > b.en_web.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_en_web_id;
      rObj.nombre = item.en_web;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //console.log("dropdown inventario: ", inventarioDropdown);

    //---------------------------------------------------------------------------------



  };

  const filtrarG = (e) => {
    const filteredData = productos_estado.filter((entry) => (valueEstado === 0 ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (e === 0 ? productos_estado : entry.fk_grupo_id === e) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));
    //console.log("FILTRADOS X GRUPO", filteredData);
    // console.log("productos en GRUPO: ", filteredData);
    setDataSource(filteredData);
    //--------------------------------------------------TIPO------------------------------------------------------
    const filteredData1 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (e === 0 || !e ? productos_estado : entry.fk_grupo_id === e) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));


    setsubgrupoDropdown([... new Set(filteredData1.sort(function (a, b) {
      if (a.subgrupo.toLowerCase() < b.subgrupo.toLowerCase()) return -1;
      if (a.subgrupo.toLowerCase() > b.subgrupo.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      const rObj = {};
      rObj.id = item.fk_subgrupo_id;
      rObj.nombre = item.subgrupo;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))

    //console.log("dropdown subgrupos (ESTADO): ", subgrupoDropdown);

    //-----------------------------INVENTARIO----------------------------------------------------

    //filtrarInventario(selectedInventarioId,1)
    const filteredData2 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (e === 0 || !e ? productos_estado : entry.fk_grupo_id === e) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));
    setinventarioDropdown([... new Set(filteredData2.sort(function (a, b) {
      if (a.tipo_inventario.toLowerCase() < b.tipo_inventario.toLowerCase()) return -1;
      if (a.tipo_inventario.toLowerCase() > b.tipo_inventario.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_tipo_inventario_id;
      rObj.nombre = item.tipo_inventario;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    console.log("dropdown inventario: ", inventarioDropdown);

    //---------------------------------------------------------------------------------

    //-----------------------------METODO ABC----------------------------------------------------

    //filtrarMetodoabc(selectedMetodoabcId,1)

    const filteredData3 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (e === 0 || !e ? productos_estado : entry.fk_grupo_id === e) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));

    setmetodoabcDropdown([... new Set(filteredData3.sort(function (a, b) {
      if (a.metodo_abc.toLowerCase() < b.metodo_abc.toLowerCase()) return -1;
      if (a.metodo_abc.toLowerCase() > b.metodo_abc.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_metodo_abc_id;
      rObj.nombre = item.metodo_abc;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //-----------------------------------------------------------------------------------------------------
    const filteredData4 = productos_estado.filter((entry) => (valueEstado === 0 ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (e === 0 ? productos_estado : entry.fk_grupo_id === e) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId));
    //-------------------------------------dropdown En pagina Web---------------------------------------------------

    setenpaginawebDropdown([... new Set(filteredData4.sort(function (a, b) {
      if (a.en_web.toLowerCase() < b.en_web.toLowerCase()) return -1;
      if (a.en_web.toLowerCase() > b.en_web.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_en_web_id;
      rObj.nombre = item.en_web;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    console.log("dropdown inventario: ", inventarioDropdown);

    //---------------------------------------------------------------------------------

  };

  const filtrarSub = (e, flag) => {
    console.log("este es el id de subgrupo: ", e)
    const filteredData = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (e === 0 || !e ? productos_estado : entry.fk_subgrupo_id === e) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));
    console.log("SUBGRUPO DATA: ", filteredData)


    if (flag === 0) {

      setDataSource(filteredData);
      console.log("INVENTARIO DATA: ", filteredData)
    }

    //--------------------------------------------------TIPO------------------------------------------------------
    const filteredData1 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));


    setsubgrupoDropdown([... new Set(filteredData1.sort(function (a, b) {
      if (a.subgrupo.toLowerCase() < b.subgrupo.toLowerCase()) return -1;
      if (a.subgrupo.toLowerCase() > b.subgrupo.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      const rObj = {};
      rObj.id = item.fk_subgrupo_id;
      rObj.nombre = item.subgrupo;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))

    console.log("dropdown subgrupos (ESTADO): ", subgrupoDropdown);

    //-----------------------------INVENTARIO----------------------------------------------------

    //filtrarInventario(selectedInventarioId,1)
    const filteredData2 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (e === 0 || !e ? productos_estado : entry.fk_subgrupo_id === e) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));
    setinventarioDropdown([... new Set(filteredData2.sort(function (a, b) {
      if (a.tipo_inventario.toLowerCase() < b.tipo_inventario.toLowerCase()) return -1;
      if (a.tipo_inventario.toLowerCase() > b.tipo_inventario.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_tipo_inventario_id;
      rObj.nombre = item.tipo_inventario;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    console.log("dropdown inventario: ", inventarioDropdown);

    //---------------------------------------------------------------------------------

    //-----------------------------METODO ABC----------------------------------------------------

    //filtrarMetodoabc(selectedMetodoabcId,1)

    const filteredData3 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (e === 0 || !e ? productos_estado : entry.fk_subgrupo_id === e) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));

    setmetodoabcDropdown([... new Set(filteredData3.sort(function (a, b) {
      if (a.metodo_abc.toLowerCase() < b.metodo_abc.toLowerCase()) return -1;
      if (a.metodo_abc.toLowerCase() > b.metodo_abc.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_metodo_abc_id;
      rObj.nombre = item.metodo_abc;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //-----------------------------------------------------------------------------------------------------
    //-------------------------------------dropdown En pagina Web---------------------------------------------------
    // const filteredData4 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId));
    // const filteredData4 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (e === 0 || !e ? productos_estado : entry.fk_tipo_inventario_id === e) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId));
    const filteredData4 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (e === 0 || !e ? productos_estado : entry.fk_subgrupo_id === e) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId));

    setenpaginawebDropdown([... new Set(filteredData4.sort(function (a, b) {
      if (a.en_web.toLowerCase() < b.en_web.toLowerCase()) return -1;
      if (a.en_web.toLowerCase() > b.en_web.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_en_web_id;
      rObj.nombre = item.en_web;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    console.log("dropdown inventario: ", inventarioDropdown);

    //---------------------------------------------------------------------------------


  }

  const filtrarInventario = (e, flag) => {

    console.log("este es el id de inventario: ", e)
    const filteredData = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (e === 0 || !e ? productos_estado : entry.fk_tipo_inventario_id === e) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId));
    console.log("estos son los datos filtrados: ", filteredData)

    console.log("flag inventario: ", flag)
    if (flag === 0) {

      setDataSource(filteredData);
      console.log("INVENTARIO DATA: ", filteredData)
    }

    //------------------------dropdown INVENTARIO--------------------------------------
    const filteredData1 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId));


    setinventarioDropdown([... new Set(filteredData1.sort(function (a, b) {
      if (a.tipo_inventario.toLowerCase() < b.tipo_inventario.toLowerCase()) return -1;
      if (a.tipo_inventario.toLowerCase() > b.tipo_inventario.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_tipo_inventario_id;
      rObj.nombre = item.tipo_inventario;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    console.log("dropdown inventario: ", inventarioDropdown);
    //---------------------------------SUBGRUPO------------------------------------------------

    const filteredData2 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (e === 0 || !e ? productos_estado : entry.fk_tipo_inventario_id === e) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId));


    setsubgrupoDropdown([... new Set(filteredData2.sort(function (a, b) {
      if (a.subgrupo.toLowerCase() < b.subgrupo.toLowerCase()) return -1;
      if (a.subgrupo.toLowerCase() > b.subgrupo.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      const rObj = {};
      rObj.id = item.fk_subgrupo_id;
      rObj.nombre = item.subgrupo;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //-----------------------------METODO ABC----------------------------------------------------

    const filteredData3 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (e === 0 || !e ? productos_estado : entry.fk_tipo_inventario_id === e) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId));

    setmetodoabcDropdown([... new Set(filteredData3.sort(function (a, b) {
      if (a.metodo_abc.toLowerCase() < b.metodo_abc.toLowerCase()) return -1;
      if (a.metodo_abc.toLowerCase() > b.metodo_abc.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_metodo_abc_id;
      rObj.nombre = item.metodo_abc;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //-----------------------------------------------------------------------------------------------------
    //-------------------------------------dropdown En pagina Web---------------------------------------------------
    // const filteredData4 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId));
    const filteredData4 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (e === 0 || !e ? productos_estado : entry.fk_tipo_inventario_id === e) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId));

    setenpaginawebDropdown([... new Set(filteredData4.sort(function (a, b) {
      if (a.en_web.toLowerCase() < b.en_web.toLowerCase()) return -1;
      if (a.en_web.toLowerCase() > b.en_web.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_en_web_id;
      rObj.nombre = item.en_web;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    console.log("dropdown inventario: ", inventarioDropdown);

    //---------------------------------------------------------------------------------




  }

  const filtrarMetodoabc = (e, flag) => {
    console.log("este es el id de metodo_abc: ", e)
    console.log("productos sin filtro: ", productos_estado)
    const filteredData = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (e === 0 || !e ? productos_estado : entry.fk_metodo_abc_id === e));
    console.log("estos son los datos filtrados, metodo_abc: ", filteredData)
    console.log("flag metodo_abc: ", flag)
    if (flag === 0) {
      setDataSource(filteredData);
      console.log("metodo_abc DATA: ", filteredData)
    }
    //---------------------------------METODO ABC-----------------------------------------
    const filteredData1 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId));
    setmetodoabcDropdown([... new Set(filteredData1.sort(function (a, b) {
      if (a.metodo_abc.toLowerCase() < b.metodo_abc.toLowerCase()) return -1;
      if (a.metodo_abc.toLowerCase() > b.metodo_abc.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_metodo_abc_id;
      rObj.nombre = item.metodo_abc;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //---------------------------------------------------------------------------------------
    //---------------------------------SUBGRUPO------------------------------------------------

    const filteredData2 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (e === 0 || !e ? productos_estado : entry.fk_metodo_abc_id === e));


    setsubgrupoDropdown([... new Set(filteredData2.sort(function (a, b) {
      if (a.subgrupo.toLowerCase() < b.subgrupo.toLowerCase()) return -1;
      if (a.subgrupo.toLowerCase() > b.subgrupo.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      const rObj = {};
      rObj.id = item.fk_subgrupo_id;
      rObj.nombre = item.subgrupo;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //-------------------------------------dropdown Inventario---------------------------------------------------
    const filteredData3 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (e === 0 || !e ? productos_estado : entry.fk_metodo_abc_id === e) && (selectedEnpaginaId === 0 || !selectedEnpaginaId ? productos_estado : entry.fk_en_web_id === selectedEnpaginaId));


    setinventarioDropdown([... new Set(filteredData3.sort(function (a, b) {
      if (a.tipo_inventario.toLowerCase() < b.tipo_inventario.toLowerCase()) return -1;
      if (a.tipo_inventario.toLowerCase() > b.tipo_inventario.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_tipo_inventario_id;
      rObj.nombre = item.tipo_inventario;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    console.log("dropdown inventario: ", inventarioDropdown);

    //---------------------------------------------------------------------------------
    const filteredData4 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (e === 0 || !e ? productos_estado : entry.fk_metodo_abc_id === e));
    //-------------------------------------dropdown En pagina Web---------------------------------------------------

    setenpaginawebDropdown([... new Set(filteredData4.sort(function (a, b) {
      if (a.en_web.toLowerCase() < b.en_web.toLowerCase()) return -1;
      if (a.en_web.toLowerCase() > b.en_web.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_en_web_id;
      rObj.nombre = item.en_web;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    console.log("dropdown inventario: ", inventarioDropdown);

    //---------------------------------------------------------------------------------

  }



  const filtrarEnpaginaweb = (e, flag) => {
    console.log("este es el id de pgina_web: ", e)
    console.log("productos sin filtro: ", productos_estado)
    const filteredData = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (e === 0 || !e ? productos_estado : entry.fk_en_web_id === e));
    console.log("estos son los datos filtrados, en pagina web: ", filteredData)

    if (flag === 0) {
      setDataSource(filteredData);
      console.log("metodo_abc DATA: ", filteredData)
    }

    //---------------------------------METODO ABC-----------------------------------------
    const filteredData1 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (e === 0 || !e ? productos_estado : entry.fk_en_web_id === e));
    setmetodoabcDropdown([... new Set(filteredData1.sort(function (a, b) {
      if (a.metodo_abc.toLowerCase() < b.metodo_abc.toLowerCase()) return -1;
      if (a.metodo_abc.toLowerCase() > b.metodo_abc.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_metodo_abc_id;
      rObj.nombre = item.metodo_abc;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //---------------------------------------------------------------------------------------
    //---------------------------------SUBGRUPO------------------------------------------------

    const filteredData2 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (e === 0 || !e ? productos_estado : entry.fk_en_web_id === e));


    setsubgrupoDropdown([... new Set(filteredData2.sort(function (a, b) {
      if (a.subgrupo.toLowerCase() < b.subgrupo.toLowerCase()) return -1;
      if (a.subgrupo.toLowerCase() > b.subgrupo.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      const rObj = {};
      rObj.id = item.fk_subgrupo_id;
      rObj.nombre = item.subgrupo;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    //-------------------------------------dropdown Inventario---------------------------------------------------
    const filteredData3 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId) && (selectedInventarioId === 0 || !selectedInventarioId ? productos_estado : entry.fk_tipo_inventario_id === selectedInventarioId) && (e === 0 || !e ? productos_estado : entry.fk_en_web_id === e));

    setinventarioDropdown([... new Set(filteredData3.sort(function (a, b) {
      if (a.tipo_inventario.toLowerCase() < b.tipo_inventario.toLowerCase()) return -1;
      if (a.tipo_inventario.toLowerCase() > b.tipo_inventario.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_tipo_inventario_id;
      rObj.nombre = item.tipo_inventario;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))

    //---------------------------------------------------------------------------------
    const filteredData4 = productos_estado.filter((entry) => (valueEstado === 0 || !valueEstado ? productos_estado : entry.estado === valueEstado) && (selectedLineaId === 0 || !selectedLineaId ? productos_estado : entry.fk_linea_id === selectedLineaId) && (selectedMarcaId === 0 || !selectedMarcaId ? productos_estado : entry.fk_marca_id === selectedMarcaId) && (selectedGrupoId === 0 || !selectedGrupoId ? productos_estado : entry.fk_grupo_id === selectedGrupoId) && (selectedSubgrupoId === 0 || !selectedSubgrupoId ? productos_estado : entry.fk_subgrupo_id === selectedSubgrupoId) && (selectedMetodoabcId === 0 || !selectedMetodoabcId ? productos_estado : entry.fk_metodo_abc_id === selectedMetodoabcId));
    //-------------------------------------dropdown En pagina Web---------------------------------------------------

    setenpaginawebDropdown([... new Set(filteredData4.sort(function (a, b) {
      if (a.en_web.toLowerCase() < b.en_web.toLowerCase()) return -1;
      if (a.en_web.toLowerCase() > b.en_web.toLowerCase()) return 1;
      return 0;
    }).map(function (item) {
      //console.log("data en item<<<<: ",item);
      const rObj = {};
      rObj.id = item.fk_en_web_id;
      rObj.nombre = item.en_web;
      return rObj;
    }).map(JSON.stringify))].map(JSON.parse))
    console.log("dropdown inventario: ", inventarioDropdown);

    //---------------------------------------------------------------------------------

  }
  //......................export..................................
  let settings = {
    fileName: 'PRODUCTOS', // Name of the spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeOptions: {} // Style options from https://github.com/SheetJS/sheetjs#writing-options
  }
  //----------------------------------------------------------
  //-----------------------------------------
  const ExportToExcel = (e) => {
    // exportFromJSON({ dataSource, fileName, exportType })

    console.log("DATA SOURCE: ", selectedData);
    console.log("QUE ME MANDA EN E: ", e.key)
    let data = null
    if (e.key === "1" || e.key === "2") {
      if (e.key === "1" && selectedData.length === 0) {

        message.warning('No hay nada seleccionado para exportar');
      }
      else {
        data = [
          {
            sheet: 'productos',
            columns: [
              { label: 'Codigo', value: 'codigo_interno' }, // Top level data
              { label: 'Línea', value: 'marca' }, // Run functions
              { label: 'Marca', value: 'linea' }, // Run functions
              { label: 'Grupo', value: 'grupo' }, // Run functions
              { label: 'Modelo', value: 'modelo' }, // Run functions
              { label: 'Procedencia', value: 'procedencia' }, // Run functions
              { label: 'Proveedor', value: 'proveedor' }, // Run functions
              { label: 'Nombre', value: 'nombre' }, // Run functions
              { label: 'Estado', value: row => (row.estado === 1 ? 'ACTIVO' : 'DESCONTINUADO') }, // Run functions
              { label: 'Metodo ABC', value: 'metodo_abc' }, // Run functions
              { label: 'Tipo', value: 'tipo' }, // Run functions
              { label: 'Tipo Inventario', value: 'tipo_inventario' }, // Run functions
              { label: 'Unidad de Medida', value: 'unidad_medida' }, // Run functions
              { label: 'Unidad de Venta', value: 'unidad_venta' }, // Run functions
              { label: 'Costo', value: 'costo' }, // Run functions
              { label: 'Precio sin Iva (UNIDAD DE VENTA)', value: row => (row.precio ? row.precio : '') }, // Run functions
              { label: 'Precio con Iva (UNIDAD DE VENTA)', value: row => (row.precio ? (row.precio * (parseFloat(row.iva) + 100) / 100).toFixed(2) : '') }, // Run functions
              { label: 'Precio sin Iva (UNIDAD DE MEDIDA)', value: row => (row.precio ? (row.precio * row.dimension_unidad_venta).toFixed(2) : '') }, // Run functions
              { label: 'Precio con Iva (UNIDAD DE MEDIDA)', value: row => (row.precio ? (((row.precio * row.dimension_unidad_venta) * (parseFloat(row.iva) + 100)) / 100).toFixed(2) : '') }, // Run functions
              { label: 'Iva', value: 'iva' }, // Run functions
              { label: 'Descuento Especialista', value: 'limite_descuento1' }, // Run functions
              { label: 'Descuento Líder Retail', value: 'limite_descuento2' }, // Run functions
              { label: 'Descuento Líder Proyectos', value: 'limite_descuento3' }, // Run functions
              { label: 'Descuento Eventos', value: 'limite_descuento4' }, // Run functions
              { label: 'Límite Descuento 5', value: 'limite_descuento5' }, // Run functions
              { label: 'Dimensión de Unidad de Venta', value: 'dimension_unidad_venta' }, // Run functions
              { label: 'Total con Descuento Especialista', value: row => (row.precio ? ((row.precio * (parseFloat(row.iva) + 100) / 100) - ((row.precio * (parseFloat(row.iva) + 100) / 100) * (row.limite_descuento1 / 100))).toFixed(2) : '') }, // Run functions
              { label: 'Total con Descuento Líder Retail', value: row => (row.precio ? ((row.precio * (parseFloat(row.iva) + 100) / 100) - ((row.precio * (parseFloat(row.iva) + 100) / 100) * (row.limite_descuento2 / 100))).toFixed(2) : '') }, // Run functions
              { label: 'Total con Descuento Líder Proyecto', value: row => (row.precio ? ((row.precio * (parseFloat(row.iva) + 100) / 100) - ((row.precio * (parseFloat(row.iva) + 100) / 100) * (row.limite_descuento3 / 100))).toFixed(2) : '') }, // Run functions
              { label: 'Total con Descuento Eventos', value: row => (row.precio ? ((row.precio * (parseFloat(row.iva) + 100) / 100) - ((row.precio * (parseFloat(row.iva) + 100) / 100) * (row.limite_descuento4 / 100))).toFixed(2) : '') }, // Run functions




              // { label: 'Subcategoria', value: row => (row.grupo) }, // Run functions
              // { label: 'Descripcion', value: row => (row.nombre) }, // Run functions
              // { label: 'Codigo Catalogo', value: '' }, // Run functions
              // { label: 'Unidad de Medida', value: 'unidad_medida' }, // Run functions
              // { label: 'Unidad de Venta', value: 'unidad_venta' }, // Run functions
              // { label: 'Tipo', value: 'tipo' }, // Run functions
              // { label: 'Para la Venta', value: row => ("SI") }, // Run functions
              // { label: 'Cuenta Venta', value: '' }, // Run functions
              // { label: 'Para la Compra', value: row => ("SI") }, // Run functions
              // { label: 'Cuenta Compra', value: '' }, // Run functions
              // { label: 'Inventariable', value: '' }, // Run functions
              // { label: 'Cuenta Costo', value: '' }, // Run functions
              // { label: 'Seriado', value: '' }, // Run functions
              // { label: 'PVP1 (Sin IVA)', value: 'precio' }, // Run functions
              // { label: 'PVP2 (Sin IVA)', value: '' }, // Run functions
              // { label: 'PVP3 (Sin IVA)', value: '' }, // Run functions
              // { label: 'PVP DIST', value: '' }, // Run functions
              // { label: 'IVA', value: '' }, // Run functions
              // { label: 'ICE', value: '' }, // Run functions
              // { label: 'Minimo', value: '' }, // Run functions
              // { label: 'Codigo de Barra', value: '' }, // Run functions
              // { label: 'Para Pos', value: row => ("SI") }, // Run functions
              // { label: 'Tipo Producto', value: '' }, // Run functions
              // { label: 'Marca', value: row => (row.marca) }, // Run functions
              // { label: 'PVP Manual', value: '' }, // Run functions
              // { label: 'Precio Máx.', value: '' }, // Run functions
              // { label: 'Para Orden Compra', value: '' }, // Run functions
              // { label: 'Días Plazo', value: '' }, // Run functions
              // { label: 'Maneja Nombre Manual', value: '' }, // Run functions
              // { label: 'Para Importación', value: '' }, // Run functions
              //{ label: 'Phone', value: row => (row.marca ? row.more.phone || '' : '') }, // Deep props
            ],
            content: e.key === "1" ? selectedData : productos_estado
          }
        ];
        JsontoXls(data, settings);

        message.success(data[0].content.length + ' Productos fueron Exportados');

      }



    } else {
      data = [
        {
          sheet: 'productos',
          columns: [
            { label: 'Codigo', value: 'codigo_interno' }, // Top level data
            // { label: 'Línea', value: row => (row.linea ) }, // Run functions
            // { label: 'Marca', value: row => (row.marca ) }, // Run functions
            { label: 'Subcategoria', value: row => (row.grupo) }, // Run functions
            { label: 'Nombre', value: row => (row.nombre) }, // Run functions
            { label: 'Descripcion', value: row => (row.nombre) }, // Run functions
            { label: 'Codigo Catalogo', value: '' }, // Run functions
            { label: 'Unidad de Medida', value: 'unidad_medida' }, // Run functions
            { label: 'Unidad de Venta', value: 'unidad_venta' }, // Run functions
            { label: 'Tipo', value: 'tipo' }, // Run functions
            { label: 'Para la Venta', value: row => ("SI") }, // Run functions
            { label: 'Cuenta Venta', value: '' }, // Run functions
            { label: 'Para la Compra', value: row => ("SI") }, // Run functions
            { label: 'Cuenta Compra', value: '' }, // Run functions
            { label: 'Inventariable', value: '' }, // Run functions
            { label: 'Cuenta Costo', value: '' }, // Run functions
            { label: 'Seriado', value: '' }, // Run functions
            { label: 'PVP1 (Sin IVA)', value: 'precio' }, // Run functions
            { label: 'PVP2 (Sin IVA)', value: '' }, // Run functions
            { label: 'PVP3 (Sin IVA)', value: '' }, // Run functions
            { label: 'PVP DIST', value: '' }, // Run functions
            { label: 'IVA', value: '' }, // Run functions
            { label: 'ICE', value: '' }, // Run functions
            { label: 'Minimo', value: '' }, // Run functions
            { label: 'Codigo de Barra', value: '' }, // Run functions
            { label: 'Para Pos', value: row => ("SI") }, // Run functions
            { label: 'Tipo Producto', value: '' }, // Run functions
            { label: 'Marca', value: row => (row.marca) }, // Run functions
            { label: 'PVP Manual', value: '' }, // Run functions
            { label: 'Precio Máx.', value: '' }, // Run functions
            { label: 'Para Orden Compra', value: '' }, // Run functions
            { label: 'Días Plazo', value: '' }, // Run functions
            { label: 'Maneja Nombre Manual', value: '' }, // Run functions
            { label: 'Para Importación', value: '' }, // Run functions
            //{ label: 'Phone', value: row => (row.marca ? row.more.phone || '' : '') }, // Deep props
          ],
          content: productos_estado
        }
      ];
      JsontoXls(data, settings)
      message.success(data[0].content.length + ' Productos fueron Exportados');
    }





    // message.success(selectedData.length + ' Productos fueron Exportados');



  }
  //--------------------------------------------
  const menu = (
    <Menu  >


      <Menu.Item key="1" icon={<DownloadOutlined />} onClick={(e) => ExportToExcel(e)}>
        Exportar a Excel Seleccion ({selectedData.length > 0 ? JSON.stringify(selectedData.length) : null})  </Menu.Item>
      <Menu.Item key="2" icon={<DownloadOutlined />} onClick={(e) => ExportToExcel(e)}>
        Exportar a Excel Todo ({productos_estado && productos_estado.length > 0 ? JSON.stringify(productos_estado.length) : null})  </Menu.Item>
      <Menu.Item key="3" icon={<DownloadOutlined />} onClick={(e) => ExportToExcel(e)} >
        Exportar Excel para Contifico ({productos_estado && productos_estado.length > 0 ? JSON.stringify(productos_estado.length) : null})  </Menu.Item>
      {/* <Menu.Item key="3" icon={<DownloadOutlined />}>
    3rd menu item
  </Menu.Item> */}
    </Menu>
  );

  useEffect(() => { console.log("Selected Data", selectedData) }, [selectedData])
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedData(selectedRows)

    }
  };
  const [selectionType, setSelectionType] = useState('checkbox');
  //..-------------------------

  return (
    <>
      <Row>
        <Col offset={22}>
          {dataSource ?
            <Dropdown overlay={menu}>
              <Button style={{ height: "40" }}>
                <FileExcelOutlined style={{ color: "green" }} />
                <DownOutlined />
              </Button>
            </Dropdown>
            : <br />}
        </Col>
      </Row>


      <Divider>PRODUCTOS PALO</Divider>

      {productos_estado ?
        <div>
          <Row >
            {visualizador ? (
              <Col span={1}></Col>
            ) : (
              <Col span={24}>
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
          </Row> <br />

          <Row >
            <Col span={4}>
              <Select
                style={{ width: 200 }}
                placeholder="Seleccione Estado"
                value={valueEstado}
                onChange={async (e) => {
                  await setValueEstado(e);
                  setSelectedLineaId(null);
                  setSelectedMarcaId(null);
                  setSelectedGrupoId(null);
                  setDataSource(null);
                  setlineasDropdown(null);
                  setmarcasDropdown(null);
                  setgruposDropdown(null);
                  setValue(null);
                  filtrarE(e);
                }}
              >
                <Option value={0}>TODOS</Option>
                <Option value={1}>ACTIVOS</Option>
                <Option value={2}>DESCONTINUADOS</Option>
              </Select>
            </Col>

            <Col span={5}>
              <Select
                virtual={false}
                showSearch
                notFoundContent="No hay coincidencias"
                style={{ width: 250 }}
                placeholder="Seleccione Línea"
                value={selectedLineaId}
                // option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                filterOption={(input, option) => {
                  if (option.props.value) {
                    return strForSearch(option.props.children).includes(
                      strForSearch(input)
                    );
                  } else {
                    return false;
                  }
                }}
                //kcmlsdmclsdmc
                onChange={async (e) => {
                  await setSelectedLineaId(e);
                  setSelectedMarcaId(null);
                  setSelectedGrupoId(null);
                  setmarcasDropdown(null);
                  setgruposDropdown(null);
                  filtrarL(e);
                }}
              >
                {lineasDropdown ? <Option value={0}>TODOS</Option> : null}

                {lineasDropdown ? lineasDropdown.map((option, index) =>
                  <Option key={option.id} value={option.id}>
                    {option.nombre}
                  </Option>
                ) : null}
              </Select>
            </Col>
            <Col span={5}>
              <Select
                virtual={false}
                showSearch
                notFoundContent="No hay coincidencias"
                filterOption={(input, option) => {
                  if (option.props.value) {
                    return strForSearch(option.props.children).includes(
                      strForSearch(input)
                    );
                  } else {
                    return false;
                  }
                }}
                style={{ width: 250 }}
                placeholder="Seleccione Marca"
                onChange={async (e) => {
                  await setSelectedMarcaId(e);
                  setSelectedGrupoId(null);
                  setgruposDropdown(null);
                  filtrarM(e);
                }}
                value={selectedMarcaId}
              >
                {marcasDropdown ? <Option value={0}>TODOS</Option> : null}
                {marcasDropdown ? marcasDropdown.map((option, index) =>
                  <Option key={option.id} value={option.id}>
                    {option.nombre}
                  </Option>
                ) : null}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                virtual={false}
                showSearch
                filterOption={(input, option) => {
                  if (option.props.value) {
                    return strForSearch(option.props.children).includes(
                      strForSearch(input)
                    );
                  } else {
                    return false;
                  }
                }}
                notFoundContent="No hay coincidencias"
                style={{ width: 250 }}
                placeholder="Seleccione Grupo"
                onChange={async (e) => {
                  await setSelectedGrupoId(e);
                  filtrarG(e);
                }}
                value={selectedGrupoId}
              >
                {gruposDropdown ? <Option value={0}>TODOS</Option> : null}
                {gruposDropdown ? gruposDropdown.map((option, index) =>
                  <Option key={option.id} value={option.id}>
                    {option.nombre}
                  </Option>
                ) : null}
              </Select>
            </Col>
            <Col span={6}>
              <Search
                placeholder="Buscar producto..."

                value={value}
                onChange={(e) => filtrarB(e)}
                style={{ width: 250 }}
              />
            </Col>
          </Row>
          <br />
          <Row >
            <Col span={4}>
              <Select
                style={{ width: 200 }}
                placeholder="Seleccione Tipo"
                showSearch
                notFoundContent="No hay coincidencias"
                value={selectedSubgrupoId}
                onChange={async (e) => {
                  await setSelectedSubgrupoId(e);
                  filtrarSub(e, 0);
                }}
              >
                {subgrupoDropdown ? <Option value={0}>TODOS</Option> : null}
                {subgrupoDropdown ? subgrupoDropdown.map((option, index) =>
                  <Option key={option.id} value={option.id}>
                    {option.nombre}
                  </Option>
                ) : null}
              </Select>
            </Col>
            <Col span={5}>
              <Select
                showSearch
                notFoundContent="No hay coincidencias"
                style={{ width: 250 }}
                placeholder="Seleccione Inventario"
                value={selectedInventarioId}
                onChange={async (e) => {
                  await setSelectedInventarioId(e);

                  filtrarInventario(e, 0);
                }}
              >
                {inventarioDropdown ? <Option value={0}>TODOS</Option> : null}
                {inventarioDropdown ? inventarioDropdown.map((option, index) =>
                  <Option key={option.id} value={option.id}>
                    {option.nombre}
                  </Option>
                ) : null}
              </Select>
            </Col>

            <Col span={5}>
              <Select
                showSearch
                notFoundContent="No hay coincidencias"
                style={{ width: 250 }}
                placeholder="Seleccione Método ABC"
                value={selectedMetodoabcId}
                onChange={async (e) => {
                  await setMetodoabcId(e);
                  filtrarMetodoabc(e, 0);
                }}
              >
                {metodoabcDropdown ? <Option value={0}>TODOS</Option> : null}
                {metodoabcDropdown ? metodoabcDropdown.map((option, index) =>
                  <Option key={option.id} value={option.id}>
                    {option.nombre}
                  </Option>
                ) : null}
              </Select>
            </Col>
            <Col span={4}>
              <Select
                showSearch
                notFoundContent="No hay coincidencias"
                style={{ width: 250 }}
                placeholder="En pagina Web"
                value={selectedEnpaginaId}
                onChange={async (e) => {
                  await setEnpaginawebId(e);
                  filtrarEnpaginaweb(e, 0);
                }}
              >
                {enpaginawebDropdown ? <Option value={0}>TODOS</Option> : null}
                {enpaginawebDropdown ? enpaginawebDropdown.map((option, index) =>
                  <Option key={option.id} value={option.id}>
                    {option.nombre}
                  </Option>
                ) : null}
              </Select>
            </Col>

          </Row>

          <br />
          <Table
            locale={{ emptyText: "No hay productos" }}
            columns={columns}
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            dataSource={dataSource ? dataSource : null}
            // dataSource={productos_estado}
            rowKey="id"
            onChange={handleChange}
            pagination={{ defaultPageSize: 20 }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  if (
                    event.clientX < window.innerWidth * click &&
                    rowState &&
                    !stocks
                  ) {
                    ver(record);
                  }
                },
              };
            }}
          />
          {/* ) : (
        <Spin indicator={antIcon} className="loading" />
       )} */}
          {/* {JSON.stringify(productos)}  */}
        </div>
        : <Spin indicator={antIcon} className="loading" />}
    </>
  );
};

export default ProductoList;
