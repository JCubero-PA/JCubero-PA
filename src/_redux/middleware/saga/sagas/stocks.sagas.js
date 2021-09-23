import { takeLatest } from "redux-saga/effects";
import { GET_SUBGRUPOS, GET_GRUPOS_LINEA_BY_SUBGRUPO, GET_LINEAS } from "../../../ducks/stocks.duck";
import { handleGetSubgrupos, handleGetGruposLineaBySubgrupo } from "../handlers/stocks.handlers";

export function* saga() {
  yield takeLatest(GET_SUBGRUPOS, handleGetSubgrupos);
}

export function* saga2() {
  yield takeLatest(GET_GRUPOS_LINEA_BY_SUBGRUPO, handleGetGruposLineaBySubgrupo);
}

export function* saga3() {
  yield takeLatest(GET_LINEAS, handleGetGruposLineaBySubgrupo);
}
