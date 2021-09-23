import React, { useContext, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Form, Input, Button, message, Row, Col, Divider, Spin } from "antd";
import { useHistory } from "react-router";
import { SaveOutlined, CloseSquareOutlined, RollbackOutlined, LoadingOutlined } from "@ant-design/icons";
import { MarcaContext } from "../../../contexts/marcaContext";
import SelectOpciones from "../../selectOpciones/selectOpciones";
import { SecuencialesService } from "../../../services/secuencialesService";
import { MarcaService } from "../../../services/marcaService";
import "./marcaForm.css";
import { SesionContext } from "../../../contexts/sesionContext";
import Hashids from 'hashids';
let { REACT_APP_SEED } = process.env;
const hashids = new Hashids(REACT_APP_SEED);

const { TextArea } = Input;

const FormMarca = (props) => {
  var {setMoved,sesions} =  useContext(SesionContext);

  const { createMarca, updateMarca, findMarca, editMarca } = useContext(MarcaContext);
  let history = useHistory();
  // console.log("LO QUE ESTA EN EDIT MARCA: " + JSON.stringify(editMarca))
  let { codigo, operacion } = useParams();
  let formHasChanges = false;
  const [crud, setCrud] = useState(
    operacion === "editar" || codigo === "nuevo" ? true : false
  );
  const [id, setId] = useState(null);
  const [form] = Form.useForm();
  const [codigoInterno, setCodigoInterno] = useState(null); // OBSERVACIÓN: 30/08/2021 LA VARIABLE SE DEBE CAMBIAR EN CUANTO SE DECIDA QUÉ NOMBRE VA A TENER EN LA BASE DE DATOS
  
  let initialValues = {
    descripcion: '',
    codigo: ''
  };

  function cancelConfirm() {
    if (!formHasChanges) {
      if (formHasChanges === true) {
        if (window.confirm("¿ ESTÁ SEGURO QUE DESEA SALIR ?, LOS CAMBIOS NO SE GUARDARÁN.")) {
          history.push("/home/marcas/");
        }
      } else {
        history.push("/home/marcas/");
      }
    } else {
      if (window.confirm("¿ ESTÁ SEGURO QUE DESEA SALIR ?, LOS CAMBIOS NO SE GUARDARÁN.")) {
        history.push("/home/marcas/");
      }
    }
  }

  function goBackHistory() {
    history.push("/home/marcas/")
  }

  const typeTransactionData = { // OBSERVACIÓN: 30/08/2021 ESTA VARIABLE SE DEBE TRAER POR PROPS, PERO COMO EL COMPONENTE QUE LA TRAE USAN TODAS LAS RAMAS QUEDA AL PENDIENTE EL CAMBIO -MC
    tableNamePSQL: "marca",
    byIdPSQL: true,
    byInternalCodePSQL: false,
    dependenciesPSQL: false,
    labelCrudPlural: "MARCAS",
    labelCrudSingle: "MARCA"
  };

  // 29/07/2021 - OBSERVACIÓN: ACÁ SE DEBE DEFINIR UNA PROPUESTA COMO UN typeTransactionSelect, PARA VER QUE TIPO DE SELECT SE VA A LLAMAR. -MC

  const typeTransactionSelect = {
    mode: "multiple",
    placeHoldertext: "Líneas"
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

    if (initialValues.codigo === '' && codigoInterno && !editMarca) {
      // form.setFieldsValue({ codigo: codigoInterno[0].code_to_add })
      form.setFieldsValue({ codigo: codigoInterno.code_to_add });
    }

    if (editMarca) {

      setId(editMarca.id);
      
    } else {

      findMarca(hashids.decodeHex(codigo));

    }

    if (!codigoInterno) {
      const secuencialesService = new SecuencialesService();
      secuencialesService.getOne(typeTransactionData).then((data) => {
        if (data.message.includes("OK")) {
          if (data.data) {
          setCodigoInterno(data.data);
          }
        } else {
          // 09/09/2021 - OBSERVACIÓN: ACÁ SE DEBERÍA CONTROLAR UN CASO CONTRARIO O EL MANEJO DE UN CASO QUE NO SE ENCUENTRE UN CÓDIGO
          alert("ERROR AL GENERAR EL CÓDIGO INTERNO A INGRESAR: " + data.message)
          setCodigoInterno(data.data);
        }

      });

    }
  })

  const onFinish = async (values) => {

    let data = null;
    let messagesOnFinish = operacion === "editar" ? ["EDITAR", "EDITÓ"] : ["CREAR", "CREÓ"];
    delete values.permiso;

    // OBSERVACIÓN: ESTO SE DEBE REEMPLAZAR POR LA VARIABLE DE SESION EN CUANTO ESTE CULMINADA - MC
    // values["fk_empresa_id"] = "60d4bc7d22b552b5af1280bc";

    // console.log("EL ID QUE TRAE: " + id);
    // console.log("LOS VALUES DEL FORMULARIO: " + JSON.stringify(values));

    if (id) {

      values["id"] = id;
      let array1 = editMarca.lineas_nn.map(x=>x.id); // LINEAS INICIALES (BD)
      let array2 = values.lineas_nn_in; // LINEAS DE FORM

      // SETTING LINEAS_MARCAS TO CREATE OR UPDATE
      let temp_toCreateMarcaLineasN = array2.filter(x => !array1.includes(x));
      let toCreateMarcaLineasN = temp_toCreateMarcaLineasN.map(x => ({ fk_linea_id:x , fk_marca_id:id })) // SET FORMAT JSON
      
      // SETTING LINEAS_MARCAS TO DELETE (SOFTDELETE)
      // console.log("C2: ", array1.filter(x => !array2.includes(x)))
      let toDeleteMarcaLineasN = array1.filter(x => !array2.includes(x));

      // let jsonLineasMarcas = {id_marca: id, marcas_lineas_create: toCreateMarcaLineasN, marcas_lineas_delete: toDeleteMarcaLineasN};
      let jsonLineasMarcas = {id_marca: id, marcas_lineas_create: toCreateMarcaLineasN, marcas_lineas_delete: toDeleteMarcaLineasN};

      // console.log("EL JSON LINEAS_MARCAS A MANDAR: " + JSON.stringify(jsonLineasMarcas))
      data = await updateMarca([values, jsonLineasMarcas]);
      // console.log("LA DATA QUE RETORNA EL FORMULARIO EN EDITAR LINEA stringify: " + JSON.stringify(data));

    } else {

      values["fk_empresa_id"] = "60d4bc7d22b552b5af1280bc";
      delete values.codigo; // 30/08/2021 - OBSERVACIÓN: VERFICAR SI DESPUÉS SE DEBE VALIDAR ANTES DE HACER EL DELETE.
      // values.codigo = '004';
      data = await createMarca(values);
    }

    if (data.message.includes("OK")) {
      if (codigo === "nuevo") {
        const marcaService = new MarcaService();
        const marcaCreated = await marcaService.getOne(data.data.id);

        if (marcaCreated){
          message.info(JSON.stringify(data.message) + " -  LA MARCA: " + JSON.stringify(marcaCreated.codigo) + " - " + JSON.stringify(marcaCreated.nombre) +
          " SE " + messagesOnFinish[1] + " CON ÉXITO", 2).then((t) => history.push("/home/marcas/"));

        } else {
          message.info(JSON.stringify(data.message) + " -  LA MARCA: " + JSON.stringify(data.data.codigo) + " - " + JSON.stringify(data.data.nombre) +
          " SE " + messagesOnFinish[1] + " CON ÉXITO", 2).then((t) => history.push("/home/marcas/"));
        }
        
      } else {
        message.info(JSON.stringify(data.message) + " -  LA MARCA: " + JSON.stringify(data.data.codigo) + " - " + JSON.stringify(data.data.nombre) +
          " SE " + messagesOnFinish[1] + " CON ÉXITO", 2).then((t) => history.push("/home/marcas/"));
      }

    } else {
      // 01/08/2021 - OBSERVACIÓN: ACÁ SE PODRÍA DAR UN MENSAJE MÁS DETALLADO Ó CONTROLAR CON LAS BANDERAS isMarcasLineasCreated/isMarcasLineasDeleted -MC
      // A LA INTERFAZ DE USUARIO, INCLUSO SE DEBE ANALIZAR SI SE USA UN ROLLBACK & COMMIT
      message.error("ERROR AL MOMENTO DE " + messagesOnFinish[0] + " LA MARCA - \n" + JSON.stringify(data.errorDetails.description), 15);
    }
  }

  const onFinishFailed = (errorInfo) => {
    // 21/07/2021 - OBSERVACIÓN: ACÁ SE DEBE CONTROLAR DESDE EL TYPETRANSACTION QUE TIPO DE ELIMINADO LÓGICO SE DEBE HACER. - MC
    // AL MOMENTO TODOS VAN A SOFDELETE, DESPUÉS SE VERÁ UNO POR DEFAULT
    message.warning("ERROR AL GUARDAR LA MARCA");
  };

  const handleFormValuesChange = async (changedValues) => {

    formHasChanges = true;
    
  };
if(sesions){
  if (sesions._usuario[0].rol ===2 || operacion === "ver") {
    return (
      (editMarca || codigo === "nuevo") && codigoInterno ? (
        <>
          <Form
            {...layout}
            form={form}
            name="customized_form_controls"
            initialValues={editMarca ? editMarca : initialValues}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            onValuesChange={handleFormValuesChange}
          >
            <Divider className="titleFont">MARCA</Divider>
            <br />
            <Row>
              <Col span={12}>
                <Form.Item
                  label="Nombre"
                  name="nombre"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, ingrese el Nombre de la Marca!!",
                    },
                  ]}
                >
                  <Input
                    readOnly={!crud}
                    placeholder="Ej: BerryAlloc"
                    className="input-type"
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="Código"
                  name="codigo"
                  rules={[
                    { required: true, message: "Por favor, ingrese el Código de la Marca!" },
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
            <br /><br />
            <Row justify="start">
              <Col span={18}>
                <Form.Item
                  label="Descripción"
                  name="descripcion"
                >
                  <TextArea rows={6} readOnly={!crud} placeholder="Descripción de la Marca, esta descripción se visualizará en la página web." />
                </Form.Item>
              </Col>
            </Row>
            <br /><br />
            <Divider className="titleFont" orientation="left" >LÍNEAS DE LA MARCA</Divider>
            <br />
            <Row >
              <Col span={9}>
                <Form.Item
                  label="Línea"
                  name={"lineas_nn_in"}
                  >
                  <SelectOpciones
                    tipo="línea"
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
        </> ) : ( <Spin indicator={antIcon} className="loading-info" /> )
    );

  } else {
    return <Redirect to="/home" />;
  }
}
};

const MarcaForm = () => {
  return <FormMarca />;
};

export default MarcaForm;