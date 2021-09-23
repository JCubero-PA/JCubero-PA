//TYPES ACTION
export const GET_PRODUCTOS = "GET_PRODUCTOS";
export const SET_PRODUCTOS = "SET_PRODUCTOS";
export const GET_PRODUCTO = "GET_PRODUCTO";
export const SET_PRODUCTO = "SET_PRODUCTO";
export const GET_PRODUCTOS_BY_LINEA = "GET_PRODUCTOS_BY_LINEA";
export const SET_PRODUCTOS_BY_LINEA = "SET_PRODUCTOS_BY_LINEA";
export const GET_PRODUCTOS_BY_GRUPO = "GET_PRODUCTOS_BY_GRUPO";
export const SET_PRODUCTOS_BY_GRUPO = "SET_PRODUCTOS_BY_GRUPO";
export const ADD_PRODUCTO = "ADD_PRODUCTO";
export const EDIT_PRODUCTO = "EDIT_PRODUCTO";
export const GET_SERIAL_MODELO = "GET_SERIAL_MODELO";
export const SET_SERIAL_MODELO = "SET_SERIAL_MODELO";
export const SOFT_DELETE_PRODUCTO = "SOFT_DELETE_PRODUCTO";
export const PRODUCTO_RESPONSE = "PRODUCTO_RESPONSE";

//ACTIONS
export const getProductos = () => ({
  type: GET_PRODUCTOS,
  loading: true
});

export const getProductosByLinea = (id) => ({
  type: GET_PRODUCTOS_BY_LINEA,
  id
});

export const getProductosByGrupo = (id) => ({
  type: GET_PRODUCTOS_BY_GRUPO,
  id
});

export const setProductos = (productos) => ({
  type: SET_PRODUCTOS,
  productos,
  loading: false
});

export const setProductosByLinea = (productos) => ({
  type: SET_PRODUCTOS_BY_LINEA,
  productos,
});

export const setProductosByGrupo = (productos) => ({
  type: SET_PRODUCTOS_BY_GRUPO,
  productos,
});

export const getProducto = (id) => ({
  type: GET_PRODUCTO,
  id
});

export const _getSerialModelo = (id) => ({
  type: GET_SERIAL_MODELO,
  id
});

export const _setSerialModelo = (serial) => ({
  type: SET_SERIAL_MODELO,
  serial
});

export const setProducto = (producto) => ({
  type: SET_PRODUCTO,
  producto,
});

export const addProducto = (producto) => ({
  type: ADD_PRODUCTO,
  producto,
});

export const productoResponse = (response) => ({
  type: PRODUCTO_RESPONSE,
  response,
});


export const _editProducto = (producto) => ({
  type: EDIT_PRODUCTO,
  producto,
});

export const _softDeleteProducto = (producto) => ({
  type: SOFT_DELETE_PRODUCTO,
  producto,
});



//REDUCER
const initialState = []

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  const { productos, producto, response, serial } = action;
  switch (action.type) {
    case SET_PRODUCTOS:
    case SET_PRODUCTOS_BY_LINEA:
    case SET_PRODUCTOS_BY_GRUPO:
      return { ...state, productos:productos.data, producto:null, response:null, loading: false };
    case SET_PRODUCTO:
      return {...state, producto: producto.data[0]?producto.data[0]:undefined};
    case SET_SERIAL_MODELO:
      return {...state, serial: serial};
    case GET_SERIAL_MODELO:
      return {...state, serial: null};
    case PRODUCTO_RESPONSE:
      return {...state, response: response, loading:false};
     case SOFT_DELETE_PRODUCTO:
      return {...state, productos: state.productos.filter((entry) => entry.id !== producto.id )};
    default:
      return {...state, loading: true };
  }
};
