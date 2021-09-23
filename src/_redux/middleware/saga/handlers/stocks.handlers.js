import { call, put } from "redux-saga/effects";
import { setGruposLineaBySubgrupo, setLineas, setSubgrupos } from "../../../ducks/stocks.duck";
import { getAllSubgrupos, getGruposLineaBySubgrupo, getLineasStock } from "../requests/stocks.requests";

export function* handleGetSubgrupos() {
  try {
    const response = yield call(getAllSubgrupos);
    const { data } = response;
    yield put(setSubgrupos(data));
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetGruposLineaBySubgrupo(action) {
  try {
    const response = yield call(getGruposLineaBySubgrupo, action.id);
    const { data } = response;
    yield put(setGruposLineaBySubgrupo(data));
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetLineas() {
  try {
    const response = yield call(getLineasStock);
    const { data } = response;
    console.log("LA DATA", data)
    yield put(setLineas(data));
  } catch (error) {
    console.log(error);
  }
}