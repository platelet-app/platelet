import Control from "../ApiControl";
import {deleteLogin, getLogin} from "../utilities";

const apiUrl = 'http://localhost:5000/api/v0.1/';
let savedBearer = getLogin();
const api = new Control(apiUrl, savedBearer);
export default api;
