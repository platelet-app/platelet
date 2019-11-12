import {applyMiddleware, createStore} from "redux";
import rootReducer from "./Reducers";
import rootSaga from "./RootSagas";
import createSagaMiddleware from "redux-saga"

const sagaMiddleWare = createSagaMiddleware();


const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleWare)
);
sagaMiddleWare.run(rootSaga);
export default store;
