import {applyMiddleware, createStore} from "redux";
import rootReducer from "./Reducers";
import rootSaga from "./RootSagas";
import createSagaMiddleware from "redux-saga"
import {
    createSubscribeAssignmentsSocketMiddleware,
    createSubscribeCommentsSocketMiddleware,
    createSubscribeSocketMiddleware
} from "./sockets/SubscribeSocketMiddleware";

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
const subscribeCommentsSocketMiddleware = createSubscribeCommentsSocketMiddleware();
const subscribeAssignmentsSocketMiddleware = createSubscribeAssignmentsSocketMiddleware();

let store;

if (process.env.REACT_APP_DISABLE_SOCKETS === "true") {
    store = createStore(
        rootReducer,
        applyMiddleware(sagaMiddleWare)
    );

} else {
    store = createStore(
        rootReducer,
        applyMiddleware(sagaMiddleWare, subscribeSocketMiddleware, subscribeCommentsSocketMiddleware, subscribeAssignmentsSocketMiddleware)
    );
}

sagaMiddleWare.run(rootSaga);
export default store;
