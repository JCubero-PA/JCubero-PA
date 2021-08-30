import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd'
import React, { useState } from 'react'
import { ProductoService } from '../../../services/productoService';

const QueryButton = (props) => {

    const {setClick} = props
    console.log(props.record);
    const [stock, setStock] = useState("CONSULTAR")
    const [isLoading, setIsLoading] = useState(false)
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
        stock === "CONSULTAR" && !isLoading  ?
        <Button icon={<SearchOutlined />} onClick={() => {  setIsLoading(true); new ProductoService().getStock(props.record.codigo_temporal ? props.record.codigo_temporal : 'N/A').then(data => {setStock(data); setIsLoading(false)}) }}>
            {stock}
        </Button> : isLoading ?  <Spin indicator={antIcon} /> : <p>{stock.cantidad_stock}</p>
    )
}

export default QueryButton
