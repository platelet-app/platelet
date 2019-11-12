import {applyMiddleware, createStore} from "redux";
import rootReducer from "./reducers";
import rootSaga from "./sagas";
import createSagaMiddleware from "redux-saga"

const sagaMiddleWare = createSagaMiddleware();


const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleWare)
);
sagaMiddleWare.run(rootSaga);
export default store;
