import {applyMiddleware, createStore} from "redux";
import rootReducer from "./Reducers";
import rootSaga from "./RootSagas";
import createSagaMiddleware from "redux-saga"

const sagaOptions = {
    onErraor: (action, error) => {
        console.log("An uncaught exception has occurred in redux-saga:");
        console.log(action)
        console.log(error)
        if (error) {
            console.log(error.message)
        }
        throw error;
    }
}
const sagaMiddleWare = createSagaMiddleware(sagaOptions);


const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleWare)
);
sagaMiddleWare.run(rootSaga);
export default store;
