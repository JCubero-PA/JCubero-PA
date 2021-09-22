import { combineReducers, createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import productoReducer from "./ducks/producto.duck";
import stocksReducer from "./ducks/stocks.duck";
import { watcherSaga, watcherSaga2, watcherSaga3, watcherSaga4, watcherSaga5, watcherSaga6, watcherSaga7 } from "./middleware/saga/sagas/producto.sagas";
import { composeWithDevTools } from 'redux-devtools-extension';
import { initSagas } from "./middleware/saga";

// Archivo raíz para el REDUX SAGAS

// Aquí se combina todos los reducers
const reducer = combineReducers({
  productos: productoReducer,
  stocks: stocksReducer
});

// Aquí se instancia el middleware
const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];

// Aquí se crea el store de toda la aplicación y se usa 'composeWithDevTools' para monitorear el estado con la extensión de CHROME
const store = createStore(reducer, {}, composeWithDevTools(applyMiddleware(...middleware)));

// Registramos las sagas
initSagas(sagaMiddleware)
// sagaMiddleware.run(watcherSaga);
// sagaMiddleware.run(watcherSaga2);
// sagaMiddleware.run(watcherSaga3);
// sagaMiddleware.run(watcherSaga4);
// sagaMiddleware.run(watcherSaga5);
// sagaMiddleware.run(watcherSaga6);
// sagaMiddleware.run(watcherSaga7);

export default store;
