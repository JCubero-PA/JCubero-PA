export const GET_SUBGRUPOS = "GET_SUBGRUPOS";
export const SET_SUBGRUPOS = "SET_SUBGRUPOS";
export const GET_GRUPOS_LINEA_BY_SUBGRUPO = "GET_GRUPOS_LINEA_BY_SUBGRUPO";
export const SET_GRUPOS_LINEA_BY_SUBGRUPO = "SET_GRUPOS_LINEA_BY_SUBGRUPO";
export const GET_LINEAS = "GET_LINEAS";
export const SET_LINEAS = "SET_LINEAS";
export const GET_GRUPOS = "GET_GRUPOS";
export const SET_GRUPOS = "SET_GRUPOS";
export const GET_MARCAS = "GET_MARCAS";
export const SET_MARCAS = "SET_MARCAS";

export const getSubgrupos = () => ({
    type: GET_SUBGRUPOS,
    loading: true
});

export const getLineas = () => ({
    type: GET_LINEAS,
    loading: true
});


export const setSubgrupos = (subgrupos) => ({
    type: SET_SUBGRUPOS,
    subgrupos,
    loading: false
});

export const setLineas = (lineas) => ({
    type: SET_LINEAS,
    lineas,
    loading: false
});


export const getGruposLineaBySubgrupo = (id) => ({
    type: GET_GRUPOS_LINEA_BY_SUBGRUPO,
    loading: true,
    id
});


export const setGruposLineaBySubgrupo = (grupos) => ({
    type: SET_GRUPOS_LINEA_BY_SUBGRUPO,
    grupos,
    loading: false
});

const initialState = []

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  const { subgrupos, grupos, lineas } = action;
  switch (action.type) {
    case SET_SUBGRUPOS:
      return { ...state, subgrupos:subgrupos.data, loading: false };
    case SET_LINEAS:
      return { ...state, lineas:lineas.data, loading: false };
    case SET_GRUPOS_LINEA_BY_SUBGRUPO:
      return { ...state, grupos:grupos.data, loading: false };
    default:
      return {...state, loading: true };
  }
};