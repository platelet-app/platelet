import Control from "../ApiControl";
import {deleteLogin, getLogin} from "../utilities";
import {getState} from "redux"

const apiUrl = 'http://localhost:5000/api/v0.1/';
let savedBearer = getLogin();

export const getApiControl = (state) => state.apiControl;
export const getWhoami = (state) => state.whoami;
