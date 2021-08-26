import { Table, Spin, Divider } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import CrudButton from '../../crudButton/crudButton';
import { SubgrupoContext } from "../../../contexts/subgrupoContext";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { Button } from 'antd/lib/radio';
import Search from 'antd/lib/input/Search';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';




export const SubgrupoList = () => {
  useEffect(() => {
    setEditSubgrupo(null);
    if (!value) {
      setDataSource(subgrupos)
    }

  });
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [value, setValue] = useState(null);

  let { path } = useRouteMatch();
  let history = useHistory();
  const { subgrupos, setPermiso, softDeleteSubgrupo, setEditSubgrupo } = useContext(SubgrupoContext);
  const [rowState, setRowState] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const columns1 = [
    {
      title: "NOMBRE",
      dataIndex: "nombre",
      key: "nombre",
      sorter: {
        compare: (a, b) => a.nombre.localeCompare(b.nombre),
      },
      showSorterTooltip: false
    },

    {
      title: "DESCRIPCIÓN",
      dataIndex: "descripcion",
      key: "descripcion",
      className: "longText",
      sorter: {
        compare: (a, b) => a.descripcion.localeCompare(b.descripcion),
      },
      showSorterTooltip: false
    },
    {
      title: "ACCIONES",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <CrudButton
          record={record}
          typeTransaction={typeTransactionData}
          softDelete={softDeleteSubgrupo}
          setRowState={setRowState}
        />
      ),
    },
  ]

  //.................................................
  const columns2 = [
    {
      title: "NOMBRE",
      dataIndex: "nombre",
      key: "nombre",
      sorter: {
        compare: (a, b) => a.nombre.localeCompare(b.nombre),
      },
      showSorterTooltip: false
    },

    {
      title: "DESCRIPCIÓN",
      dataIndex: "descripcion",
      key: "descripcion",
      className: "longText",
      sorter: {
        compare: (a, b) => a.descripcion.localeCompare(b.descripcion),
      },
      showSorterTooltip: false
    },

  ]
  //.................................................

  const typeTransactionData = {
    tableNamePSQL: "subgrupo",
    byIdPSQL: true,
    byInternalCodePSQL: false,
    dependenciesPSQL: false,
    labelCrudPlural: "SUBGRUPO",
    labelCrudSingle: "SUBGRUPOS"
  };

  function ver(record) {
    setEditSubgrupo(null);
    record["permiso"] = false;
    //alert("ENTRA A LA FUNCION VER" + JSON.stringify(record));
    //setEditSubgrupo(record);
    history.push(`${path}/${record.id}/ver`, record);

  }

  const filtrar = (e) => {
    const currValue = e.target.value;
    setValue(currValue);
    // const filteredData = marcas.filter(entry => //-- Estaba antes de cambiar a nn
    const filteredData = subgrupos.filter((response) =>
      response.nombre.toLowerCase().includes(currValue.toLowerCase()) ||
      response.descripcion.toLowerCase().includes(currValue.toLowerCase())

    );
    setDataSource(filteredData);

  }

  function handleClick() {
    setPermiso(true);
    let record = {
      permiso: true,
      nuevo: true,
    };
    history.push(`${path}/nuevo`, record);
  }

  return (


    <div>


      <br />
      <Divider>SUBGRUPOS</Divider>
      <br />
 

      <>
        {JSON.parse(localStorage.getItem("user")).rol === 2 ?
          <Button type="primary" className="success" icon={<PlusOutlined />} onClick={handleClick}>Nuevo</Button>
          : null}

      </>
      <Search
        placeholder="Buscar Marca..."
        value={value}
        onChange={e => filtrar(e)}
        style={{ width: 200 }}
      />


      <br /><br />
      {subgrupos.length > 0 ?
        <Table
          dataSource={dataSource}
          columns={JSON.parse(localStorage.getItem("user")).rol === 2 ? columns1 : columns2}
          rowKey="id"
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                if (JSON.parse(localStorage.getItem("user")).rol === 2) {
                  if (event.clientX < window.innerWidth * 0.7 && rowState) {
                    console.log("hola")
                    // record["permiso"] = false;
                    // history.push(`${path}/${record.codigo_interno}/ver`, record);
                    ver(record);
                  }
                } else {
                  ver(record);
                }
              },
            };
          }}
        />
        : <Spin indicator={antIcon} />}

    </div>
  )
}
