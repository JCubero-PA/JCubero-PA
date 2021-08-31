import React, { useContext, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Form, Input, Button, message, Row, Col, Divider } from "antd";
import { useHistory } from "react-router";
import { SaveOutlined, CloseSquareOutlined, RollbackOutlined } from "@ant-design/icons";
import { LineaContext } from "../../../contexts/lineaContext";
import SelectOpciones from "../../selectOpciones/selectOpciones";
import { SecuencialesService } from "../../../services/secuencialesService";
import "./lineaForm.css";
import { SesionContext } from "../../../contexts/sesionContext";
const { TextArea } = Input;
const FormLinea = (props) => {
  var {setMoved,sesions} =  useContext(SesionContext);
  const { createLinea, updateLinea, findLinea, editLinea } = useContext(LineaContext);
  let history = useHistory();
  // console.log("LO QUE ESTA EN EDIT LINEA: " + JSON.stringify(editLinea))
  let { codigo, operacion } = useParams();
  let formHasChanges = false;
  const [crud, setCrud] = useState(
    operacion === "editar" || codigo === "nuevo" ? true : false
  );

  const [id, setId] = useState(null);
  const [form] = Form.useForm();
  const [codigoInterno, setCodigoInterno] = useState(null); // OBSERVACIÓN: 17/08/2021 LA VARIABLE SE DEBE CAMBIAR EN CUANTO SE DECIDA QUÉ NOMBRE VA A TENER EN LA BASE DE DATOS

  let initialValues = {
    descripcion: '',
    codigo: ''
  };

  function cancelConfirm() {
    if (formHasChanges !== null) {
      if (formHasChanges === true) {
        if (window.confirm("¿ ESTÁ SEGURO QUE DESEA SALIR ?, LOS CAMBIOS NO SE GUARDARÁN.")) {
          history.push("/home/lineas/");
        }
      } else {
        history.push("/home/lineas/");
      }
    } else {
      if (window.confirm("¿ ESTÁ SEGURO QUE DESEA SALIR ?, LOS CAMBIOS NO SE GUARDARÁN.")) {
        history.push("/home/lineas/");
      }
    }
  }

  function goBackHistory() {
    history.push("/home/lineas/")
  }

  // console.log("EL CODIGO: + " + pseudo);
  // console.log("EL HISTORY: + " + JSON.stringify(history));
  // console.log("EL LOCATION: + " + JSON.stringify(location));
  // console.log("lOS PROPS DE lINEA: " + JSON.stringify(props));
  // const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const typeTransactionData = { // OBSERVACIÓN: 17/08/2021 ESTA VARIABLE SE DEBE TRAER POR PROPS, PERO COMO EL COMPONENTE QUE LA TRAE USAN TODAS LAS RAMAS QUEDA AL PENDIENTE EL CAMBIO
    tableNamePSQL: "linea",
    byIdPSQL: true,
    byInternalCodePSQL: false,
    dependenciesPSQL: false,
    labelCrudPlural: "LÍNEAS",
    labelCrudSingle: "LÍNEA"
  };

  // console.log("EL typeTransactionData: " + JSON.stringify(typeTransactionData));

  // 02/08/2021 - OBSERVACIÓN: ACÁ SE DEBE DEFINIR UNA PROPUESTA COMO UN typeTransactionSelect, PARA VER QUE TIPO DE SELECT SE VA A LLAMAR. 
  
  const typeTransactionSelect = {
    mode: "multiple",
    placeHoldertext: "Marcas"
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


  // const [opciones, setOpciones] = useState([]);
  // const [stock, setStock] = useState(null);
  // const [opciones, setOpciones] = useState([]);

  useEffect(() => {

    if (crud === null) {
      setCrud(operacion === "editar" || codigo === "nuevo" ? true : false);
    }


     // console.log("EL EDITLINEA EN USEEFFECT: " + JSON.stringify(editLinea))
    if (initialValues.codigo === '' && codigoInterno && !editLinea) {
      // console.log("EL CODIGO INTERNO: ", JSON.stringify(codigoInterno))
      // console.log("ENTRA A IF INITIAL" + JSON.stringify(codigoInterno))

      // 26/07/2021 - OBSERVACIÓN: SE DEBE ANALIZAR SI SE ASIGNA O NO EL VALOR DEL CÓDIGO A INGRESAR QUE NOS TRAE LA VISTA AL JSON
      // QUE VA A GUARDAR,, YA QUE LA BASE DE DATOS EN EL TRIGGER ESTÁ ASIGNANDO EL CAMPO DE CODIGO, PERO TENER EN CUENTA.
      
      // initialValues.codigo = codigoInterno[0].code_to_add; // COMENTADO - MC

      // console.log("DESPUES DE ASIGNACION: " + JSON.stringify(initialValues))
      form.setFieldsValue({ codigo: codigoInterno[0].code_to_add })

    }

    

    // console.log("useeffect editlinea: " + editLinea)
    if (!codigoInterno && editLinea) {
      // console.log("ENTRA AL IF DE CODIGO INTERNO Y EDIT LINEA")
      /*new ProductoService()
        .getStock(editProducto.codigoInterno)
        .then((data) => setStock(data));*/

    }

    if (editLinea) {
      // console.log("ENTTRA AL EDITLINEA EN DONDE DEBE")
      setId(editLinea.id);
      // setCodigoInterno(data.filter((t) => t.table_name_db === typeTransactionData.tableNamePSQL))
      // initialValues.codigo = data.filter((t) => t.table_name_db === typeTransactionData.tableNamePSQL)// acacaaaaa

    } else {
      findLinea(codigo);
    }

    if (!codigoInterno) {
      // console.log("CODIGO: ", codigo)
      // console.log("HARÁ LA NUEVA CARGA EN UNA LINEA: ", codigoInterno)
      // console.log("LINEA", editLinea);
      const secuencialesService = new SecuencialesService();

      // console.log("VA A INTENTAR CONSULTAR: ", secuencialesService)
      secuencialesService.getAll().then((data) => {
        // console.log("LA DATA QUE DEVUELVE DEL SERVICE: ", data)
        // console.log("LO QUE TENGO EN TRABSACTION DATA: ", typeTransactionData)

        // console.log("MAP TABLENAME: ", data.filter((t) => t.table_name_db === typeTransactionData.tableNamePSQL).code_to_add)
        if (typeTransactionData) {
          setCodigoInterno(data.filter((t) => t.table_name_db === typeTransactionData.tableNamePSQL))
          // console.log("LO QUE ME QUEDA DEL codigoInterno: " + JSON.stringify(codigoInterno))
          // console.log("LO QUE ME QUEDA DEL MAPPING: " + JSON.stringify(data.filter((t) => t.table_name_db === typeTransactionData.tableNamePSQL)[0]))
          // setCodigoInternoNew(data.filter((t) => t.table_name_db === typeTransactionData.tableNamePSQL)[0].code_to_add);
          // initialValues.codigo = data.filter((t) => t.table_name_db === typeTransactionData.tableNamePSQL)[0].code_to_add;
          // console.log("EL INITIAL VALUES: " + JSON.stringify(initialValues))
        }// 30/08/2021 - OBSERVACIÓN: ACÁ SE DEBERÍA CONTROLAR UN CASO CONTRARIO O EL MANEJO DE UN CASO QUE NO SE ENCUENTRE UN CÓDIGO
      });
    }
  })

  const onFinish = async (values) => {

    let data = null;
    let messagesOnFinish = operacion === "editar" ? ["EDITAR", "EDITÓ"] : ["CREAR", "CREÓ"];
    delete values.permiso;

    // OBSERVACIÓN: ESTO SE DEBE REEMPLAZAR POR LA VARIABLE DE SESION EN CUANTO ESTE CULMINADA
    // values["fk_empresa_id"] = "60d4bc7d22b552b5af1280bc";

    // console.log("LOS VALUES DEL FORMULARIO: " + JSON.stringify(values));

    if (id) {
      values["id"] = id;
      let array1 = editLinea.marcas_nn.map(x => x.id); // MARCAS INICIALES (BD)
      let array2 = values.marcas_nn_in; // LINEAS DE FORM

      // console.log("como el array1: " + array1);
      // console.log("como el array2: " + array2);
      // console.log("C1: ", array2.filter(x => !array1.includes(x)));

      // SETTING LINEAS_MARCAS TO CREATE OR UPDATE
      let temp_toCreateMarcaLineasN = array2.filter(x => !array1.includes(x));
      let toCreateMarcaLineasN = temp_toCreateMarcaLineasN.map(x => ({ fk_marca_id: x, fk_linea_id: id })) // SET FORMAT JSON

      // SETTING LINEAS_MARCAS TO DELETE (SOFTDELETE)
      // console.log("C2: ", array1.filter(x => !array2.includes(x)))
      let toDeleteMarcaLineasN = array1.filter(x => !array2.includes(x));

      let jsonLineasMarcas = { id_linea: id, marcas_lineas_create: toCreateMarcaLineasN, marcas_lineas_delete: toDeleteMarcaLineasN };

      // console.log("EL JSON LINEAS_MARCAS A MANDAR: " + JSON.stringify(jsonLineasMarcas))

      data = await updateLinea([values, jsonLineasMarcas]);
      // console.log("LA DATA QUE RETORNA EL FORMULARIO EN EDITAR LINEA stringify: " + JSON.stringify(data));

      // console.log("LA DATA ANTES DE LLAMAR A UPDATE CONTEXT: " + JSON.stringify(values));
      /// data = await updateLinea(values);
      // console.log("LA DATA QUE RETORNA EL FORMULARIO EN EDITAR LINEA stringify: " + JSON.stringify(data));

    } else {
      values["fk_empresa_id"] = "60d4bc7d22b552b5af1280bc";
      // console.log("LO QUE TRAE DEL FORMULARIO Y VA A GUARDAR EN UNO NUEVO:", JSON.stringify(values));

      delete values.codigo; // 26/08/2021 - OBSERVACIÓN: VERFICAR SI DESPUÉS SE DEBE  VALIDAR ANTES DE HACER EL DELETE. 
      // values.codigo = '004';

      // console.log("LOS VALUES DEL FORMULARIO AFTER: " + JSON.stringify(values));

      data = await createLinea(values);

    }

    // console.log("LA DATA QUE VUELVE AL GUARDAR: ", JSON.stringify(data))
    // 26/08/2021 (MC) - OBSERVACIÓN: DEFINIR SI SE TIENE QUE HACER UN LLAMADO DE LA LINEA INGRESADA PARA MOSTRARLE AL USUARIO EL CÓDIGO CON EL QUE SE GUARDÓ.
    if (data.message.includes("OK")) {
      message.info(JSON.stringify(data.message) + " -  LA LÍNEA: " + JSON.stringify(data.data.codigo) + " - " + JSON.stringify(data.data.nombre) + 
      " SE " + messagesOnFinish[1] + " CON ÉXITO", 2).then((t) => history.push("/home/lineas/"));
      // message.info(JSON.stringify(data.message) + " -  LA LÍNEA: " + JSON.stringify(data.data.nombre) + " SE " + messagesOnFinish[1] + " CON ÉXITO", 2).then((t) => history.push("/home/lineas/"));
    } else {
      message.error("ERROR AL MOMENTO DE " + messagesOnFinish[0] + " LA LÍNEA - \n" + JSON.stringify(data.errorDetails.description), 15);
    }

    /// console.log("LA DATA QUE RETORNA EL FORMULARIO EN stringify: " + JSON.stringify(data));
    /// console.log("LA DATA ERROR Q RETORNA: " + JSON.stringify(data.errorDetails));
    /// console.log("EL DATA.MESSAGE: " + JSON.stringify(data.message));
    /// console.log("EL DATA.DATA: " + JSON.stringify(data.data));
  }

  const onFinishFailed = (errorInfo) => {
    // console.log("onFinishFailed - Error al guardar la Linea: " + errorInfo.errorFields, errorInfo);
    // console.log("BRINCA EL ONFINISHFAILED"); // OBSER

    // 21/07/2021 - OBSERVACIÓN: ACÁ SE DEBE CONTROLAR DESDE EL TYPETRANSACTION QUE TIPO DE ELIMINADO LÓGICO SE DEBE HACER. 
    // AL MOMENTO TODOS VAN A SOFDELETE, DESPUÉS SE VERÁ UNO POR DEFAULT
    // console.log("ENTRA AL ELIMINAR EN HANDLEOK LINEA CON RECORD: " + JSON.stringify(record))
    message.warning("ERROR AL GUARDAR LA LÍNEA");
  };

  const handleFormValuesChange = async (changedValues) => {
    formHasChanges = operacion === "editar" || codigo === "nuevo" ? true : false;
  };

  // console.log("EL ROL DEL USER ID: " + JSON.parse(localStorage.getItem("user")).rol);
  
if(sesions){
  if (sesions._usuario[0].rol ===2 || operacion === "ver") {
    return (
      editLinea || codigo === "nuevo" ?
        <>
          <Form
            {...layout}
            form={form}
            name="customized_form_controls"
            initialValues={editLinea ? editLinea : initialValues}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={handleFormValuesChange}
          >
            <Divider className="titleFont">LÍNEA</Divider>
            {/*"EL CRUD:   " + crud + " EL CODIGO TEXT: " + codigo +  " OPERACION: " + operacion*/}
            {/*JSON.stringify(editLinea)*/}
            {/*JSON.stringify(codigoInterno)*/}
            {/*JSON.stringify(initialValues)*/}
            <br />
            <Row>
              <Col span={12}>
                <Form.Item
                  label="Nombre"
                  name="nombre"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Por favor, ingrese el Nombre de la Línea!!",
                  //   },
                  // ]}
                  rules={
                    crud
                      ? [
                        {
                          required: true,
                          message: "Por favor, ingrese el Nombre de la Línea!!",
                        },
                      ]
                      : []
                  }
                >
                  <Input
                    readOnly={!crud}
                    placeholder="Ej: Piso Laminado"
                    className="input-type"
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="Código"
                  name="codigo"
                  rules={[
                    { required: true, message: "No se ha asignado un Código a la Línea!" }
                  ]}
                >
                  <Input
                    readOnly
                    className="input-type"
                    style={{ backgroundColor: '#d9d9d9' }} // 
                  />
                </Form.Item>
                {/* <Form.Item
                  label="Pseudónimo"
                  name="pseudo"
                  rules={[
                    { required: true, message: "Por favor, ingrese el Pseudónimo de la Línea!" },
                    { max: 3, message: 'El Pseudónimo debe tener como máximo 3 caracteres' },
                  ]}
                >
                  <Input
                    readOnly={ operacion === "editar" ? crud : !crud }
                    placeholder="Ej: PL"
                    className="input-type"
                  />
                </Form.Item> */}
              </Col>
            </Row>
            <br />
            <Row justify="start">
              <Col span={18}>
                <Form.Item
                  label="Descripción"
                  name="descripcion"
                  rules={
                    crud
                      ? [
                        {
                          required: true,
                          message: "Por favor, ingrese la descripción de la Línea",
                        },
                      ]
                      : []
                  }
                >
                  <TextArea rows={6} readOnly={!crud} placeholder="Descripción de la Línea, esta descripción se visualizará en la página web." />
                </Form.Item>
              </Col>
            </Row>
            <br />
            <Divider className="titleFont" orientation="left" >MARCAS DE LA LÍNEA</Divider>
            <br />
            <Row >
              <Col span={9}>
                <Form.Item
                  label="Marca"
                  name={"marcas_nn_in"}
                >
                  <SelectOpciones
                    tipo="marcas"
                    readOnly={!crud}
                    typeTransaction={typeTransactionSelect} />
                </Form.Item>
              </Col>
            </Row>
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
            <br />
          </Form>
        </> : null
    );

  } else {
    return <Redirect to="/home" />;
  }
}
};

const LineaForm = () => {
  return <FormLinea />;
};

export default LineaForm;