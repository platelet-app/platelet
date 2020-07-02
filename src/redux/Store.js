import {applyMiddleware, createStore} from "redux";
import rootReducer from "./Reducers";
import rootSaga from "./RootSagas";
import createSagaMiddleware from "redux-saga"
import {createSubscribeSocketMiddleware} from "./sockets/SubscribeSocketMiddleware";

const sagaOptions = {
    onErraor: (action, error) => {
        console.log("An uncaught exception has occurred in redux-saga:");
        console.log(action)
        if (error) {
            console.log(error.message)
        }
        throw error;
    }
}
const sagaMiddleWare = createSagaMiddleware(sagaOptions);
const subscribeSocketMiddleware = createSubscribeSocketMiddleware();


const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleWare, subscribeSocketMiddleware)
);
sagaMiddleWare.run(rootSaga);
export default store;
