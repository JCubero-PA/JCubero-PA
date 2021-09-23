import { call, put } from "redux-saga/effects";
import { productoResponse, setProducto, setProductos, setProductosByGrupo, setProductosByLinea, _setSerialModelo} from "../../../ducks/producto.duck";
import { createProducto, getAllProductos, getProducto, getProductosByLinea, softDeleteProducto, updateProducto,  getSerialModelo, getProductosByGrupo } from "../requests/producto.requests";

export function* handleGetProductos() {
  try {
    const response = yield call(getAllProductos);
    const { data } = response;
    yield put(setProductos(data));
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetProducto(action) {
    try {
      const response = yield call(getProducto, action.id);
      const { data } = response;
      yield put(setProducto(data));
    } catch (error) {
      console.log(error);
    }
}

export function* handleGetProductosByLinea(action) {
  try {
    console.log("ID!!!", action.id)

    const response = yield call(getProductosByLinea, {linea_id : action.id});
    const { data } = response;
    console.log("LA DATA", response)
    yield put(setProductosByLinea(data));
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetProductosByGrupo(action) {
  try {
    console.log("ID!!!", action.id)

    const response = yield call(getProductosByGrupo, {grupo_id : action.id});
    const { data } = response;
    console.log("LA DATA", response)
    yield put(setProductosByGrupo(data));
  } catch (error) {
    console.log(error);
  }
}

export function* handleAddProducto(action) {
  try {
    console.log("PRODUCTO!!!", action)

    const response = yield call(createProducto, action.producto);
    const { data } = response;
    console.log("LA DATA", data)
    yield put(productoResponse(data));
  } catch (error) {
    console.log(error);
  }
}


export function* handleEditProducto(action) {
  try {
    console.log("PRODUCTO!!!", action)

    const response = yield call(updateProducto, action.producto);
    const { data } = response;
    console.log("LA DATA", data)
    yield put(productoResponse(data));
  } catch (error) {
    console.log(error);
  }
}

export function* handleSoftDeleteProducto(action) {
  try {
    console.log("PRODUCTO ELIM!!!", action)

    const response = yield call(softDeleteProducto, action.producto);
    const { data } = response;
    console.log("LA DATA ELIM", data)
    yield put(productoResponse(data));
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetSerialModelo(action) {
  try {
    console.log("ENTRA")
    console.log("ID MODELO!!!", action)
    const response = yield call(getSerialModelo, action.id);
    const { data } = response;
    console.log("LA DATA SERIAL", data.data)
    yield put(_setSerialModelo(data.data));
  } catch (error) {
    console.log(error);
  }
}