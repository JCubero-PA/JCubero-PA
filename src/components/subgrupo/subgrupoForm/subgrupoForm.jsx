import { Button, Col, Divider, Input, message, Row } from 'antd'
import { Redirect, useParams } from "react-router-dom"; import Form from 'antd/lib/form'
import TextArea from 'antd/lib/input/TextArea'
import React, { useContext, useEffect, useState } from 'react'
import SelectOpciones from '../../selectOpciones/selectOpciones'
import { SubgrupoContext } from "../../../contexts/subgrupoContext";
import { useHistory } from "react-router";
import { CloseSquareOutlined, RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import { SesionContext } from '../../../contexts/sesionContext';
import Hashids from 'hashids';
let { REACT_APP_SEED } = process.env;
const hashids = new Hashids(REACT_APP_SEED);

const SubgrupoForm = () => {
  var { setMoved, sesions } = useContext(SesionContext);
  let formHasChanges = false;
  const [id, setId] = useState(null);
  let { codigo, operacion } = useParams();
  let history = useHistory();
  const { subgrupos, updateSubgrupo, createSubgrupo, findSubgrupo, editSubgrupo } = useContext(SubgrupoContext);
  const [crud, setCrud] = useState(
    operacion === "editar" || codigo === "nuevo" ? true : false
  );

  let initialValues = {
    descripcion: ''
  };

  useEffect(async () => {
    if (crud === null) {
      setCrud(operacion === "editar" || codigo === "nuevo" ? true : false);
    }

    if (editSubgrupo) {

      setId(editSubgrupo.id);

    } else {

      findSubgrupo(hashids.decodeHex(codigo));

    }
  });

  const onFinish = async (values) => {

    // console.log("values " + JSON.stringify(values));
    let data = null;
    let messagesOnFinish = operacion === "editar" ? ["EDITAR", "EDITÓ"] : ["CREAR", "CREÓ"];
    delete values.permiso;

    if (id) {
      values["id"] = id;
      data = await updateSubgrupo(values);
    }
    else {
      data = await createSubgrupo(values)
    }

    // console.log("LA DATA QUE DEVUELVE: ", JSON.stringify(data))

    if (data.message.includes("OK")) {

      message.info(JSON.stringify(data.message) + " -  EL SUBGRUPO: " + JSON.stringify(data.data.nombre) + " SE " + messagesOnFinish[1] + " CON ÉXITO", 2).then((t) => history.push("/home/subgrupo/"));
      
    } else {
      message.error("ERROR AL MOMENTO DE " + messagesOnFinish[0] + " EL SUBGRUPO - \n" + JSON.stringify(data.errorDetails.description), 15);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.warning("ERROR AL GUARDAR EL SUBGRUPO");
  };

  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  function cancelConfirm() {
    if (formHasChanges !== null) {
      if (formHasChanges === true) {
        if (window.confirm("¿ ESTÁ SEGURO QUE DESEA SALIR ?, LOS CAMBIOS NO SE GUARDARÁN.")) {
          history.push("/home/subgrupo");
        }
      } else {
        history.push("/home/subgrupo/");
      }
    } else {
      if (window.confirm("¿ ESTÁ SEGURO QUE DESEA SALIR ?, LOS CAMBIOS NO SE GUARDARÁN.")) {
        history.push("/home/subgrupo/");
      }
    }
  }

  function goBackHistory() {
    history.push("/home/subgrupo")
  }
  const handleFormValuesChange = async (changedValues) => {
    // console.log("ONCHANGE", form.getFieldsValue());
    // formHasChanges = operacion === "editar" || codigo === "nuevo" ? true : false;
    formHasChanges = true;
  };

  if (sesions) {
    if (sesions._usuario[0].rol === 2 || operacion === "ver") {
      return (
        <>
          {editSubgrupo || codigo === "nuevo" ?
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={editSubgrupo ? editSubgrupo : initialValues}
              onValuesChange={handleFormValuesChange}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Divider className="titleFont">SUBGRUPO</Divider>
              <br />
              <Row >
                <Col span={18}>
                  <Form.Item
                    label="Nombre"
                    name="nombre"
                    rules={[{ required: true, message: 'Porfavor ingrese el nombre' }]}
                  >
                    <Input
                      readOnly={!crud} />
                  </Form.Item>
                </Col>
              </Row >
              <Row >
                <Col span={18}>
                  <Form.Item
                    label="Descripcion"
                    name="descripcion"
                    rules={[{ required: false, message: 'Por gavor ingrese su descripcion' }]}
                  >
                    <TextArea rows={6} readOnly={!crud} placeholder="Descripción del Subgrupo." />
                  </Form.Item>
                </Col>
              </Row >
              <Row >
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
              </Row >
            </Form>
            : null}
        </>
      )
    }
    else {
      return <Redirect to="/home" />;
    }
  }
}

export default SubgrupoForm