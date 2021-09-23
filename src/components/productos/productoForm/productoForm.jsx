import React, { useContext, useEffect, useState } from "react";
import {
  message,
  Row,
  Col,
  Divider,
  Spin,
  Collapse,
  Select,
  Space,
  Image,
  Tooltip,
} from "antd";
import { Form, Input, Button, Checkbox, InputNumber, Radio } from "antd";
import SelectOpciones from "../../selectOpciones/selectOpciones";
import { ProductoContext } from "../../../contexts/productoContext";
import { useHistory } from "react-router";
import { Redirect, useParams, useRouteMatch } from "react-router-dom";
import "./productoForm.css";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseSquareOutlined,
  EditOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  PlusOutlined,
  PushpinFilled,
  QrcodeOutlined,
  RollbackOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ColorService } from "../../../services/colorService";
import { GrupoService } from "../../../services/grupoService";
import { LineaService } from "../../../services/lineaService";
import {
  usosCartuchos,
  usosMallasCeramica,
  usosMallasPisosFlotantes,
  usosPegamentos,
  usosSubcapa,
  usosTermostatos,
} from "../../../utils/usos";
import { tiposFilamento } from "../../../utils/tipoFilamento";
import { MarcaService } from "../../../services/marcaService";
import { ProductoProductoTipoService } from "../../../services/productoProductoTipoService";
import { ProductoTipoService } from "../../../services/productoTipoService";
import { Typography } from "antd";
import { ProductoService } from "../../../services/productoService";
import { SesionContext } from "../../../contexts/sesionContext";
import Modal from "antd/lib/modal/Modal";
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import {
  addProducto,
  getProducto,
  _editProducto,
  _getSerialModelo,
} from "../../../_redux/ducks/producto.duck";

const { Title } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Option } = Select;

const FormProducto = (props) => {
  var { setMoved, sesions } = useContext(SesionContext);

  let formHasChanges = false;
  // console.log(props);
  // const location = useLocation();
  let { path } = useRouteMatch();

  console.log("path", path);
  // console.log(props);
  // const {
  //   createProducto,
  //   updateProducto,
  //   findProducto,
  //   //editProducto,
  //   getSerialModelo,
  // } = useContext(ProductoContext);

  let history = useHistory();
  let { codigo, operacion } = useParams();

  console.log("codigo", codigo);
  console.log("operacion", operacion);

  const [selectedMarcaId, setSelectedMarcaId] = useState(undefined);
  const [selectedLineaId, setSelectedLineaId] = useState(undefined);
  const [selectedGrupoId, setSelectedGrupoId] = useState(undefined);
  const [selectedGrupoName, setSelectedGrupoName] = useState(undefined);
  const [selectedModeloCodigo, setSelectedModeloCodigo] = useState(undefined);
  const [newModelo, setNewModelo] = useState(false);
  const [stock, setStock] = useState(null);
  const [tipoInventario, setTipoInventario] = useState(undefined);
  const [tipoProducto, setTipoProducto] = useState(undefined);
  const [generacionClick, setGeneracionClick] = useState(undefined);
  const [tieneSubcapaAdherida, setTieneSubcapaAdherida] = useState(undefined);
  const [usoCesped, setUsoCesped] = useState(undefined);
  const [rangoAlturaHebra, setRangoAlturaHebra] = useState(undefined);
  const [metodoABC, setMetodoABC] = useState(undefined);
  const [nombre, setNombre] = useState(undefined);
  const [nombreEdit, setNombreEdit] = useState(false);
  const [QR, setQR] = useState(null);
  const [stockBodegas, setstockBodegas] = useState(null);
  const [crud, setCrud] = useState(
    operacion === "editar" || codigo === "nuevo" ? true : false
  );
  const [unidadMedida, setUnidadMedida] = useState("");

  const [id, setId] = useState(null);
  const [show, setShow] = useState(null);
  const [infoTecnicaLinea, setinfoTecnicaLinea] = useState(null);
  const [infoTecnicaGrupo, setinfoTecnicaGrupo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(null);
  const [_serial, set_Serial] = useState(null);
  // const [precio, setPrecio] = useState(null)
  const [form] = Form.useForm();
  let initialValues = {
    en_sistema_externo: false,
    en_web: false,
    iva: 12,
    limite_descuento1: 0,
    limite_descuento2: 0,
    limite_descuento3: 0,
    limite_descuento4: 0,
    limite_descuento5: 0,
  };

  var tiposFilamentoList = tiposFilamento.map(function (opcion) {
    return (
      <Option key={opcion.id} value={opcion.id}>
        {opcion.nombre.toUpperCase()}
      </Option>
    );
  });

  var cartuchosList = usosCartuchos.map(function (opcion) {
    return (
      <Option key={opcion.id} value={opcion.id}>
        {opcion.nombre.toUpperCase()}
      </Option>
    );
  });

  var mallasCeramicaList = usosMallasCeramica.map(function (opcion) {
    return (
      <Option key={opcion.id} value={opcion.id}>
        {opcion.nombre.toUpperCase()}
      </Option>
    );
  });

  var mallasPisosFlotantesList = usosMallasPisosFlotantes.map(function (
    opcion
  ) {
    return (
      <Option key={opcion.id} value={opcion.id}>
        {opcion.nombre.toUpperCase()}
      </Option>
    );
  });

  var pegamentosList = usosPegamentos.map(function (opcion) {
    return (
      <Option key={opcion.id} value={opcion.id}>
        {opcion.nombre.toUpperCase()}
      </Option>
    );
  });

  var subcapaList = usosSubcapa.map(function (opcion) {
    return (
      <Option key={opcion.id} value={opcion.id}>
        {opcion.nombre.toUpperCase()}
      </Option>
    );
  });

  var termostatosList = usosTermostatos.map(function (opcion) {
    return (
      <Option key={opcion.id} value={opcion.id}>
        {opcion.nombre.toUpperCase()}
      </Option>
    );
  });
  const response = useSelector((state) => state.productos.response);

  useEffect(() => {
    window.onpopstate = (e) => {
      window.scrollTo(0, 0);
      console.log("ATRAS");
    };
  });

  useEffect(() => {
    if (response) {
      if (response.message.includes("OK")) {
        console.log(response);
        //setPermiso(false);
        window.scrollTo(0, 0);
        message.info("OK", 2).then((t) => history.push("/home/productos/"));
      } else {
        message.warning(response.message);
      }
    }
  }, [response]);

  // useEffect(() => {
  //   if (infoTecnicaLinea === "60d4c0476e8514b5e8c66fd5") {
  //     console.log("piso de ingenieria!!!");
  //     setCapaDesgaste("LACA ULTIMTEC");
  //   } else if (infoTecnicaLinea === "60d4c04851cbd1b5e83632d3") {
  //     console.log("bambú!!");

  //     setCapaDesgaste("LACA UV DE ÓXIDO DE ALUMINIO");
  //   } else if (infoTecnicaLinea === "60d4c0491b6606b5e836f80f") {
  //     console.log("lvt!!");

  //     setCapaDesgaste("PUR");
  //   }
  // }, [infoTecnicaLinea]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (codigo !== "nuevo") {
      dispatch(getProducto(codigo));
    }
  }, [dispatch]);

  const editProducto = useSelector((state) => state.productos.producto);
  const serial = useSelector((state) => state.productos.serial);
  const grupos = useSelector((state) => state.stocks.grupos);

  console.log("EL PROD", editProducto);

  useEffect(async () => {
    if (
      form.getFieldValue("codigo_interno") &&
      form.getFieldValue("fk_grupo_id")
    ) {

      if (operacion === "editar"){
        if (form.getFieldValue("fk_grupo_id") !== editProducto.fk_grupo_id) {
          const grupoService = new GrupoService();
          const grupo = await grupoService.getOne(
            form.getFieldValue("fk_grupo_id")
          );
          // if(form.getFieldValue("fk_grupo_id") === "60d617647b18b7ca135e1d53" ){
          //const serial = await getSerialModelo(changedValues[formFieldName]);
          // if (selectedLineaId === "60d4c04c0a5d5fb5e8e1ce12") {
          if (serial) {
            form.setFieldsValue({
              codigo_interno:
                form.getFieldValue("codigo_interno").substring(0, 7) +
                "-" +
                grupo.codigo +
                "-" +
                serial,
            });
          }
        }else{
          form.setFieldsValue({
            codigo_interno:
              editProducto.codigo_interno
          });
        }
      }else{
        const grupoService = new GrupoService();
          const grupo = await grupoService.getOne(
            form.getFieldValue("fk_grupo_id")
          );
          // if(form.getFieldValue("fk_grupo_id") === "60d617647b18b7ca135e1d53" ){
          //const serial = await getSerialModelo(changedValues[formFieldName]);
          // if (selectedLineaId === "60d4c04c0a5d5fb5e8e1ce12") {
          if (serial) {
            form.setFieldsValue({
              codigo_interno:
                form.getFieldValue("codigo_interno").substring(0, 7) +
                "-" +
                grupo.codigo +
                "-" +
                serial,
            });
          }
      }
      
    }
  }, [serial]);

  useEffect(() => {
    if (crud === null) {
      setCrud(operacion === "editar" || codigo === "nuevo" ? true : false);
    }

    async function fetch() {
      const grupoService = new GrupoService();
      const grupo = await grupoService.getOne(editProducto.fk_grupo_id);
      setSelectedGrupoName(grupo.nombre);
    }

    if (!stock && editProducto && !crud) {
      new ProductoService()
        .getStock(editProducto.codigo_temporal)
        .then((data) => setStock(data));
    }

    if (editProducto) {
      console.log("EDITPRODUCTO!", editProducto);
      if (!selectedMarcaId && !selectedLineaId && !selectedGrupoId) {
        setSelectedLineaId(editProducto.fk_linea_id);
        setSelectedMarcaId(editProducto.fk_marca_id);
        setSelectedGrupoId(editProducto.fk_grupo_id);
        setUnidadMedida(editProducto.fk_unidad_medida_id);
        setId(editProducto.id);
        if (crud) {
          fetch();
        }
      }

      if (!crud && editProducto.atributos_js) {
        if (editProducto.atributos_js.garantia_residencial === -1) {
          editProducto.atributos_js.garantia_residencial = "POR VIDA";
        } else if (editProducto.atributos_js.garantia_comercial === -1) {
          editProducto.atributos_js.garantia_comercial = "POR VIDA";
        } else if (editProducto.atributos_js.garantia_industrial === -1) {
          editProducto.atributos_js.garantia_industrial = "POR VIDA";
        }
      }
    } else {
      console.log("CODIGO: ", codigo);
      //findProducto(codigo);
      console.log("PRODUCTO", editProducto);
    }

    if (show === null) {
      window.scrollTo(0, 0);

      // if (crud) {
      setShow(crud);
      // } else {
      //   history.goBack();
      // }
    }

    if (!infoTecnicaLinea && editProducto) {
      setinfoTecnicaLinea(editProducto.fk_linea_id);
      setinfoTecnicaGrupo(editProducto.fk_grupo_id);
    }

    // return () => {
    //   setSelectedLineaId(undefined);
    //   setSelectedMarcaId(undefined);
    //   setId(null);
    //   setinfoTecnicaLinea(null);
    //   setShow(null)
    // };
  });

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  // if (crud) {
  //   console.log(crud)
  //   if (!codigo === "nuevo") {
  //     console.log("sate",crud);
  //     initialValues = crud;
  //     if (!selectedMarcaId && !selectedLineaId) {
  //       setSelectedMarcaId(crud.fk_marca_id);
  //       setSelectedLineaId(crud.fk_linea_id);
  //       setId(crud.id);
  //     }
  //   }

  // }
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const genExtra = () => (
    <PushpinFilled
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );

  const stockPorBodegas = async () => {
    let data = await new ProductoService().getStockBodegas(stock.id);
    let view = "";

    var list = data.map(function (d) {
      return (
        <div style={{ fontSize: 13 }} key={d.bodega_id}>
          {d.bodega_nombre + " : " + d.cantidad}
        </div>
      );
    });

    setstockBodegas(list);
  };
  // const randomNumber = (min, max) =>{
  //   return Math.floor(Math.random() * (max - min) + min);
  // }

  const onFinish = async (values) => {
    let data = null;

    delete values.permiso;
    // if (values["modelo"]){

    if (values.medidas) {
      values.nombre = values.nombre + " " + values.medidas;

      delete values.medidas;
    }
    //   values["modelo"] = JSON.parse(values["modelo"]).id;
    // }
    values["precio"] = parseFloat(values["precio"]).toFixed(2);
    values["costo"] = parseFloat(values["costo"]).toFixed(2);

    console.log("Success:", values);
    // values["atributos_js"] = final;
    if (id) {
      values["id"] = id;
      console.log("values", values);
      //data = await updateProducto(values);
      dispatch(_editProducto(values));
    } else {
      console.log("aqui!!!!");
      //data = await createProducto(values);
      dispatch(addProducto(values));

      console.log("zzzzz", data);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.warning("Error al guardar producto...");
  };
  //--------------------------------------------------------------------------------
  const handleFormValuesChange = async (changedValues) => {
    formHasChanges =
      operacion === "editar" || codigo === "nuevo" ? true : false;

    // const formFieldName = Object.keys(changedValues)[0];
    console.log("COLOR", form.getFieldsValue());

    console.log("FORMULARIO", form.getFieldsValue());
    // setSelectedMarcaId(form.getFieldValue("fk_marca_id"));

    // setFinal(form.getFieldsValue());
    // console.log("BF",form.getFieldValue("atributos_js"))
    // console.log("BF2",form.getFieldValue("atributos_js").general);

    if (form.getFieldValue("atributos_js") === undefined) {
      //form.setFieldsValue({ atributos_js: {} });
      // console.log("AF",form.getFieldValue("atributos_js"))
    }

    // form.setFieldsValue({'atributos_js.general.capa_desgaste' : "cambio"})

    const formFieldName = Object.keys(changedValues)[0];

    if (formFieldName === "fk_unidad_medida_id") {
      setUnidadMedida(changedValues[formFieldName]);
    }

    if (formFieldName === "fk_productotipo_id") {
      console.log("tipo!!!", form.getFieldValue("fk_productotipo_id").label);
      console.log("nombre!!!!", form.getFieldValue("nombre"));
      setNombre(
        form
          .getFieldValue("nombre")
          .substring(0, form.getFieldValue("nombre").lastIndexOf(" ")) +
          " " +
          form.getFieldValue("fk_productotipo_id").label
      );
      setNombreEdit(true);
    }

    if (formFieldName === "fk_marca_id") {
      setSelectedMarcaId(changedValues[formFieldName]);
      setSelectedGrupoId(null);
      // if (
      //   selectedLineaId === "60d4c04b894c18b5e810e025" ||
      //   selectedLineaId === "60faeee1a412169c92c778c2"
      // ) {
      form.setFieldsValue({ nombre: undefined });
      const marcaService = new MarcaService();
      const marca = await marcaService.getOne(changedValues[formFieldName]);
      form.setFieldsValue({
        codigo_interno:
          form.getFieldValue("codigo_interno").substring(0, 3) +
          "-" +
          marca.codigo,
      });
      // }

      form.setFieldsValue({ modelo: undefined });
      form.setFieldsValue({ fk_grupo_id: undefined });
      form.setFieldsValue({ fk_proveedor_id: undefined });
      // form.setFieldsValue({ atributos_js: {"general": atributosJs , "especifico": {}} });
      // console.log("TEST", form.getFieldValue("atributos_js").especifico)
      // setinfoTecnicaLinea(null);
      // form.setFieldsValue({ codigo_interno: ""})
      // form.setFieldsValue({ nombre: ""})
    } else {
    }

    // if (formFieldName === "precio") {
    //   setPrecio(changedValues[formFieldName]);

    // }

    if (formFieldName === "fk_linea_id") {
      setinfoTecnicaLinea(form.getFieldValue("fk_linea_id"));

      setinfoTecnicaGrupo(null);

      setSelectedLineaId(changedValues[formFieldName]);
      setSelectedMarcaId(null);
      setSelectedGrupoId(null);
      form.setFieldsValue({ modelo: undefined });
      form.setFieldsValue({ nombre: undefined });
      form.setFieldsValue({ fk_grupo_id: undefined });
      form.setFieldsValue({ fk_marca_id: undefined });
      form.setFieldsValue({ fk_proveedor_id: undefined });
      // form.setFieldsValue({ codigo_interno: "" });
      // form.setFieldsValue({ nombre: "" });

      const lineaService = new LineaService();
      const linea = await lineaService.getOne(changedValues[formFieldName]);
      // if(form.getFieldValue("fk_linea_id") === "60d4c046e600f1b5e85d075c" ){
      //   console.log("si entra!!!!!")
      form.setFieldsValue({ codigo_interno: linea.codigo });
      form.setFieldsValue({ nombre: undefined });

      // if (
      //   changedValues[formFieldName] === "60d4c04b894c18b5e810e025" ||
      //   changedValues[formFieldName] === "60faeee1a412169c92c778c2"
      // ) {
      // } else {
      //   form.setFieldsValue({ nombre: linea.codigo });
      // }

      if (changedValues[formFieldName] === "60d4c0476e8514b5e8c66fd5") {
        form.setFieldsValue({
          atributos_js: { capa_desgaste: "LACA ULTIMTEC" },
        });
      } else if (changedValues[formFieldName] === "60d4c04851cbd1b5e83632d3") {
        form.setFieldsValue({
          atributos_js: {
            capa_desgaste: "LACA UV DE ÓXIDO DE ALUMINIO",
          },
        });
      } else if (changedValues[formFieldName] === "60d4c0491b6606b5e836f80f") {
        form.setFieldsValue({
          atributos_js: { capa_desgaste: "PUR" },
        });
      }
    }

    // if (formFieldName === "color") {

    //   form.setFieldsValue({ codigo_interno: form.getFieldValue("codigo_interno").split("-")[0]+"-"+JSON.parse(form.getFieldValue("color").value).codigo})
    //   form.setFieldsValue({ nombre: form.getFieldValue("nombre").split(" ")[0]+ " "+form.getFieldValue("nombre").split(" ")[1]+ " "+ form.getFieldValue("color").label })

    // }

    // if (formFieldName === "modelo") {

    //   form.setFieldsValue({ codigo_interno: form.getFieldValue("codigo_interno").split("-")[0]+"-"+JSON.parse(form.getFieldValue("modelo").value).codigo})
    //   form.setFieldsValue({ nombre: form.getFieldValue("nombre").split(" ")[0]+ " "+form.getFieldValue("nombre").split(" ")[1]+ " "+ form.getFieldValue("modelo").label })

    // }

    // if (formFieldName === "color") {

    //   form.setFieldsValue({ codigo_interno: form.getFieldValue("codigo_interno").split("-")[0]+"-"+JSON.parse(form.getFieldValue("color").value).codigo})
    //   form.setFieldsValue({ nombre: form.getFieldValue("nombre").split(" ")[0]+ " "+form.getFieldValue("nombre").split(" ")[1]+ " "+ form.getFieldValue("color").label })

    // }

    if (formFieldName === "fk_productotipo_id") {
      const productoProductoTipoService = new ProductoProductoTipoService();
      const productoTipoService = new ProductoTipoService();
      const serial = await productoProductoTipoService.getSecuencia(
        form.getFieldValue("fk_productotipo_id")
      );

      const productoTipo = await productoTipoService.getOne(
        form.getFieldValue("fk_productotipo_id")
      );

      console.log("PRODUCTOTIPO", productoTipo);
      console.log("SERIAL", serial);
      const secuencial = parseInt(serial[0].n_tipo) + 1;
      let f_secuencial = secuencial;

      if (secuencial < 10) {
        f_secuencial = "0" + secuencial;
      }

      form.setFieldsValue({
        codigo_interno:
          form.getFieldValue("codigo_interno").substring(0, 6) +
          productoTipo.codigo +
          "-" +
          f_secuencial,
      });

      let index = form.getFieldValue("nombre").lastIndexOf(" ");

      if (form.getFieldValue("nombre").includes("DE ALMACENAMIENTO")) {
        index = form.getFieldValue("nombre").lastIndexOf(" DE");
      }

      if (
        formFieldName === "fk_productotipo_id" &&
        form.getFieldValue("fk_productotipo_id").label === "MADERA"
      ) {
        form.setFieldsValue({
          nombre: form.getFieldValue("nombre").substring(0, index) + " ",
        });
      } else if (formFieldName === "fk_productotipo_id") {
        form.setFieldsValue({
          nombre:
            form.getFieldValue("nombre").substring(0, index) +
            " " +
            form.getFieldValue("fk_productotipo_id").label,
        });
      }
    }

    if (formFieldName === "modelo") {
      // const colorService = new ColorService();
      // const color2 = await colorService.getOne(
      //   form.getFieldValue("modelo")
      // );

      // if (selectedLineaId !== "60d4c04b894c18b5e810e025") {
      //   if (selectedLineaId === "60faeee1a412169c92c778c2") {
      //     form.setFieldsValue({
      //       nombre:
      //         form.getFieldValue("nombre").split(" ")[0] +
      //         " " +
      //         color2.nombre +
      //         " ",
      //     });
      //   } else {
      //     form.setFieldsValue({
      //       codigo_interno:
      //         form.getFieldValue("codigo_interno").split("-")[0] +
      //         "-" +
      //         color2.codigo,
      //     });

      //     form.setFieldsValue({
      //       nombre:
      //         form.getFieldValue("nombre").split(" ")[0] +
      //         " " +
      //         form.getFieldValue("nombre").split(" ")[1] +
      //         " " +
      //         color2.nombre,
      //     });
      //   }
      // } else {
      // form.setFieldsValue({
      //   codigo_interno:
      //     form.getFieldValue("codigo_interno").substring(0, 11) +
      //     "-" +
      //     color2.codigo,
      // });
      console.log("MODELO!:", form.getFieldValue("modelo"));

      if (form.getFieldValue("modelo") === "") {
        form.setFieldsValue({ modelo: null });
      }

      form.setFieldsValue({
        nombre:
          selectedGrupoName +
          " " +
          (form.getFieldValue("modelo") === null
            ? ""
            : form.getFieldValue("modelo")),
      });

      //     form.setFieldsValue({
      //       nombre:
      //         form.getFieldValue("nombre").split(" ")[0] + " " + color2.nombre,
      //     });
      //   }
    }

    if (formFieldName === "fk_grupo_id") {
      if (form.getFieldValue("fk_grupo_id") === "60d617738d422eca134f6685") {
        form.setFieldsValue({
          atributos_js: { conexion: "WI-FI" },
        });
        form.setFieldsValue({
          atributos_js: { tipo_sensor: "NTC 10K" },
        });
      }

      setinfoTecnicaGrupo(form.getFieldValue("fk_grupo_id"));
      form.setFieldsValue({ modelo: undefined });

      console.log("grupo", changedValues[formFieldName]);
      setSelectedGrupoId(changedValues[formFieldName]);
      // form.setFieldsValue({ color: undefined });
      const grupoService = new GrupoService();
      const grupo = await grupoService.getOne(changedValues[formFieldName]);
      // if(form.getFieldValue("fk_grupo_id") === "60d617647b18b7ca135e1d53" ){
      //const serial = await getSerialModelo(changedValues[formFieldName]);
      dispatch(_getSerialModelo(changedValues[formFieldName]));
      // if (selectedLineaId === "60d4c04c0a5d5fb5e8e1ce12") {

      // } else if (
      //   selectedLineaId === "60d4c04b894c18b5e810e025" ||
      //   selectedLineaId === "60faeee1a412169c92c778c2"
      // ) {
      //   form.setFieldsValue({
      //     codigo_interno:
      //       form.getFieldValue("codigo_interno").substring(0, 4) + grupo.codigo,
      //   });
      // } else {
      //   form.setFieldsValue({
      //     codigo_interno:
      //       form.getFieldValue("codigo_interno").substring(0, 2) + grupo.codigo,
      //   });
      // }

      // if (
      //   selectedLineaId !== "60d4c04b894c18b5e810e025" &&
      //   selectedLineaId !== "60faeee1a412169c92c778c2"
      // ) {
      //   form.setFieldsValue({
      //     nombre:
      //       form.getFieldValue("nombre").split(" ")[0] + " " + grupo.codigo,
      //   });
      // } else {
      //   form.setFieldsValue({
      //     nombre: grupo.nombre + " ",
      //   });
      // }

      // }
      setSelectedGrupoName(grupo.nombre);
      form.setFieldsValue({ nombre: grupo.nombre });
    }

    // if (formFieldName === "fk_linea_id") {
    //   const lineaService = new LineaService();
    //   const linea = await lineaService.getOne(changedValues[formFieldName]);
    //   // if(form.getFieldValue("fk_linea_id") === "60d4c046e600f1b5e85d075c" ){
    //   //   console.log("si entra!!!!!")
    //   form.setFieldsValue({ codigo_interno: linea.codigo });
    //   form.setFieldsValue({ nombre: linea.codigo });

    //   // }else{
    //   //   form.setFieldsValue({ codigo_interno: ""})

    //   // }
    // }
  };
  //----------------------------------------------------------------------------------------------------
  const onChangeTipoInventario = (e) => {
    setTipoInventario(e.target.value);
  };

  const onChangeTipoProducto = (e) => {
    setTipoProducto(e.target.value);
  };

  const onChangeGeneracionClick = (e) => {
    setGeneracionClick(e.target.value);
  };

  const onChangeTieneSubcapaAdherida = (e) => {
    setTieneSubcapaAdherida(e.target.value);
  };

  const onChangeUsoCesped = (e) => {
    setUsoCesped(e.target.value);
  };

  const onChangeRangoAlturaHebra = (e) => {
    setRangoAlturaHebra(e.target.value);
  };

  const onChangeMetodoABC = (e) => {
    setMetodoABC(e.target.value);
  };

  const plainOptions = ["INTERIOR", "EXTERIOR"];
  //-----------------------------------------------------------

  function cancelConfirm() {
    //dispatch(_getSerialModelo('60d617628b7d31ca139fb948'))

    if (formHasChanges !== null) {
      if (formHasChanges === true) {
        if (
          window.confirm(
            "¿ ESTÁ SEGURO QUE DESEA SALIR ?, LOS CAMBIOS NO SE GUARDARÁN."
          )
        ) {
          history.push("/home/productos");
          window.scroll(0, 0);
        }
      } else {
        history.push("/home/productos/");
        window.scroll(0, 0);
      }
    } else {
      if (
        window.confirm(
          "¿ ESTÁ SEGURO QUE DESEA SALIR ?, LOS CAMBIOS NO SE GUARDARÁN."
        )
      ) {
        history.push("/home/productos/");
        window.scroll(0, 0);
      }
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDownload = async () => {
    if (editProducto.url_pagina_web) {
      const data = await new ProductoService().generateQRPdf(editProducto);
      const blob = new Blob([data], { type: "application/pdf" });
      saveAs(blob, "QR-" + editProducto.nombre + ".pdf");
    }
  };

  const generarQR = async () => {
    if (editProducto.url_pagina_web) {
      await new ProductoService()
        .getQR(editProducto.url_pagina_web)
        .then((data) => setQR(data));
    }

    setIsModalVisible(true);
  };

  function goBackHistory() {
    history.push("/home/productos", { linea: editProducto.fk_linea_id });
    window.scroll(0, 0);
  }
  // const handleFormValuesChange = async (changedValues) => {
  //   // console.log("ONCHANGE", form.getFieldsValue());

  //   formHasChanges = operacion === "editar" || codigo === "nuevo" ? true : false;

  //   const formFieldName = Object.keys(changedValues)[0];
  // };

  function goBackHistory() {
    history.push("/home/productos");
  }
  // const handleFormValuesChange = async (changedValues) => {
  //   // console.log("ONCHANGE", form.getFieldsValue());

  //   formHasChanges = operacion === "editar" || codigo === "nuevo" ? true : false;

  //   const formFieldName = Object.keys(changedValues)[0];
  // };

  //---------------------------------------------
  if (sesions) {
    if (sesions._usuario[0].rol === 2 || operacion === "ver") {
      return (editProducto && editProducto !==undefined )|| codigo === "nuevo" ? (
        <>
          {codigo !== "nuevo" && (
            <Modal
              title={<b>CÓDIGO QR: {editProducto.nombre}</b>}
              okType="primary"
              okText="Descargar"
              cancelText="Regresar"
              visible={isModalVisible ? true : false}
              onCancel={handleCancel}
              onOk={handleDownload}
            >
              <Row>
                <Col span={12} offset={6}>
                  <Image width={200} src={QR} />
                </Col>
              </Row>
              <Button
                type="link"
                href={editProducto.url_pagina_web}
                target="_blank"
              >
                {editProducto.url_pagina_web}
              </Button>
            </Modal>
          )}
          <Form
            {...layout}
            form={form}
            name="customized_form_controls"
            initialValues={editProducto ? editProducto : initialValues}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={handleFormValuesChange}
            hidden={codigo !== "nuevo" ? show : false}
          >
            <Divider>
              PRODUCTO{" "}
              {codigo !== "nuevo" && editProducto.url_pagina_web ? (
                <QrcodeOutlined
                  style={{ fontSize: "25px" }}
                  onClick={() => generarQR()}
                />
              ) : null}
            </Divider>
            <br />

            <Collapse defaultActiveKey={["1", "2", "3", "4"]}>
              <Panel header="INFORMACIÓN GENERAL" key="1" extra={genExtra()}>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Línea"
                      name={crud ? "fk_linea_id" : "linea"}
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, seleccione una linea!",
                              },
                            ]
                          : []
                      }
                    >
                      {crud ? (
                        <SelectOpciones
                          tipo="línea"
                          readOnly={!crud}
                          setShow={setShow}
                        />
                      ) : (
                        <Input className="input-type" readOnly={!crud} />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="Marca"
                      name={crud ? "fk_marca_id" : "marca"}
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, seleccione una marca!",
                              },
                            ]
                          : []
                      }
                    >
                      {crud ? (
                        <SelectOpciones
                          tipo="marca"
                          readOnly={!crud}
                          filter={selectedLineaId}
                          setShow={setShow}
                        />
                      ) : (
                        <Input className="input-type" readOnly={!crud} />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="Grupo"
                      name={crud ? "fk_grupo_id" : "grupo"}
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, seleccione un grupo!",
                              },
                            ]
                          : []
                      }
                    >
                      {crud ? (
                        <SelectOpciones
                          tipo="grupo"
                          filter={selectedMarcaId}
                          filter2={selectedLineaId}
                          readOnly={!crud}
                          setShow={setShow}
                        />
                      ) : (
                        <Input className="input-type" readOnly={!crud} />
                      )}
                    </Form.Item>

                    <Form.Item
                      label="Modelo"
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, seleccione un color!",
                              },
                            ]
                          : []
                      }
                    >
                      {crud ? (
                        !newModelo ? (
                          <Space>
                            <Form.Item
                              name={crud ? "modelo" : "modelo"}
                              rules={
                                crud
                                  ? [
                                      {
                                        required: true,
                                        message:
                                          "Por favor, seleccione un modelo!",
                                      },
                                    ]
                                  : []
                              }
                            >
                              <SelectOpciones
                                tipo="modelo"
                                filter={selectedGrupoId}
                                filter2={selectedMarcaId}
                                filter3={selectedLineaId}
                                readOnly={!crud}
                                setShow={setShow}
                              />
                            </Form.Item>
                            <Form.Item>
                              <Button
                                type="dashed"
                                icon={
                                  !newModelo ? (
                                    <EditOutlined />
                                  ) : (
                                    <SearchOutlined />
                                  )
                                }
                                onClick={() => setNewModelo(!newModelo)}
                              />
                            </Form.Item>
                          </Space>
                        ) : (
                          <Space>
                            <Form.Item
                              name={crud ? "modelo" : "modelo"}
                              rules={
                                crud
                                  ? [
                                      {
                                        required: true,
                                        message:
                                          "Por favor, ingrese un modelo!",
                                      },
                                    ]
                                  : []
                              }
                            >
                              <Input
                                disabled={!selectedGrupoId ? true : false}
                                placeholder="Ingrese el modelo"
                              />
                            </Form.Item>
                            <Form.Item>
                              <Button
                                type="primary"
                                icon={
                                  !newModelo ? (
                                    <PlusOutlined />
                                  ) : (
                                    <SearchOutlined />
                                  )
                                }
                                onClick={() => setNewModelo(!newModelo)}
                              />
                            </Form.Item>
                          </Space>
                        )
                      ) : (
                        <Form.Item name={crud ? "modelo" : "modelo"}>
                          <Input className="input-type" readOnly={!crud} />
                        </Form.Item>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Procedencia"
                      name="procedencia"
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, ingrese la procedencia!",
                              },
                            ]
                          : []
                      }
                    >
                      {crud ? (
                        <SelectOpciones
                          tipo="procedencia"
                          readOnly={!crud}
                          setShow={setShow}
                        />
                      ) : (
                        <Input className="input-type" readOnly={!crud} />
                      )}
                    </Form.Item>

                    <Form.Item
                      label="Proveedor"
                      name={crud ? "fk_proveedor_id" : "proveedor"}
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, seleccione un proveedor!",
                              },
                            ]
                          : []
                      }
                    >
                      {crud ? (
                        <SelectOpciones
                          tipo="proveedor"
                          filter={selectedMarcaId}
                          readOnly={!crud}
                          setShow={setShow}
                        />
                      ) : (
                        <Input className="input-type" readOnly={!crud} />
                      )}
                    </Form.Item>

                    {/* {selectedLineaId === "60faeee1a412169c92c778c2" ? (
                    <Form.Item
                      label="Tipo"
                      name={"fk_productotipo_id"}
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, seleccione un proveedor!",
                              },
                            ]
                          : []
                      }
                    >
                      {crud ? (
                        <SelectOpciones
                          tipo="tipo"
                          readOnly={!crud}
                          setShow={setShow}
                        />
                      ) : (
                        <Input className="input-type" readOnly={!crud} />
                      )}
                    </Form.Item>
                  ) : null} */}

                    <Form.Item
                      label="Código Interno"
                      name="codigo_interno"
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message:
                                  "Por favor, ingrese el código interno!",
                                len: 15
                              },
                            ]
                          : []
                      }
                    >
                      <Input className="input-type" readOnly={true} />
                    </Form.Item>
                    <Form.Item
                      label="Nombre"
                      name="nombre"
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, ingrese el nombre!",
                              },
                            ]
                          : []
                      }
                    >
                      <Input
                        name="nombre"
                        className="input-type"
                        readOnly={true}
                      />
                    </Form.Item>

                    {/* <Form.Item
                    label="Descripción"
                    name="descripcion"
                    rules={
                      crud
                        ? [
                            {
                              required: true,
                              message: "Por favor, ingrese la descripción!",
                            },
                          ]
                        : []
                    }
                  >
                    <TextArea
                      maxLength={280}
                      className="input-type"
                      readOnly={!crud}
                    />
                  </Form.Item> */}
                  </Col>
                </Row>
              </Panel>
              {selectedLineaId === "60d4c0476e8514b5e8c66fd5" ||
              selectedLineaId === "60d4c0477f7255b5e8cca2b7" ||
              selectedLineaId === "60d4c04851cbd1b5e83632d3" ||
              selectedLineaId === "60d4c04880c445b5e8b87047" ||
              selectedLineaId === "60d4c0491b6606b5e836f80f" ||
              selectedLineaId === "60d4c04ba23e72b5e8f93e11" ||
              selectedLineaId === "60d4c04bc02e32b5e8ac7b68" ||
              selectedLineaId === "60d4c04c0a5d5fb5e8e1ce12" ||
              selectedLineaId === "60d4c046e600f1b5e85d075c" ||
              selectedLineaId === "60d4c04663852fb5e8ad40d7" ||
              selectedLineaId === "60db4816d2a990117e29ad6b" ||
              selectedLineaId === "60d4c04a145bfab5e81b4626" ? (
                <Panel
                  className="tecnica"
                  header="INFORMACIÓN TÉCNICA"
                  key="4"
                  extra={genExtra()}
                >
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label="Formato"
                        name={["atributos_js", "formato"]}
                        rules={
                          crud
                            ? [
                                {
                                  required: true,
                                  message: "Por favor, seleccione el formato!",
                                },
                              ]
                            : []
                        }
                      >
                        {crud ? (
                          <SelectOpciones tipo="formato" readOnly={!crud} />
                        ) : (
                          <Input className="input-type" readOnly={!crud} />
                        )}
                      </Form.Item>
                      {infoTecnicaLinea === "60d4c0476e8514b5e8c66fd5" ||
                      infoTecnicaLinea === "60d4c04851cbd1b5e83632d3" ||
                      infoTecnicaLinea === "60d4c0491b6606b5e836f80f" ? (
                        <Form.Item
                          label="Capa de Desgaste"
                          name={["atributos_js", "capa_desgaste"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, ingrese la capa de desgaste!",
                                  },
                                ]
                              : []
                          }
                        >
                          <Input
                            // defaultValue={capaDesgaste}
                            className="input-type"
                            readOnly={true}
                          />
                        </Form.Item>
                      ) : null}
                      {infoTecnicaLinea !== "60d4c0477f7255b5e8cca2b7" &&
                      infoTecnicaLinea !== "60d4c04ba23e72b5e8f93e11" &&
                      infoTecnicaLinea !== "60db4816d2a990117e29ad6b" &&
                      infoTecnicaLinea !== "60d4c04bc02e32b5e8ac7b68" ? (
                        <Form.Item
                          label="Composición"
                          name={["atributos_js", "composicion"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, seleccione la composicion!",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <Radio.Group disabled={!crud}>
                              <Radio value={"HOMOGÉNEO"}>HOMOGÉNEO</Radio>
                              <Radio value={"HETEROGÉNEO"}>HETEROGÉNEO</Radio>
                            </Radio.Group>
                          ) : (
                            <Input className="input-type" readOnly={!crud} />
                          )}
                        </Form.Item>
                      ) : null}
                      {infoTecnicaLinea !== "60d4c04ba23e72b5e8f93e11" &&
                      infoTecnicaLinea !== "60d4c04a145bfab5e81b4626" &&
                      infoTecnicaLinea !== "60db4816d2a990117e29ad6b" &&
                      infoTecnicaLinea !== "60d4c04bc02e32b5e8ac7b68" ? (
                        <div>
                          <Form.Item
                            label="Resistencia al Agua"
                            name={["atributos_js", "resistencia_agua"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, si es resistente al agua o no!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <Radio.Group disabled={!crud}>
                                <Radio value={"SI"}>SI</Radio>
                                <Radio value={"NO"}>NO</Radio>
                              </Radio.Group>
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Tono"
                            name={["atributos_js", "tono"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message: "Por favor, seleccione el tono!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <SelectOpciones tipo="tono" readOnly={!crud} />
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Textura"
                            name={["atributos_js", "textura"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, seleccione la textura!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <Radio.Group disabled={!crud}>
                                <Radio value={"MADERADO"}>MADERADO</Radio>
                                <Radio value={"NO MADERADO"}>NO MADERADO</Radio>
                              </Radio.Group>
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                        </div>
                      ) : null}

                      {infoTecnicaLinea !== "60d4c04bc02e32b5e8ac7b68" ? (
                        <div>
                          <Form.Item
                            label="Largo"
                            name={["atributos_js", "largo"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese la medida de largo!",
                                    },
                                  ]
                                : []
                            }
                          >
                            <InputNumber
                              min={0}
                              precision={0}
                              readOnly={!crud}
                              formatter={(value) => `${value} mm`}
                              parser={(value) => value.replace(" mm", "")}
                            />
                          </Form.Item>
                          <Form.Item
                            label="Ancho"
                            name={["atributos_js", "ancho"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese la medida de ancho!",
                                    },
                                  ]
                                : []
                            }
                          >
                            <InputNumber
                              min={0}
                              precision={0}
                              readOnly={!crud}
                              formatter={(value) => `${value} mm`}
                              parser={(value) => value.replace(" mm", "")}
                            />
                          </Form.Item>
                        </div>
                      ) : null}

                      {infoTecnicaLinea === "60d4c04ba23e72b5e8f93e11" ? (
                        <div>
                          <Form.Item
                            label="Potencia"
                            name={["atributos_js", "potencia"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese la potencia!",
                                    },
                                  ]
                                : []
                            }
                          >
                            <InputNumber
                              min={0}
                              precision={2}
                              readOnly={!crud}
                              formatter={(value) => `${value} W/m2`}
                              parser={(value) => value.replace(" W/m2", "")}
                            />
                          </Form.Item>
                          <Form.Item
                            label="Presentación"
                            name={["atributos_js", "presentacion"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese la presentación!",
                                    },
                                  ]
                                : []
                            }
                          >
                            <InputNumber
                              min={0}
                              precision={0}
                              readOnly={!crud}
                              formatter={(value) => `${value} m2`}
                              parser={(value) => value.replace(" m2", "")}
                            />
                          </Form.Item>
                          <Form.Item
                            label="Corriente"
                            name={["atributos_js", "corriente"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese la corriente!",
                                    },
                                  ]
                                : []
                            }
                          >
                            <InputNumber
                              min={0}
                              precision={2}
                              readOnly={!crud}
                              formatter={(value) => `${value} A`}
                              parser={(value) => value.replace(" A", "")}
                            />
                          </Form.Item>
                        </div>
                      ) : null}
                      {infoTecnicaLinea === "60db4816d2a990117e29ad6b" ? (
                        <div>
                          <Form.Item
                            label="Proceso de Fabricación"
                            name={["atributos_js", "proceso_fabricacion"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese el proceso de fabricación!",
                                    },
                                  ]
                                : []
                            }
                          >
                            <Input readOnly={true} defaultValue="MONOCOCCIÓN" />
                          </Form.Item>
                          <Form.Item
                            label="Rectificado"
                            name={["atributos_js", "rectificado"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, seleccione rectificado o no!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <Radio.Group disabled={!crud}>
                                <Radio value={"SI"}>SI</Radio>
                                <Radio value={"NO"}>NO</Radio>
                              </Radio.Group>
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Absorción de Agua"
                            name={["atributos_js", "absorcion_agua"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese el valor de absorción de agua!",
                                    },
                                  ]
                                : []
                            }
                          >
                            <Input readOnly={true} defaultValue="<0.5%" />
                          </Form.Item>
                        </div>
                      ) : null}

                      {infoTecnicaLinea === "60d4c046e600f1b5e85d075c" ||
                      infoTecnicaLinea === "60d4c04851cbd1b5e83632d3" ||
                      infoTecnicaLinea === "60d4c04c0a5d5fb5e8e1ce12" ||
                      infoTecnicaLinea === "60d4c0491b6606b5e836f80f" ||
                      infoTecnicaLinea === "60d4c0476e8514b5e8c66fd5" ||
                      infoTecnicaLinea === "60d4c04880c445b5e8b87047" ? (
                        <div>
                          <Form.Item
                            label="Core"
                            name={["atributos_js", "core"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message: "Por favor, seleccione el core!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <SelectOpciones tipo="core" readOnly={!crud} />
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>

                          <Form.Item
                            label="Terminado"
                            name={["atributos_js", "terminado"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, seleccione el terminado!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <SelectOpciones
                                tipo="terminado"
                                readOnly={!crud}
                              />
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                        </div>
                      ) : null}
                    </Col>
                    <Col span={12}>
                      {infoTecnicaLinea === "60d4c04ba23e72b5e8f93e11" ? (
                        <div>
                          <Form.Item
                            label="Alimentación"
                            name={["atributos_js", "alimentacion"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese el valor de la alimentación!",
                                    },
                                  ]
                                : []
                            }
                          >
                            <InputNumber
                              min={0}
                              precision={0}
                              readOnly={!crud}
                              formatter={(value) => `${value} V`}
                              parser={(value) => value.replace(" V", "")}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Longitud del Cable"
                            name={[
                              "atributos_js",
                              "longitud_cable_alimentacion",
                            ]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese la longitud del cable de alimentación!",
                                    },
                                  ]
                                : []
                            }
                          >
                            <InputNumber
                              min={0}
                              precision={0}
                              readOnly={!crud}
                              formatter={(value) => `${value} m`}
                              parser={(value) => value.replace(" m", "")}
                            />
                          </Form.Item>
                        </div>
                      ) : null}
                      {(infoTecnicaLinea !== "60d4c04ba23e72b5e8f93e11" &&
                        infoTecnicaLinea !== "60d4c04bc02e32b5e8ac7b68") ||
                      infoTecnicaGrupo === "60d617738d422eca134f6685" ? (
                        <Form.Item
                          label="Espesor"
                          name={["atributos_js", "espesor"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, ingrese la medida de espesor!",
                                  },
                                ]
                              : []
                          }
                        >
                          <InputNumber
                            min={0}
                            precision={0}
                            readOnly={!crud}
                            formatter={(value) => `${value} mm`}
                            parser={(value) => value.replace(" mm", "")}
                          />
                        </Form.Item>
                      ) : null}
                      {infoTecnicaLinea !== "60d4c04663852fb5e8ad40d7" &&
                      infoTecnicaLinea !== "60d4c0477f7255b5e8cca2b7" &&
                      infoTecnicaLinea !== "60d4c04ba23e72b5e8f93e11" ? (
                        <Form.Item
                          label="Densidad"
                          name={["atributos_js", "densidad"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message: "Por favor, ingrese la densidad!",
                                  },
                                ]
                              : []
                          }
                        >
                          <InputNumber
                            min={0}
                            precision={2}
                            readOnly={!crud}
                            formatter={(value) => `${value} kg/m3`}
                            parser={(value) => value.replace(" kg/m3", "")}
                          />
                        </Form.Item>
                      ) : null}

                      {infoTecnicaLinea !== "60d4c0477f7255b5e8cca2b7" &&
                      infoTecnicaLinea !== "60d4c04a8e4f5ab5e8b93218" &&
                      infoTecnicaLinea !== "60d4c04a145bfab5e81b4626" &&
                      infoTecnicaLinea !== "60d4c04ba23e72b5e8f93e11" &&
                      infoTecnicaLinea !== "60d4c04bc02e32b5e8ac7b68" &&
                      infoTecnicaLinea !== "60db4816d2a990117e29ad6b" &&
                      infoTecnicaLinea !== "60d4c04880c445b5e8b87047" &&
                      infoTecnicaLinea !== "60d4c04b894c18b5e810e025" ? (
                        <Form.Item
                          label="Clase Residencial"
                          name={["atributos_js", "clase_residencial"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, seleccione la clase residencial!",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <SelectOpciones
                              tipo="clase residencial"
                              readOnly={!crud}
                            />
                          ) : (
                            <Input className="input-type" readOnly={!crud} />
                          )}
                        </Form.Item>
                      ) : null}

                      <Form.Item
                        label={
                          infoTecnicaLinea !== "60d4c0477f7255b5e8cca2b7" &&
                          infoTecnicaLinea !== "60d4c04a8e4f5ab5e8b93218" &&
                          infoTecnicaLinea !== "60d4c04a145bfab5e81b4626" &&
                          infoTecnicaLinea !== "60d4c04ba23e72b5e8f93e11" &&
                          infoTecnicaLinea !== "60d4c04bc02e32b5e8ac7b68" &&
                          infoTecnicaLinea !== "60d4c04b894c18b5e810e025"
                            ? "Garantía Residencial (años)"
                            : "Garantía (años)"
                        }
                        name={["atributos_js", "garantia_residencial"]}
                        rules={
                          crud
                            ? [
                                {
                                  required: true,
                                  message: "Por favor, ingrese la garantía!",
                                },
                              ]
                            : []
                        }
                      >
                        {crud ? (
                          <SelectOpciones
                            tipo="garantía"
                            readOnly={!crud}
                            setShow={setShow}
                          />
                        ) : (
                          <Input className="input-type" readOnly={!crud} />
                        )}
                      </Form.Item>

                      {infoTecnicaGrupo === "60d617738d422eca134f6685" ? (
                        <div>
                          <Form.Item
                            label="Dimensión de la pantalla"
                            name={["atributos_js", "dimension_pantalla"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, seleccione el tipo de hebra!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <Radio.Group disabled={!crud}>
                                <Radio value={"72 X 54 MM"}>72 X 54 MM</Radio>
                                <Radio value={"35 X 50 MM"}>35 X 50 MM</Radio>
                              </Radio.Group>
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Conexión"
                            name={["atributos_js", "conexion"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese el tipo de conexión!",
                                    },
                                  ]
                                : []
                            }
                          >
                            <Input
                              // defaultValue="WI-FI"
                              className="input-type"
                              readOnly={true}
                            />
                          </Form.Item>
                          <Form.Item
                            label="Tipo de Sensor"
                            name={["atributos_js", "tipo_sensor"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese el tipo de sensor!",
                                    },
                                  ]
                                : []
                            }
                          >
                            <Input
                              // defaultValue="NTC 10K"
                              className="input-type"
                              readOnly={true}
                            />
                          </Form.Item>
                          <Form.Item
                            label="Color del Calefactor"
                            name={["atributos_js", "color_calefactor"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, seleccione el color del calefactor!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <Radio.Group disabled={!crud}>
                                <Radio value={"BLANCO"}>BLANCO</Radio>
                                <Radio value={"NEGRO"}>NEGRO</Radio>
                              </Radio.Group>
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                        </div>
                      ) : null}

                      {infoTecnicaLinea === "60d4c0477f7255b5e8cca2b7" ? (
                        <div>
                          <Form.Item
                            label="Uso"
                            name={["atributos_js", "uso"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese el/los uso(s)!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <Radio.Group
                                onChange={onChangeUsoCesped}
                                value={usoCesped}
                                disabled={!crud}
                              >
                                <Radio value={"DECORATIVO"}>DECORATIVO</Radio>
                                <Radio value={"DEPORTIVO"}>DEPORTIVO</Radio>
                              </Radio.Group>
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Aplicación"
                            name={["atributos_js", "aplicacion"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese la aplicación!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <Checkbox.Group options={plainOptions} />
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Rango de Altura de Hebra"
                            name={["atributos_js", "rango_altura_hebra"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, seleccione el rango de altura de la hebra!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <Radio.Group
                                onChange={onChangeRangoAlturaHebra}
                                value={rangoAlturaHebra}
                                disabled={!crud}
                                de
                              >
                                <Radio value={"5 mm - 11 mm"}>
                                  5 mm - 11 mm
                                </Radio>
                                <Radio value={"18 mm - 45 mm"}>
                                  18 mm - 45 mm
                                </Radio>
                              </Radio.Group>
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Altura de Hebra"
                            name={["atributos_js", "altura_hebra"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese la altura de la hebra!",
                                    },
                                  ]
                                : []
                            }
                          >
                            <InputNumber
                              min={0}
                              precision={0}
                              readOnly={!crud}
                              formatter={(value) => `${value} mm`}
                              parser={(value) => value.replace(" mm", "")}
                            />
                          </Form.Item>{" "}
                        </div>
                      ) : null}

                      {infoTecnicaLinea === "60d4c046e600f1b5e85d075c" ||
                      infoTecnicaGrupo === "60d6176a3e1331ca13a5f649" ||
                      infoTecnicaGrupo === "60d4c04c0a5d5fb5e8e1ce12" ||
                      infoTecnicaGrupo === "60d61769637c1aca1384fe74" ||
                      infoTecnicaLinea === "60d4c04851cbd1b5e83632d3" ||
                      infoTecnicaLinea === "60d4c0491b6606b5e836f80f" ||
                      infoTecnicaLinea === "60d4c04c0a5d5fb5e8e1ce12" ? (
                        <Form.Item
                          label="Clase Comercial"
                          name={["atributos_js", "clase_comercial"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, seleccione la clase comercial!",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <SelectOpciones
                              tipo="clase comercial"
                              readOnly={!crud}
                            />
                          ) : (
                            <Input className="input-type" readOnly={!crud} />
                          )}
                        </Form.Item>
                      ) : null}

                      {infoTecnicaLinea === "60d4c046e600f1b5e85d075c" ||
                      infoTecnicaGrupo === "60d6176a3e1331ca13a5f649" ||
                      infoTecnicaGrupo === "60d4c04c0a5d5fb5e8e1ce12" ||
                      infoTecnicaGrupo === "60d61769637c1aca1384fe74" ||
                      infoTecnicaLinea === "60d4c04851cbd1b5e83632d3" ||
                      infoTecnicaLinea === "60d4c0491b6606b5e836f80f" ||
                      infoTecnicaLinea === "60d4c04c0a5d5fb5e8e1ce12" ||
                      infoTecnicaLinea === "60d4c04880c445b5e8b87047" ||
                      infoTecnicaLinea === "60db4816d2a990117e29ad6b" ? (
                        <Form.Item
                          label="Garantía Comercial (años)"
                          name={["atributos_js", "garantia_comercial"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, ingrese el tiempo de garantía!",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <SelectOpciones
                              tipo="garantía"
                              readOnly={!crud}
                              setShow={setShow}
                            />
                          ) : (
                            <Input className="input-type" readOnly={!crud} />
                          )}
                        </Form.Item>
                      ) : null}

                      {infoTecnicaLinea === "60db4816d2a990117e29ad6b" ? (
                        <div>
                          <Form.Item
                            label="Absorción de Agua"
                            name={["atributos_js", "absorcion_agua"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese el valor de absorción de agua!",
                                    },
                                  ]
                                : []
                            }
                          >
                            <Input readOnly={true} defaultValue="<0.5%" />
                          </Form.Item>

                          <Form.Item
                            label="Resistencia al Deslizamiento"
                            name={["atributos_js", "resistencia_deslizamiento"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, seleccione la resistencia al deslizamiento!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <SelectOpciones
                                tipo="resistencia al deslizamiento"
                                readOnly={!crud}
                                setShow={setShow}
                              />
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Resistencia a la Abrasión"
                            name={["atributos_js", "resistencia_abrasion"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, seleccione la resistencia a la abrasión!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <SelectOpciones
                                tipo="resistencia a la abrasión"
                                readOnly={!crud}
                                setShow={setShow}
                              />
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                        </div>
                      ) : null}

                      {infoTecnicaGrupo === "60d61769637c1aca1384fe74" ? (
                        <Form.Item
                          label="Clase Industrial"
                          name={["atributos_js", "clase_industrial"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, seleccione la clase industrial!",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <SelectOpciones
                              tipo="clase industrial"
                              readOnly={!crud}
                            />
                          ) : (
                            <Input className="input-type" readOnly={!crud} />
                          )}
                        </Form.Item>
                      ) : null}

                      {infoTecnicaGrupo === "60d61769637c1aca1384fe74" ? (
                        <Form.Item
                          label="Garantía Industrial (años)"
                          name={["atributos_js", "garantia3"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, ingrese el tiempo de garantía!",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <SelectOpciones
                              tipo="garantía"
                              readOnly={!crud}
                              setShow={setShow}
                            />
                          ) : (
                            <Input className="input-type" readOnly={!crud} />
                          )}
                        </Form.Item>
                      ) : null}

                      {infoTecnicaLinea === "60d4c04851cbd1b5e83632d3" ? (
                        <Form.Item
                          label="Tipo de Hebra"
                          name={["atributos_js", "tipo_hebra"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, seleccione el tipo de hebra!",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <Radio.Group disabled={!crud}>
                              <Radio value={"TEJIDA"}>TEJIDA</Radio>
                              <Radio value={"HORIZONTAL"}>HORIZONTAL</Radio>
                            </Radio.Group>
                          ) : (
                            <Input className="input-type" readOnly={!crud} />
                          )}
                        </Form.Item>
                      ) : null}
                      {infoTecnicaLinea === "60d4c046e600f1b5e85d075c" ||
                      infoTecnicaLinea === "60d4c0476e8514b5e8c66fd5" ||
                      infoTecnicaLinea === "60d4c04c0a5d5fb5e8e1ce12" ||
                      infoTecnicaLinea === "60d4c0491b6606b5e836f80f" ? (
                        <div>
                          <Form.Item
                            label="Biseles"
                            name={["atributos_js", "biseles"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, ingrese el número de biseles!",
                                    },
                                  ]
                                : []
                            }
                          >
                            <InputNumber
                              min={0}
                              precision={0}
                              readOnly={!crud}
                              // formatter={(value) => `${value} mm`}
                              // parser={(value) => value.replace(" mm", "")}
                            />
                          </Form.Item>
                          <Form.Item
                            label="Resistencia a la Abrasión"
                            name={["atributos_js", "resistencia_abrasion"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, seleccione la resistencia a la abrasión!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <SelectOpciones
                                tipo="resistencia a la abrasion"
                                readOnly={!crud}
                              />
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Sistema de Click"
                            name={["atributos_js", "sistema_click"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, seleccione el sistema de click!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <SelectOpciones
                                tipo="sistema de click"
                                readOnly={!crud}
                              />
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Generación de Click "
                            name={["atributos_js", "generacion_click"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, seleccione si la generación de click!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <Radio.Group
                                onChange={onChangeGeneracionClick}
                                value={generacionClick}
                                disabled={!crud}
                              >
                                <Radio value={"3G"}>3G</Radio>
                                <Radio value={"5G"}>5G</Radio>
                              </Radio.Group>
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Subcapa Adherida"
                            name={["atributos_js", "subcapa_adherida"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, seleccione si tiene subcapa adherida!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <Radio.Group
                                onChange={onChangeTieneSubcapaAdherida}
                                value={tieneSubcapaAdherida}
                                disabled={!crud}
                              >
                                <Radio value={"SI"}>SI</Radio>
                                <Radio value={"NO"}>NO</Radio>
                              </Radio.Group>
                            ) : (
                              <Input className="input-type" readOnly={!crud} />
                            )}
                          </Form.Item>
                        </div>
                      ) : null}
                    </Col>
                  </Row>
                  {/* <Divider /> */}

                  {infoTecnicaLinea === "60d4c046e600f1b5e85d075c" ||
                  infoTecnicaLinea === "60d4c0476e8514b5e8c66fd5" ||
                  infoTecnicaLinea === "60d4c04c0a5d5fb5e8e1ce12" ||
                  infoTecnicaLinea === "60d4c0491b6606b5e836f80f" ? (
                    <Row>
                      <Col span={12}></Col>
                      <Col span={12}></Col>
                    </Row>
                  ) : infoTecnicaLinea === "60d4c0477f7255b5e8cca2b7" ? (
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          label="Puntadas cada 10 cm"
                          name={["atributos_js", "puntadas_10cm"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, ingrese el número de puntadas cada 10cm!",
                                  },
                                ]
                              : []
                          }
                        >
                          <InputNumber min={0} precision={0} readOnly={!crud} />
                        </Form.Item>
                        <Form.Item
                          label="Puntadas por m2"
                          name={["atributos_js", "puntadas_m2"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, ingrese el número de puntadas por m2!",
                                  },
                                ]
                              : []
                          }
                        >
                          <InputNumber min={0} precision={0} readOnly={!crud} />
                        </Form.Item>
                        <Form.Item
                          label="Filamentos por Puntada"
                          name={["atributos_js", "filamentos_puntada"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, ingrese el número de filamentos por puntada!",
                                  },
                                ]
                              : []
                          }
                        >
                          <InputNumber min={0} precision={0} readOnly={!crud} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Filamentos por m2"
                          name={["atributos_js", "filamentos_m2"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, ingrese el número de filamentos por m2!",
                                  },
                                ]
                              : []
                          }
                        >
                          <InputNumber min={0} precision={0} readOnly={!crud} />
                        </Form.Item>
                        <Form.Item
                          label="Galga"
                          name={["atributos_js", "galga"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, ingrese la medida de galga!",
                                  },
                                ]
                              : []
                          }
                        >
                          <Input
                            suffix="''"
                            className="input-type"
                            readOnly={!crud}
                          />
                        </Form.Item>

                        <Form.Item
                          label="Tipo(s) de Filamento"
                          name={["atributos_js", "tipo_filamento"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, seleccione el tipo(s) de filamento!",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <Select
                              mode="multiple"
                              allowClear
                              placeholder="Seleccione tipo de filamento"
                              readOnly={!crud}
                            >
                              {tiposFilamentoList}
                            </Select>
                          ) : (
                            <TextArea readOnly={!crud} />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : infoTecnicaLinea === "60d4c04a145bfab5e81b4626" ? (
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          label="Material:"
                          name={["atributos_js", "material"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, seleccione el material!",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <SelectOpciones tipo="material" readOnly={!crud} />
                          ) : (
                            <Input className="input-type" readOnly={!crud} />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Color:"
                          name={["atributos_js", "color"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, seleccione el color de la subcapa",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <SelectOpciones
                              tipo="color de subcapa"
                              readOnly={!crud}
                              setShow={setShow}
                            />
                          ) : (
                            <Input className="input-type" readOnly={!crud} />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Tipo de Esponja"
                          name={["atributos_js", "tipo_esponja"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, seleccione el tipo de esponja!",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <Radio.Group disabled={!crud}>
                              <Radio value={"EVA"}>EVA</Radio>
                              <Radio value={"EPE"}>EPE</Radio>
                            </Radio.Group>
                          ) : (
                            <Input className="input-type" readOnly={!crud} />
                          )}
                        </Form.Item>

                        {infoTecnicaLinea === "60d4c04a145bfab5e81b4626" ||
                        infoTecnicaLinea === "60d4c04bc02e32b5e8ac7b68" ||
                        infoTecnicaLinea === "60d4c04ba23e72b5e8f93e11" ? (
                          <Form.Item
                            label="Uso(s)"
                            name={["atributos_js", "usos"]}
                            rules={
                              crud
                                ? [
                                    {
                                      required: true,
                                      message:
                                        "Por favor, seleccione los usos!",
                                    },
                                  ]
                                : []
                            }
                          >
                            {crud ? (
                              <Select
                                mode="multiple"
                                allowClear
                                placeholder="Seleccione usos"
                                readOnly={!crud}
                              >
                                {infoTecnicaLinea === "60d4c04a145bfab5e81b4626"
                                  ? subcapaList
                                  : infoTecnicaGrupo ===
                                    "60d617738d422eca134f6685"
                                  ? termostatosList
                                  : infoTecnicaGrupo ===
                                    "60d61771a442edca131848b6"
                                  ? cartuchosList
                                  : infoTecnicaGrupo ===
                                    "60d61771f30664ca137cf63f"
                                  ? pegamentosList
                                  : infoTecnicaGrupo ===
                                    "60d617724ce2a1ca13e92920"
                                  ? mallasCeramicaList
                                  : infoTecnicaGrupo ===
                                    "60d617724cbea5ca130847e1"
                                  ? mallasPisosFlotantesList
                                  : []}
                              </Select>
                            ) : (
                              <TextArea
                                // className="input-type"
                                readOnly={!crud}
                              />
                            )}
                          </Form.Item>
                        ) : null}
                      </Col>
                    </Row>
                  ) : infoTecnicaLinea ===
                    "60d4c04851cbd1b5e83632d3" ? null : infoTecnicaLinea ===
                    "60d4c04ba23e72b5e8f93e11" ? null : infoTecnicaLinea ===
                    "60d4c0476e8514b5e8c66fd5" ? (
                    <Form.Item
                      label="Espesor de Capa de Madera"
                      name={["atributos_js", "espesor_capa_madera"]}
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message:
                                  "Por favor, ingrese el espesor de la capa de madera",
                              },
                            ]
                          : []
                      }
                    >
                      <InputNumber
                        min={0}
                        precision={2}
                        readOnly={!crud}
                        formatter={(value) => `${value} mm`}
                        parser={(value) => value.replace(" mm", "")}
                      />
                    </Form.Item>
                  ) : infoTecnicaLinea === "60d4c04bc02e32b5e8ac7b68" ? (
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          label="Rodamiento de Carga"
                          name={["atributos_js", "capacidad_rodamiento_carga"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, seleccione la capacidad de rodamiento de carga!",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <SelectOpciones
                              tipo="capacidad de rodamiento de carga"
                              readOnly={!crud}
                              setShow={setShow}
                            />
                          ) : (
                            <Input className="input-type" readOnly={!crud} />
                          )}
                        </Form.Item>

                        {infoTecnicaGrupo === "60d61771f30664ca137cf63f" ? (
                          <div>
                            <Form.Item
                              label="Tiempo de Trabajo"
                              name={["atributos_js", "tiempo_trabajo"]}
                              rules={
                                crud
                                  ? [
                                      {
                                        required: true,
                                        message:
                                          "Por favor, ingrese el tiempo de trabajo!",
                                      },
                                    ]
                                  : []
                              }
                            >
                              <InputNumber
                                min={0}
                                precision={0}
                                readOnly={!crud}
                                formatter={(value) => `${value} min`}
                                parser={(value) => value.replace(" min", "")}
                              />
                            </Form.Item>
                            <Form.Item
                              label="Tiempo de Oreo"
                              name={["atributos_js", "tiempo_oreo"]}
                              rules={
                                crud
                                  ? [
                                      {
                                        required: true,
                                        message:
                                          "Por favor, ingrese el tiempo de oreo!",
                                      },
                                    ]
                                  : []
                              }
                            >
                              <InputNumber
                                min={0}
                                precision={0}
                                readOnly={!crud}
                                formatter={(value) => `${value} min`}
                                parser={(value) => value.replace(" min", "")}
                              />
                            </Form.Item>
                          </div>
                        ) : null}
                        <Form.Item
                          label="Presentación"
                          name={["atributos_js", "presentacion"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, ingrese la presentacion!",
                                  },
                                ]
                              : []
                          }
                        >
                          <Input suffix="gal" readOnly={!crud} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Color"
                          name={["atributos_js", "color"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message: "Por favor, seleccione el color!",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <SelectOpciones
                              tipo="color de pegamento"
                              readOnly={!crud}
                              setShow={setShow}
                            />
                          ) : (
                            <Input className="input-type" readOnly={!crud} />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Olor"
                          name={["atributos_js", "olor"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, seleccione el tipo de olor!",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <SelectOpciones
                              tipo="olor"
                              readOnly={!crud}
                              setShow={setShow}
                            />
                          ) : (
                            <Input className="input-type" readOnly={!crud} />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Adherencia"
                          name={["atributos_js", "adherencia"]}
                          rules={
                            crud
                              ? [
                                  {
                                    required: true,
                                    message:
                                      "Por favor, seleccione el tipo adherencia!",
                                  },
                                ]
                              : []
                          }
                        >
                          {crud ? (
                            <SelectOpciones
                              tipo="adherencia"
                              readOnly={!crud}
                              setShow={setShow}
                            />
                          ) : (
                            <Input className="input-type" readOnly={!crud} />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : infoTecnicaLinea ===
                    "60db4816d2a990117e29ad6b" ? null : null}
                </Panel>
              ) : null}

              <Panel header="INFORMACIÓN COMERCIAL" key="2" extra={genExtra()}>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Método ABC"
                      name={["atributos_js", "metodo_abc"]}
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, ingrese el método ABC!",
                              },
                            ]
                          : []
                      }
                    >
                      {crud ? (
                        <Radio.Group
                          onChange={onChangeMetodoABC}
                          value={metodoABC}
                          disabled={!crud}
                        >
                          <Radio value={"A"}>A</Radio>
                          <Radio value={"B"}>B</Radio>
                          <Radio value={"C"}>C</Radio>
                        </Radio.Group>
                      ) : (
                        <Input className="input-type" readOnly={!crud} />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="Tipo"
                      name="tipo"
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message:
                                  "Por favor, seleccione el tipo de producto!",
                              },
                            ]
                          : []
                      }
                    >
                      {crud ? (
                        <Radio.Group
                          onChange={onChangeTipoProducto}
                          value={tipoProducto}
                          disabled={!crud}
                        >
                          <Radio value={"BIENES"}>BIENES</Radio>
                          <Radio value={"SERVICIOS"}>SERVICIOS</Radio>
                        </Radio.Group>
                      ) : (
                        <Input className="input-type" readOnly={!crud} />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="Tipo de Inventario"
                      name="tipo_inventario"
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message:
                                  "Por favor, seleccione el tipo de inventario!",
                              },
                            ]
                          : []
                      }
                    >
                      {crud ? (
                        <Radio.Group
                          onChange={onChangeTipoInventario}
                          value={tipoInventario}
                          disabled={!crud}
                        >
                          <Radio value={"PERMANENTE"}>PERMANENTE</Radio>
                          <Radio value={"BAJO PEDIDO"}>BAJO PEDIDO</Radio>
                        </Radio.Group>
                      ) : (
                        <Input className="input-type" readOnly={!crud} />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="Unidad de Medida"
                      name={crud ? "fk_unidad_medida_id" : "unidad_medida"}
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message:
                                  "Por favor, seleccione una unidad de medida!",
                              },
                            ]
                          : []
                      }
                    >
                      {crud ? (
                        <SelectOpciones
                          tipo="unidad de medida"
                          readOnly={!crud}
                          setShow={setShow}
                        />
                      ) : (
                        <Input className="input-type" readOnly={!crud} />
                      )}
                    </Form.Item>

                    <Form.Item
                      label="Unidad de Venta"
                      name={crud ? "fk_unidad_venta_id" : "unidad_venta"}
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message:
                                  "Por favor, seleccione una unidad de venta!",
                              },
                            ]
                          : []
                      }
                    >
                      {crud ? (
                        <SelectOpciones
                          tipo="unidad de venta"
                          readOnly={!crud}
                          setShow={setShow}
                        />
                      ) : (
                        <Input className="input-type" readOnly={!crud} />
                      )}
                    </Form.Item>

                    <Form.Item
                      label="Costo"
                      name="costo"
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, ingrese el costo!",
                              },
                            ]
                          : []
                      }
                    >
                      <Space>
                        <Row>
                          <div
                            className="ant-input-group-addon"
                            style={{
                              paddingTop: "2px",
                              verticalAlign: "middle",
                              display: "inline-table",
                              lineHeight: "24px",
                              height: "32px",
                            }}
                          >
                            {"$"}
                          </div>
                          <Form.Item name="costo">
                            <InputNumber
                              min={0}
                              precision={2}
                              readOnly={!crud}
                              // formatter={(value) =>
                              //   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              // }
                              // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            />
                          </Form.Item>
                        </Row>
                      </Space>
                    </Form.Item>
                    <Form.Item
                      name="precio"
                      label={
                        unidadMedida === "60d4ffd26a0c87b992906be4"
                          ? "Precio sin IVA (M2)"
                          : unidadMedida === "60d4ffd22c89acb9921b328a"
                          ? "Precio sin IVA (M)"
                          : unidadMedida === "60d4ffd21f3a73b992f66054"
                          ? "Precio sin IVA (GAL)"
                          : unidadMedida === "60d4ffd377ef4ab9922ed0b2"
                          ? "Precio sin IVA (ML)"
                          : unidadMedida === "60f9a66edde7528bd5a5d257"
                          ? "Precio sin IVA (UD.)"
                          : "Precio sin IVA ()"
                      }
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, ingrese el precio!",
                              },
                            ]
                          : []
                      }
                    >
                      <Space>
                        <Row>
                          <div
                            className="ant-input-group-addon"
                            style={{
                              paddingTop: "2px",
                              verticalAlign: "middle",
                              display: "inline-table",
                              lineHeight: "24px",
                              height: "32px",
                            }}
                          >
                            {"$"}
                          </div>
                          <Form.Item name="precio">
                            <InputNumber
                              min={0}
                              precision={2}
                              readOnly={!crud}
                              // onBlur={() => form.setFieldsValue({precio : parseFloat(precio).toFixed(2).toString()})}
                              // formatter={(value) =>
                              //   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              // }
                              // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            />
                          </Form.Item>
                        </Row>
                      </Space>
                    </Form.Item>

                    {!crud ? (
                      <div>
                        <Form.Item
                          label={
                            "Precio con IVA (" +
                            form.getFieldValue("unidad_medida_abreviatura") +
                            ")"
                          }
                        >
                          <Space>
                            <Row>
                              <div
                                className="ant-input-group-addon"
                                style={{
                                  paddingTop: "2px",
                                  verticalAlign: "middle",
                                  display: "inline-table",
                                  lineHeight: "24px",
                                  height: "32px",
                                }}
                              >
                                {"$"}
                              </div>
                              <InputNumber
                                value={
                                  (form.getFieldValue("precio") *
                                    (parseFloat(form.getFieldValue("iva")) +
                                      100)) /
                                  100
                                }
                                min={0}
                                precision={2}
                                readOnly={!crud}
                                // onBlur={() => form.setFieldsValue({precio : parseFloat(precio).toFixed(2).toString()})}
                                // formatter={(value) =>
                                //   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                // }
                                // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                              />
                            </Row>
                          </Space>
                        </Form.Item>
                        <Form.Item
                          label={
                            "Precio sin IVA (" +
                            form.getFieldValue("unidad_venta_abreviatura") +
                            ")"
                          }
                        >
                          <Space>
                            <Row>
                              <div
                                className="ant-input-group-addon"
                                style={{
                                  paddingTop: "2px",
                                  verticalAlign: "middle",
                                  display: "inline-table",
                                  lineHeight: "24px",
                                  height: "32px",
                                }}
                              >
                                {"$"}
                              </div>
                              <InputNumber
                                value={
                                  form.getFieldValue("precio") *
                                  form.getFieldValue("dimension_unidad_venta")
                                }
                                min={0}
                                precision={2}
                                readOnly={!crud}
                                // onBlur={() => form.setFieldsValue({precio : parseFloat(precio).toFixed(2).toString()})}
                                // formatter={(value) =>
                                //   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                // }
                                // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                              />
                            </Row>
                          </Space>
                        </Form.Item>
                        <Form.Item
                          label={
                            "Precio con IVA (" +
                            form.getFieldValue("unidad_venta_abreviatura") +
                            ")"
                          }
                        >
                          <Space>
                            <Row>
                              <div
                                className="ant-input-group-addon"
                                style={{
                                  paddingTop: "2px",
                                  verticalAlign: "middle",
                                  display: "inline-table",
                                  lineHeight: "24px",
                                  height: "32px",
                                }}
                              >
                                {"$"}
                              </div>
                              <InputNumber
                                value={
                                  form.getFieldValue("precio") *
                                  form.getFieldValue("dimension_unidad_venta") *
                                  1.12
                                }
                                min={0}
                                precision={2}
                                readOnly={!crud}
                                // onBlur={() => form.setFieldsValue({precio : parseFloat(precio).toFixed(2).toString()})}
                                // formatter={(value) =>
                                //   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                // }
                                // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                              />
                            </Row>
                          </Space>
                        </Form.Item>
                      </div>
                    ) : null}

                    <Form.Item
                      label="IVA"
                      name="iva"
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, ingrese el IVA!",
                              },
                            ]
                          : []
                      }
                    >
                      <InputNumber
                        min={0}
                        readOnly={!crud}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace("%", "")}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Descuento Especialista"
                      name="limite_descuento1"
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message:
                                  "Por favor, ingrese el limite de descuento 1!",
                              },
                            ]
                          : []
                      }
                    >
                      <InputNumber
                        min={0}
                        readOnly={!crud}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace("%", "")}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Descuento Líder Retail"
                      name="limite_descuento2"
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, ingrese el descuento!",
                              },
                            ]
                          : []
                      }
                    >
                      <InputNumber
                        min={0}
                        readOnly={!crud}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace("%", "")}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Descuento Líder Proyectos"
                      name="limite_descuento3"
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, ingrese el descuento!",
                              },
                            ]
                          : []
                      }
                    >
                      <InputNumber
                        min={0}
                        readOnly={!crud}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace("%", "")}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Descuento Eventos"
                      name="limite_descuento4"
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, ingrese el descuento!",
                              },
                            ]
                          : []
                      }
                    >
                      <InputNumber
                        min={0}
                        readOnly={!crud}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace("%", "")}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Límite Descuento 5"
                      name="limite_descuento5"
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message: "Por favor, ingrese el descuento!",
                              },
                            ]
                          : []
                      }
                    >
                      <InputNumber
                        min={0}
                        readOnly={!crud}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace("%", "")}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Dimensión de Unidad de Venta"
                      name="dimension_unidad_venta"
                      rules={
                        crud
                          ? [
                              {
                                required: true,
                                message:
                                  "Por favor, ingrese la dimensión de unidad de venta!",
                              },
                            ]
                          : []
                      }
                    >
                      <InputNumber min={0} readOnly={!crud} />
                    </Form.Item>
                    {!crud ? (
                      <Form.Item label="Total con Descuento Especialista">
                        <Space>
                          <Row>
                            <div
                              className="ant-input-group-addon"
                              style={{
                                paddingTop: "2px",
                                verticalAlign: "middle",
                                display: "inline-table",
                                lineHeight: "24px",
                                height: "32px",
                              }}
                            >
                              {"$"}
                            </div>
                            <InputNumber
                              value={
                                form.getFieldValue("precio") * 1.12 -
                                (form.getFieldValue("precio") *
                                  1.12 *
                                  form.getFieldValue("limite_descuento1")) /
                                  100
                              }
                              min={0}
                              precision={2}
                              readOnly={!crud}
                              // onBlur={() => form.setFieldsValue({precio : parseFloat(precio).toFixed(2).toString()})}
                              // formatter={(value) =>
                              //   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              // }
                              // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            />
                          </Row>
                        </Space>
                      </Form.Item>
                    ) : null}

                    {!crud ? (
                      <Form.Item label="Total con Descuento Líder Retail">
                        <Space>
                          <Row>
                            <div
                              className="ant-input-group-addon"
                              style={{
                                paddingTop: "2px",
                                verticalAlign: "middle",
                                display: "inline-table",
                                lineHeight: "24px",
                                height: "32px",
                              }}
                            >
                              {"$"}
                            </div>
                            <InputNumber
                              value={
                                form.getFieldValue("precio") * 1.12 -
                                (form.getFieldValue("precio") *
                                  1.12 *
                                  form.getFieldValue("limite_descuento2")) /
                                  100
                              }
                              min={0}
                              precision={2}
                              readOnly={!crud}
                              // onBlur={() => form.setFieldsValue({precio : parseFloat(precio).toFixed(2).toString()})}
                              // formatter={(value) =>
                              //   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              // }
                              // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            />
                          </Row>
                        </Space>
                      </Form.Item>
                    ) : null}
                    {!crud ? (
                      <Form.Item label="Total con Descuento Líder Proyectos">
                        <Space>
                          <Row>
                            <div
                              className="ant-input-group-addon"
                              style={{
                                paddingTop: "2px",
                                verticalAlign: "middle",
                                display: "inline-table",
                                lineHeight: "24px",
                                height: "32px",
                              }}
                            >
                              {"$"}
                            </div>
                            <InputNumber
                              value={
                                form.getFieldValue("precio") * 1.12 -
                                (form.getFieldValue("precio") *
                                  1.12 *
                                  form.getFieldValue("limite_descuento3")) /
                                  100
                              }
                              min={0}
                              precision={2}
                              readOnly={!crud}
                              // onBlur={() => form.setFieldsValue({precio : parseFloat(precio).toFixed(2).toString()})}
                              // formatter={(value) =>
                              //   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              // }
                              // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            />
                          </Row>
                        </Space>
                      </Form.Item>
                    ) : null}
                    {!crud ? (
                      <Form.Item label="Total con Descuento Eventos">
                        <Space>
                          <Row>
                            <div
                              className="ant-input-group-addon"
                              style={{
                                paddingTop: "2px",
                                verticalAlign: "middle",
                                display: "inline-table",
                                lineHeight: "24px",
                                height: "32px",
                              }}
                            >
                              {"$"}
                            </div>
                            <InputNumber
                              value={
                                form.getFieldValue("precio") * 1.12 -
                                (form.getFieldValue("precio") *
                                  1.12 *
                                  form.getFieldValue("limite_descuento4")) /
                                  100
                              }
                              min={0}
                              precision={2}
                              readOnly={!crud}
                              // onBlur={() => form.setFieldsValue({precio : parseFloat(precio).toFixed(2).toString()})}
                              // formatter={(value) =>
                              //   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              // }
                              // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            />
                          </Row>
                        </Space>
                      </Form.Item>
                    ) : null}
                    {!crud ? (
                      <Row>
                        <Col span={11}>
                          <Title level={5}>Stock General: </Title>
                        </Col>
                        <Col span={10}>
                          <Title level={5}>
                            {stock && stock.cantidad_stock}{" "}
                            <Tooltip
                              onClick={() => stockPorBodegas()}
                              trigger="click"
                              placement="right"
                              title={
                                stockBodegas ? stockBodegas : "Cargando..."
                              }
                            >
                              {stock && stock.cantidad_stock !== "N/A" && (
                                <InfoCircleOutlined />
                              )}
                            </Tooltip>
                          </Title>
                        </Col>
                      </Row>
                    ) : null}
                  </Col>
                </Row>
              </Panel>
              <Panel header="OTRA INFORMACIÓN" key="3" extra={genExtra()}>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      {...tailLayout}
                      name="en_sistema_externo"
                      valuePropName="checked"
                    >
                      {crud ? (
                        <Checkbox disabled={!crud}>En Sistema Externo</Checkbox>
                      ) : editProducto.en_sistema_externo ? (
                        <p>
                          En Sistema Externo:{" "}
                          <CheckCircleFilled style={{ fontSize: 18 }} />
                        </p>
                      ) : (
                        <p>
                          En Sistema Externo:{" "}
                          <CloseCircleFilled style={{ fontSize: 18 }} />
                        </p>
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      {...tailLayout}
                      name="en_web"
                      valuePropName="checked"
                    >
                      {crud ? (
                        <Checkbox disabled={!crud}>En Página Web</Checkbox>
                      ) : editProducto.en_web ? (
                        <p>
                          En Página Web:{" "}
                          <CheckCircleFilled style={{ fontSize: 18 }} />
                        </p>
                      ) : (
                        <p>
                          En Página Web:{" "}
                          <CloseCircleFilled style={{ fontSize: 18 }} />
                        </p>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
            </Collapse>
            <br />
            <Row>
              {crud ? (
                <Col md={18} xs={15}>
                  <Form.Item {...tailLayout}>
                    <Button
                      icon={<SaveOutlined />}
                      type="primary"
                      htmlType="submit"
                    >
                      GUARDAR
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                      className="button button3"
                      icon={<CloseSquareOutlined />}
                      type="default"
                      onClick={cancelConfirm}
                    >
                      CANCELAR
                    </Button>
                  </Form.Item>
                </Col>
              ) : (
                <Col md={24} xs={15}>
                  <Button
                    icon={<RollbackOutlined />}
                    type="primary"
                    onClick={goBackHistory}
                    style={{ marginBottom: 20 }}
                  >
                    REGRESAR
                  </Button>
                </Col>
              )}
            </Row>
          </Form>
          <Spin
            indicator={antIcon}
            hidden={codigo !== "nuevo" ? !show : true}
            className="loading-producto"
          />
        </>
      ) : editProducto === undefined ? <Redirect to="/home/productos" /> : (
        <Spin indicator={antIcon} className="loading-producto" />
      );
    } else {
      return <Redirect to="/home" />;
    }
  }
};

const ProductoForm = () => {
  return <FormProducto />;
};

export default ProductoForm;
