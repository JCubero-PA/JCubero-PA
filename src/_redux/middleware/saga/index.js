import * as watcher from './sagas/producto.sagas';
import * as watcher2 from './sagas/stocks.sagas';
export function initSagas(sagaMiddleware) {
  Object.values(watcher).forEach(sagaMiddleware.run.bind(sagaMiddleware));
  Object.values(watcher2).forEach(sagaMiddleware.run.bind(sagaMiddleware));
 
}