import { takeLatest } from "redux-saga/effects";
import { handleAddProducto, handleEditProducto, handleGetProducto, handleGetProductos, handleGetProductosByGrupo, handleGetProductosByLinea, handleGetSerialModelo, handleSoftDeleteProducto } from "../handlers/producto.handlers";
import { ADD_PRODUCTO, EDIT_PRODUCTO, GET_PRODUCTO, GET_PRODUCTOS, GET_PRODUCTOS_BY_GRUPO, GET_PRODUCTOS_BY_LINEA, GET_SERIAL_MODELO, SOFT_DELETE_PRODUCTO } from "../../../ducks/producto.duck";

export function* saga() {
  yield takeLatest(GET_PRODUCTOS, handleGetProductos);
}

export function* saga2() {
    yield takeLatest(GET_PRODUCTO, handleGetProducto);
}

export function* saga3() {
    yield takeLatest(GET_PRODUCTOS_BY_LINEA, handleGetProductosByLinea);
}

export function* saga4() {
    yield takeLatest(ADD_PRODUCTO, handleAddProducto);
}

export function* saga5() {
    yield takeLatest(EDIT_PRODUCTO, handleEditProducto);
}

export function* saga6() {
    yield takeLatest(SOFT_DELETE_PRODUCTO, handleSoftDeleteProducto);
}

export function* saga7() {
    yield takeLatest(GET_SERIAL_MODELO, handleGetSerialModelo);
}

export function* saga8() {
    yield takeLatest(GET_PRODUCTOS_BY_GRUPO, handleGetProductosByGrupo);
}