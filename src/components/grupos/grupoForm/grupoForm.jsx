import React, { useContext, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Form, Input, Button, message, Row, Col, Divider, Spin } from "antd";
import { useHistory } from "react-router";
import { SaveOutlined, CloseSquareOutlined, RollbackOutlined, LoadingOutlined } from "@ant-design/icons";
import { GrupoContext } from "../../../contexts/grupoContext";
import { SecuencialesGrupoService } from "../../../services/secuencialesGrupoService";
import { LineasMarcasService } from "../../../services/lineasMarcasService";
import { GrupoService } from "../../../services/grupoService";
import SelectOpciones from "../../selectOpciones/selectOpciones";
import "./grupoForm.css";
import { SesionContext } from "../../../contexts/sesionContext";
import Hashids from 'hashids';
let { REACT_APP_SEED } = process.env;
const hashids = new Hashids(REACT_APP_SEED);
const { TextArea } = Input;

const FormGrupo = (props) => {
  var { setMoved, sesions } = useContext(SesionContext);

  const { createGrupo, updateGrupo, findGrupo, editGrupo } = useContext(GrupoContext);

  let history = useHistory();
  let { codigo, operacion } = useParams();

  // console.log("LO QUE TENGO EN EDITGRUPO INICIO: ", editGrupo)

  let formHasChanges = false;
  const [crud, setCrud] = useState(
    operacion === "editar" || codigo === "nuevo" ? true : false
  );

  const [id, setId] = useState(null);
  const [selectedLineaId, setSelectedLineaId] = useState(undefined);
  const [selectedMarcaId, setSelectedMarcaId] = useState(undefined);
  const [selectedLineaMarcaId, setSelectedLineaMarcaId] = useState(undefined);
  const [form] = Form.useForm();
  const [codigoInterno, setCodigoInterno] = useState(null);
  let initialValues = {
    descripcion: '',
    fk_linea_marca: ''
  };

  function cancelConfirm() {
    if (!formHasChanges) {
      if (formHasChanges === true) {
        if (window.confirm("¿ ESTÁ SEGURO QUE DESEA SALIR ?, LOS CAMBIOS NO SE GUARDARÁN.")) {
          history.push("/home/grupos/");
        }
      } else {
        history.push("/home/grupos/");
      }
    } else {
      if (window.confirm("¿ ESTÁ SEGURO QUE DESEA SALIR ?, LOS CAMBIOS NO SE GUARDARÁN.")) {
        history.push("/home/grupos/");
      }
    }
  }

  function goBackHistory() {
    history.push("/home/grupos/")
  }

  //04/08/2021 - OBSERVACIÓN: ACÁ SE DEBE DEFINIR UNA PROPUESTA COMO UN typeTransactionSelect, PARA VER QUE TIPO DE SELECT SE VA A LLAMAR. - MC
  const typeTransactionSelect = {
    mode: null,
    placeHoldertext: "Subgrupo"
  };

  const typeTransactionData = { // OBSERVACIÓN: 01/09/2021 ESTA VARIABLE SE DEBE TRAER POR PROPS, PERO COMO EL COMPONENTE QUE LA TRAE USAN TODAS LAS RAMAS QUEDA AL PENDIENTE EL CAMBIO
    tableNamePSQL: "grupo",
    byIdPSQL: true,
    byInternalCodePSQL: false,
    dependenciesPSQL: false,
    labelCrudPlural: "GRUPOS",
    labelCrudSingle: "GRUPO"
  };

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

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    if (crud === null) {
      setCrud(operacion === "editar" || codigo === "nuevo" ? true : false);
    }
    // console.log("EN EN USEEFFECT EL EDIITGRUPO CON: " + JSON.stringify(editGrupo) + "Y LA LINEA SELECTED: " + selectedLineaId)

    if (initialValues.codigo === '' && codigoInterno && !editGrupo) {

      form.setFieldsValue({ codigo: codigoInterno[0].code_to_add })

    }

    /*if (form.getFieldValue("codigo") && form.getFieldValue("fk_marca_id")) {
      // console.log("HAY CAMBIOS EN EL CODIGO DE GRUPO!!!: ")
      console.log("USEEFFECT - EL EDIT GRUPPO Q TENNGO: ", JSON.stringify(editGrupo))

      if (operacion === "editar") {

        if (form.getFieldValue("fk_marca_id") !== editGrupo.fk_marca_id) {

          console.log("USEEFFECT - DEBE CONSULTAR UN NUEVO CODIGOL")

          // INCIO DE TRAIDA DE SECUENCIAL
          

        } else {

          console.log("USEEFFECT -DEBE VOLVER AL CODIGO INICIAL")
          form.setFieldsValue({
            codigo: editGrupo.codigo
          });

        }
      }
    }*/

    if (editGrupo) {
      // console.log("QUIERO SETEAR CON ESTO:  "+ editGrupo.grupo_marcas_nn[0].grupo_marca.fk_linea_id)
      // console.log("QUIERO SETEAR CON ESTO (EDITGRUPO):  " + JSON.stringify(editGrupo));
      if (!selectedMarcaId && !selectedLineaId) {
        // setSelectedLineaId(editGrupo.grupo_marcas_nn[0].grupo_marca.fk_linea_id);
        setSelectedLineaId(editGrupo.fk_linea_id);
        setSelectedMarcaId(editGrupo.fk_marca_id);
        setCodigoInterno(editGrupo.codigo);
        // setSelectedMarcaId(editGrupo.fk_marca_id); ESTO DEBE IR
        setId(editGrupo.id);
      }
    } else {
      // console.log("entra con este codigo: ", hashids.decodeHex(codigo))
      findGrupo(hashids.decodeHex(codigo));

    }

    if (!codigoInterno) {
      // AQUI LE DEBES REVISAR   console.log("HARÁ LA NUEVA CARGA EN UNA GRUPO: ", codigoInterno)
      // const secuencialesGrupoService = new SecuencialesGrupoService();
      // secuencialesGrupoService.getAll().then((data) => {setCodigoInterno(data)});
    }

  })

  const onFinish = async (values) => {

    let data = null;
    let messagesOnFinish = operacion === "editar" ? ["EDITAR", "EDITÓ"] : ["CREAR", "CREÓ"];
    delete values.permiso;

    // OBSERVACIÓN: ESTO SE DEBE REEMPLAZAR POR LA VARIABLE DE SESIÓN EN CUANTO ESTE CULMINADA
    // values["fk_empresa_id"] = "60d4bc7d22b552b5af1280bc";
    //console.log("EL ID QUE TRAE: " + id);
    // console.log("LOS VALUES DEL FORMULARIO: " + JSON.stringify(values));

    if (id) {

      values["id"] = id;
      // 01/09/2021 - OBSERVACIÓN: SE COMENTA LA LÓGICA ANTIGUA
      // let array1 = editGrupo.grupo_marcas_nn.map(x => x.id); // MARCAS INICIALES (BD)
      //let array2 = values.grupo_marcas_nn_in; // MARCAS DE FORM

      // 05/08/2021 - OBSERVACIÓN: Tener en cuenta si se cambia de Línea en el formulario qué pasa con las ingresadas anteriormente. -MC

      // SETTING GRUPO_MARCAS TO CREATE OR UPDATE
      // let temp_toCreateProveedorMarcasN = array2.filter(x => !array1.includes(x));
      // let toCreateProveedorMarcasN = temp_toCreateProveedorMarcasN.map(x => ({ fk_marca_id:x , fk_proveedor_id:id })) // SET FORMAT JSON

      // 01/09/2021 - OBSERVACIÓN: SE COMENTA LA LÓGICA ANTIGUA
      // let temp_toCreateGrupoMarcasN = array2.filter(x => !array1.includes(x));
      // let toCreateGrupoMarcasN = temp_toCreateGrupoMarcasN.map(x => ({ fk_marca_id: x, fk_linea_id: values.fk_linea_id, fk_grupo_id: id })) // SET FORMAT JSON

      // SETTING LINEAS_MARCAS TO DELETE (SOFTDELETE)
      // 01/09/2021 - OBSERVACIÓN: SE COMENTA LA LÓGICA ANTIGUA
      // let toDeleteGrupoMarcasN = array1.filter(x => !array2.includes(x));
      let jsonGruposMarcas = {}
      // let jsonGruposMarcas = { id_grupo: id, fk_linea_id: values.fk_linea_id, grupo_marcas_create: toCreateGrupoMarcasN, grupo_marcas_delete: toDeleteGrupoMarcasN };
      // console.log("EL JSON GRUPOS_MARCAS A MANDAR: " + JSON.stringify(jsonGruposMarcas))

      data = await updateGrupo([values, jsonGruposMarcas]);
      // console.log("LA DATA QUE RETORNA EL FORMULARIO EN EDITAR GRUPO stringify: " + JSON.stringify(data));
    } else {

      values["fk_empresa_id"] = "60d4bc7d22b552b5af1280bc";

      const lineasMarcasService = new LineasMarcasService();
      const codigoInternoData = await lineasMarcasService.getAll().then((data) => { // OBSERVACIÓN 31/08/2021: DEBE SER EL LLAMADO A UN GETONE() - MC
        // console.log("LA DATA DE LINEA_MARCA ANTES DE GUARDAR: " +  JSON.stringify(data.filter((lm) => lm.fk_marca_id === values.fk_marca_id && lm.fk_linea_id === values.fk_linea_id)))
        // setSelectedLineaMarcaId(data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId))

        // initialValues.fk_linea_marca = data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId)[0].id;

        // console.log("MI VALUES!! " + JSON.stringify(initialValues))

        // setCodigoInterno(data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId)[0].id);
        // console.log("VOY A COMPARAR ESTO: " + data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId)[0].id)
        // REVISAR return data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId);

        // DEEBE IR IF 

        // console.log("LO QUE QUIERO ASIGNAR: " + data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId)[0].id);
        // initialValues.fk_linea_marca = data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId)[0].id;
        // setOpciones(data.filter((p) => p.marca_id === filter && p.linea_id === filter2));
        // setOpciones(data.filter((p) => p.linea_id === filter));
        return data.filter((lm) => lm.fk_marca_id === values.fk_marca_id && lm.fk_linea_id === values.fk_linea_id);
      });

      // console.log("LO QUE DEVUELVE AL GUARDAR DE LINEA_MARCA: " + codigoInternoData)

      if (codigoInternoData) {
        values.fk_linea_marca = codigoInternoData[0].id
        delete values.fk_linea_id;
        delete values.fk_marca_id;
      }
      // console.log("LOS VALLUES FINAL FINAL PARA GUARDAR: " + JSON.stringify(values))
      data = await createGrupo(values);
    }

    if (data.message.includes("OK")) {
      if (codigo === "nuevo") {
        const grupoService = new GrupoService();
        const grupoCreated = await grupoService.getOne(data.data.id);
        if (grupoCreated) {
          message.info(JSON.stringify(data.message) + " -  EL GRUPO: " + JSON.stringify(grupoCreated.codigo) + " - " + JSON.stringify(grupoCreated.nombre) +
            " SE " + messagesOnFinish[1] + " CON ÉXITO", 2).then((t) => history.push("/home/grupos/"));
        } else {
          message.info(JSON.stringify(data.message) + " -  EL GRUPO: " + JSON.stringify(data.data.codigo) + " - " + JSON.stringify(data.data.nombre) +
            " SE " + messagesOnFinish[1] + " CON ÉXITO", 2).then((t) => history.push("/home/grupos/"));
        }
      } else {
        message.info(JSON.stringify(data.message) + " -  EL GRUPO: " + JSON.stringify(data.data.codigo) + " - " + JSON.stringify(data.data.nombre) +
          " SE " + messagesOnFinish[1] + " CON ÉXITO", 2).then((t) => history.push("/home/grupos/"));
      }
    } else {
      // 05/08/2021 - OBSERVACIÓN: ACÁ SE PODRÍA DAR UN MENSAJE MÁS DETALLADO Ó CONTROLAR CON LAS BANDERAS isMarcasLineasCreated/isMarcasLineasDeleted - MC
      // A LA INTERFAZ DE USUARIO, INCLUSO SE DEBE ANALLIZAR SI SE USA UN ROLLBACK & COMMIT
      message.error("ERROR AL MOMENTO DE " + messagesOnFinish[0] + " EL GRUPO - \n" + JSON.stringify(data.errorDetails.description), 15);
    }
  }

  const onFinishFailed = (errorInfo) => {

    // 04/08/2021 - OBSERVACIÓN: ACÁ SE DEBE CONTROLAR DESDE EL TYPETRANSACTION QUE TIPO DE ELIMINADO LÓGICO SE DEBE HACER. -MC
    // AL MOMENTO TODOS VAN A SOFDELETE, DESPUÉS SE VERÁ UNO POR DEFAULT
    message.warning("ERROR AL GUARDAR EL GRUPO");
  };

  const handleFormValuesChange = async (changedValues) => {

    // formHasChanges = operacion === "editar" || codigo === "nuevo" ? true : false;
    formHasChanges = true;
    const formFieldName = Object.keys(changedValues)[0];

    // 16/09/2021 - OBSERVACIÓN: SE DEBE CONTROLAR LA VALIDACIÓN DE VOLVER ASIGNAR LA MISMA LINEA Y MARCA Y QUE NO GENERE UN NUEVO CÓDIGO -MC
    /*
    if (form.getFieldValue("codigo") && form.getFieldValue("fk_marca_id")) {
      // console.log("HAY CAMBIOS EN EL CODIGO DE GRUPO!!!: ")
      console.log("EL EDIT GRUPPO Q TENNGO: ", JSON.stringify(editGrupo))

      if (form.getFieldValue("fk_marca_id") !== editGrupo.fk_marca_id) {

        console.log("DEBE CONSULTAR UN NUEVO CODIGOL")

      } else {

        console.log("DEBE VOLVER AL CODIGO INICIAL")
        form.setFieldsValue({
          codigo: editGrupo.codigo
        });

      }
    }*/


    if (formFieldName === "fk_linea_id") {
      // console.log("ENTRA EN CHANGE DE fk_linea_id CON: " + changedValues[formFieldName])
      setSelectedLineaId(changedValues[formFieldName]);
      setCodigoInterno(null);
      setSelectedMarcaId(null);
      form.setFieldsValue({ fk_marca_id: undefined });
      form.setFieldsValue({ codigo: undefined });

    }

    if (formFieldName === "fk_marca_id") {
      setSelectedMarcaId(changedValues[formFieldName]);
      const lineasMarcasService = new LineasMarcasService();
      // console.log("LA MARCA CON LA QUE VA A MAPEAR: " + changedValues[formFieldName])

      const codigoInternoData = await lineasMarcasService.getAll().then((data) => { // OBSERVACIÓN 31/08/2021: DEBE SER EL LLAMADO A UN GETONE() - MC
        // console.log("LA DATA LINEA_MARCA: ", data);
        // console.log("CON LO QUE VA A MAPPEAR: ", changedValues[formFieldName])
        // console.log("CON LO QUE VA A MAPPEAR LINEA ID: ", selectedLineaId)
        // console.log("LA DATA DE LINEA_MARCA MAPPEADO: " +  JSON.stringify(data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId)))
        // setSelectedLineaMarcaId(data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId))

        // initialValues.fk_linea_marca = data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId)[0].id;
        // console.log("MI VALUES!! " + JSON.stringify(initialValues))

        // setCodigoInterno(data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId)[0].id);
        // console.log("VOY A COMPARAR ESTO: " + data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId)[0].id)
        // REVISAR return data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId);

        // DEEBE IR IF 
        // console.log("LO QUE QUIERO ASIGNAR: " + data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId)[0].id);
        // initialValues.fk_linea_marca = data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId)[0].id;
        // setOpciones(data.filter((p) => p.marca_id === filter && p.linea_id === filter2));
        // setOpciones(data.filter((p) => p.linea_id === filter));

        // console.log("QUIERE FILTRAR PPOR ESTO FK_MARCA_ID : " + changedValues[formFieldName] + " , fk_linea_id == "+  selectedLineaId)
        return data.filter((lm) => lm.fk_marca_id === changedValues[formFieldName] && lm.fk_linea_id === selectedLineaId);
      });

      /*secuencialesService.getOne(typeTransactionData).then((data) => {
        // console.log("LA DATA QUE DEVUELVE DEL SERVICE: ", data)
        if (data.message.includes("OK")) {
          if (data.data) {
          // console.log("SE VA CON ESTE CODIGO: ", data.data.code_to_add)
          setCodigoInterno(data.data)
          }
          
        } else {

        }
      });*/

      // console.log("LENGTH: " + codigoInternoData.length + " LO QUE DEVUELVE EL DATA DE CODIGO: " + JSON.stringify(codigoInternoData));

      if (codigoInternoData.length > 0) {
        // console.log("QUIERE ASIGNAR ESTOOOOOOOOO: ", codigoInternoData[0])
        setSelectedLineaMarcaId(codigoInternoData[0])
        initialValues.fk_linea_marca = codigoInternoData[0].id;
        // console.log("MI VALUES!! " + JSON.stringify(initialValues))

        if (typeTransactionData) {
          // 13/09/2021 - OBSERVACIÓN: SE DEBERÍA DEFINIR UN NOMBRE PARA HACER ESE TIPO DE BÚSQUEDA O FILTRO DESDE UNA VISTA
          // Example: typeTransactionData.filterColumView
          typeTransactionData.fk_linea_marca = codigoInternoData[0].id;

          const secuencialesGrupoService = new SecuencialesGrupoService();
          secuencialesGrupoService.getOne(typeTransactionData).then((data) => {

            if (data.message.includes("OK")) {
              if (data.data) {
                // console.log("SE VA CON ESTE CODIGO: ", data.data.code_to_add)
                setCodigoInterno(data.data.code_to_add);
                form.setFieldsValue({ codigo: data.data.code_to_add });
                // console.log("EL LENGTH : ", data.data.length)
                ///console.log("EXISTEEEEEEE: ", tempCodigoInterno.length)
                // const tempCodigoInterno = data.data;
                // if (data.data.length > 0) {
                ///console.log("EXISTEEEEEEE: ", tempCodigoInterno.length)
                // setCodigoInterno(data.data.code_to_add);
                // form.setFieldsValue({ codigo: data.data.code_to_add });
                // } else {
                // setCodigoInterno("001");
                // form.setFieldsValue({ codigo: "001" });
                /// }
                // setCodigoInterno(tempCodigoInterno[0].code_to_add);
                // form.setFieldsValue({ codigo: tempCodigoInterno[0].code_to_add });
              } else {
                setCodigoInterno("001");
                form.setFieldsValue({ codigo: "001" });
              }
              setCodigoInterno(data.data)
              // }

            } else {
              // 09/09/2021 - OBSERVACIÓN: ACÁ SE DEBERÍA CONTROLAR UN CASO CONTRARIO O EL MANEJO DE UN CASO QUE NO SE ENCUENTRE UN CÓDIGO
              // alert("ERROR AL GENERAR EL CÓDIGO INTERNO A INGRESAR: " + data.message)
              setCodigoInterno(data.data)
            }
          });
        }// 17/09/2021 - OBSERVACIÓN: ACÁ SE DEBERÍA CONTROLAR UN CASO CONTRARIO CUANDO NO TENGA UN typeTransactionData Ó LA ESTRUCTURA CORRECTA EN ESTA VARIABLE
      } else {
        setCodigoInterno("001");
        form.setFieldsValue({ codigo: "001" });
      }
    };

  };
  if (sesions) {
    if (sesions._usuario[0].rol === 2 || operacion === "ver") {
      return (
        editGrupo || codigo === "nuevo" ? ( //13/09/2021 - OBSERVACIÓN: CONTROLAR CON SPIN LA CARGA DEL FORMULARIO - MC
          <>
            <Form
              {...layout}
              form={form}
              name="customized_form_controls"
              initialValues={editGrupo ? editGrupo : initialValues}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              onValuesChange={handleFormValuesChange}
            >
              <Divider className="titleFont">GRUPO</Divider>
              {/*"EL CRUD:   " + crud + " EL CODIGO TEXT: " + codigo +  " OPERACION: " + operacion*/}
              {/*"LINEA SELECTED: " + selectedLineaId + " MARCA SELECTED: " + selectedMarcaId*/}
              {/*"EL EDIT GRUPO " + JSON.stringify(editGrupo)*/}
              {/*"EL  CODIGO INTERNO " + JSON.stringify(codigoInterno)*/}
              {/*"EL PK LINEA_MARCA " + JSON.stringify(selectedLineaMarcaId)*/}
              {/*JSON.stringify(initialValues)*/}
              <br />
              <Row>
                <Col span={10}>
                  <Form.Item
                    label="Línea"
                    // name={crud ? "grupo_marcas_nn_in" : "linea"} 
                    // name={["grupo_marcas_nn_in",]}
                    name={crud ? "fk_linea_id" : "linea"}
                    rules={crud ? [
                      {
                        required: true,
                        message: "Por favor, seleccione una Línea!",
                      },
                    ] : []}
                  >
                    <SelectOpciones
                      tipo="línea"
                      readOnly={crud ? false : true}

                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Código"
                    name="codigo"
                    rules={[
                      { required: true, message: "Por favor, ingrese el Código del Grupo!" },
                    ]}
                  >
                    <Input
                      readOnly
                      className="input-type"
                      style={{ backgroundColor: '#d9d9d9' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={10}>
                  {/* <Form.Item
                  label="Aqui va Marca"
                  name="nombre"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, ingrese el Nombre del Grupo!!",
                    },
                  ]}
                >
                  <Input
                    readOnly={!crud}
                    placeholder="Ej: FIRSTLINE PRO"
                    className="input-type"
                  />
                </Form.Item> */}
                  <Form.Item
                    label="Marca"
                    name={crud ? "fk_marca_id" : "marca"}
                    // name="fk_marca_id"
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
                    <SelectOpciones
                      tipo="marca"
                      readOnly={crud ? false : true}
                      filter={selectedLineaId}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Subgrupo"
                    //name={!crud ? "fk_subgrupo_id" : "subgrupo"}
                    name="fk_subgrupo_id"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingrese el Nombre del Subgrupo!!",
                      },
                    ]}
                  >
                    <SelectOpciones
                      tipo="subgrupo"
                      readOnly={!crud}
                      typeTransaction={typeTransactionSelect}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={10}>
                  <Form.Item
                    label="Nombre"
                    name="nombre"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingrese el Nombre del Grupo!!",
                      },
                    ]}
                  >
                    <Input
                      readOnly={!crud}
                      placeholder="Ej: FIRSTLINE PRO"
                      className="input-type"
                      style={{ width: '80%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Descripción"
                    name="descripcion"
                  >
                    <TextArea rows={4} readOnly={!crud} placeholder="Descripción del Grupo, esta descripción se visualizará en la página web." />
                  </Form.Item>
                </Col>
              </Row>
              <br />
              {/* <Row> */}
              {/* <Col span={12}>
                <Form.Item
                  label="Marcas"
                  //name={crud ? "grupo_marcas_nn_in" : "marca"}
                  name="grupo_marcas_nn_in"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, seleccione una Marca!",
                    },
                  ]}
                >
                  <SelectOpciones
                    tipo="marcas"
                    readOnly={!crud}
                    filter={selectedLineaId}
                    typeTransaction={typeTransactionSelectMarca}
                  />
                </Form.Item>
              </Col>
              <Col span={18}>
              </Col> */}
              {/* </Row> */}
              {/* <Row justify="start">
              <Col span={18}>
                <Form.Item
                  label="Descripción"
                  name="descripcion"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, ingrese la descripción del Grupo",
                    },
                  ]}
                >
                  <TextArea rows={6} readOnly={!crud} placeholder="Descripción del Grupo, esta descripción se visualizará en la página web." />
                </Form.Item>
              </Col>
            </Row>
            <br /><br /> */}
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
                ) :
                  <Col md={24} xs={15}>
                    <Button
                      icon={<RollbackOutlined />}
                      type="primary"
                      onClick={goBackHistory}
                    >
                      REGRESAR
                    </Button>
                  </Col>
                }
              </Row>
              <br></br>
            </Form>
          </>) : (<Spin indicator={antIcon} className="loading-info" />)
      );

    } else {
      return <Redirect to="/home" />;
    }
  }
};

const GrupoForm = () => {
  return <FormGrupo />;
};

export default GrupoForm;