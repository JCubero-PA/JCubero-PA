import { combineReducers, createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import productoReducer from "./ducks/producto.duck";
import { saga, saga2, saga3, saga4, saga5, saga6, saga7 } from "./middleware/saga/sagas/producto.sagas";
import { composeWithDevTools } from 'redux-devtools-extension';
import { initSagas } from "./middleware/saga";

const reducer = combineReducers({
  
  productos: productoReducer
});

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];

const store = createStore(reducer, {}, composeWithDevTools(applyMiddleware(...middleware)));


initSagas(sagaMiddleware)
// sagaMiddleware.run(saga);
// sagaMiddleware.run(saga2);
// sagaMiddleware.run(saga3);
// sagaMiddleware.run(saga4);
// sagaMiddleware.run(saga5);
// sagaMiddleware.run(saga6);
// sagaMiddleware.run(saga7);

export default store;
