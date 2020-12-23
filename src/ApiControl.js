import { store } from 'react-notifications-component';
import axios from 'axios'
import {saveLogin, deleteApiURL, getTabIdentifier, createTabIdentifier, getApiURL} from "./utilities";



function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        if(response.status > 400 || response.status < 500) {
            return Promise.reject({ "status_code": response.status, "error": new Error(response.statusText), "response": response.json() })
        }
    }
}

function json(response) {
    return response.json()
}

function makeFetch(api_url, url, type, auth, content_type = undefined, data = undefined) {
    return fetch(api_url + url, {
        method: type,
        withCredentials: true,
        credentials: 'include',
        headers: new Headers({
            'Authorization': auth,
            'Content-type': content_type ? content_type :  "text/html",
            "Access-Control-Allow-Credentials": true
        }),
        body: data ? JSON.stringify(data) : undefined
    }

    )
        .then(status)
        .then(json)
        .then((data) => {
            //console.log('Request succeeded with JSON response', data);
            return data;
        }).catch(function (error) {
            console.log('Request failed', error);
            store.addNotification({
                title: "An error has occurred.",
                //TODO: proper error messages from the api
                message: "For some reason.",
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 10000,
                    onScreen: true
                }
            });
            throw error;
        });

}

class HttpError extends Error {
    constructor(message, response) {
        super(message);
        this.name = "HttpError";
        this.status = response.status;
        this.statusText = response.statusText;
        this.message = response.data.message;
        this.response = response;
    }
}

function makeAxios(api_url, url, type, auth, content_type = undefined, data = {}) {
    const config = {
        method: type,
        url: api_url + url,
        headers: {
            'Content-type': content_type ? content_type : "text/html",
            "Access-Control-Allow-Credentials": true,
            "Tab-Identification": getTabIdentifier()
        },
        data: data,
    }
    return axios(config)
        .then((response) => {
            //console.log('Request succeeded with JSON response', response);
            if (response)
                return response.data;
        }).catch(function (error) {
            console.log('Request failed', error.response);
            if (error.response) {
                throw new HttpError("An HTTP exception has occurred.", error.response)
            }
            throw error;
        });


}

class Vehicle {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.api_url = api_url;
    }

    async getVehicles(user_id) {
        return makeAxios(this.api_url, "vehicles", "GET", this.bearer)
    }

    async getVehicle(vehicle_id) {
        return makeAxios(this.api_url, "vehicle/" + vehicle_id, "GET", this.bearer)
    }

    async createVehicle(input_data) {
        return makeAxios(this.api_url,  "vehicles", "POST", this.bearer, "application/json", input_data)
    }

    async updateVehicle(vehicle_id, input_data) {
        return makeAxios(this.api_url, "vehicle/" + vehicle_id, "PATCH", this.bearer, "application/json", input_data)
    }

    async putVehicle(vehicle_id, input_data) {
        return makeAxios(this.api_url, "vehicle/" + vehicle_id, "PUT", this.bearer, "application/json", input_data)
    }

    async deleteVehicle(vehicle_id) {
        return makeAxios(this.api_url, "vehicle/" + vehicle_id, "DELETE", this.bearer, "application/json")
    }

    async restoreVehicle(vehicle_id) {
        return makeAxios(this.api_url, "vehicle/" + vehicle_id + "/restore", "PUT", this.bearer, "application/json")
    }
}

class Location {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.api_url = api_url;
        this.availableLocations = [];
        /*makeAxios(this.api_url, "locations", "GET", this.bearer)
            .then((data) => {
                this.availableLocations = data;
            });*/
    }

    async getAvailableLocations() {
        return makeAxios(this.api_url, "locations", "GET", this.bearer);
    }

    async getLocation(location_id) {
        return makeAxios(this.api_url, "location/" + location_id, "GET", this.bearer)
    }

    async createLocation(input_data) {
        return makeAxios(this.api_url, "locations", "POST", this.bearer, "application/json", input_data)
    }
}

class Comment {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.api_url = api_url;
    }

    async getComments(item_id) {
        return makeAxios(this.api_url, "comments/" + item_id, "GET", this.bearer)
    }

    async getComment(comment_id) {
        return makeAxios(this.api_url, "comment/" + comment_id, "GET", this.bearer)
    }

    async createComment(input_data) {
        return makeAxios(this.api_url, "comments", "POST", this.bearer, "application/json", input_data)
    }

    async updateComment(comment_id, input_data) {
        return makeAxios(this.api_url, "comment/" + comment_id, "PATCH", this.bearer, "application/json", input_data)
    }

    async putComment(comment_id, input_data) {
        return makeAxios(this.api_url, "comment/" + comment_id, "PUT", this.bearer, "application/json", input_data)
    }

    async deleteComment(comment_id) {
        return makeAxios(this.api_url, "comment/" + comment_id, "DELETE", this.bearer, "application/json")
    }

    async restoreComment(comment_id) {
        return makeAxios(this.api_url, "comment/" + comment_id + "/restore", "PUT", this.bearer, "application/json")
    }
}

class Task {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.api_url = api_url;
    }

    async getTasks(user_id, page, role, status, before_parent, order="descending") {
        //const afterEncoded = encodeURIComponent(after);
        return makeAxios(this.api_url,`tasks/${user_id}?page=${(page || "0")}&role=${role || ""}&status=${status || ""}&before_parent=${(before_parent || "")}&order=${order}`, "GET", this.bearer)
    }

    async getTask(task_id) {
        return makeAxios(this.api_url, "task/" + task_id, "GET", this.bearer)
    }

    async createTask(input_data) {
        return makeAxios(this.api_url, "tasks", "POST", this.bearer, "application/json", input_data)
    }

    async updateTask(task_id, input_data) {
        return makeAxios(this.api_url, "task/" + task_id, "PATCH", this.bearer, "application/json", input_data)
    }

    async putTask(task_id, input_data) {
        return makeAxios(this.api_url, "task/" + task_id, "PUT", this.bearer, "application/json", input_data)
    }

    async getTaskAssignees(task_id) {
        return makeAxios(this.api_url, "task/" + task_id + "/assigned_users", "GET", this.bearer, "application/json")
    }

    async getTaskAssignedRiders(task_id) {
        return makeAxios(this.api_url, "task/" + task_id + "/assigned_users?role=rider", "GET", this.bearer, "application/json")
    }

    async getTaskAssignedCoordinators(task_id) {
        return makeAxios(this.api_url, "task/" + task_id + "/assigned_users?role=coordinator", "GET", this.bearer, "application/json")
    }

    async addTaskAssignedRider(task_id, input_data) {
        return makeAxios(this.api_url, "task/" + task_id + "/assigned_users?role=rider", "PUT", this.bearer, "application/json", input_data)
    }

    async addTaskAssignedCoordinator(task_id, input_data) {
        return makeAxios(this.api_url, "task/" + task_id + "/assigned_users?role=coordinator", "PUT", this.bearer, "application/json", input_data)
    }

    async removeTaskAssignedRider(task_id, input_data) {
        return makeAxios(this.api_url, "task/" + task_id + "/assigned_users?role=rider", "DELETE", this.bearer, "application/json", input_data)
    }

    async removeTaskAssignedCoordinator(task_id, input_data) {
        return makeAxios(this.api_url, "task/" + task_id + "/assigned_users?role=coordinator", "DELETE", this.bearer, "application/json", input_data)
    }

    async deleteTask(task_id) {
        return makeAxios(this.api_url, "task/" + task_id, "DELETE", this.bearer, "application/json")
    }

    async restoreTask(task_id) {
        return makeAxios(this.api_url, "task/" + task_id + "/restore", "PUT", this.bearer, "application/json")
    }
}

class Deliverable {
    constructor(bearer, api_url) {
        this.bearer = bearer;
        this.api_url = api_url;
    }

    async getDeliverables(task_id) {
        return makeAxios(this.api_url, "deliverables/" + task_id, "GET", this.bearer)
    }

    async getDeliverable(deliverable_id) {
        return makeAxios(this.api_url, "deliverable/" + deliverable_id, "GET", this.bearer)
    }

    async createDeliverable(input_data) {
        return makeAxios(this.api_url, "deliverables", "POST", this.bearer, "application/json", input_data)
    }

    async updateDeliverable(deliverable_id, input_data) {
        return makeAxios(this.api_url, "deliverable/" + deliverable_id, "PATCH", this.bearer, "application/json", input_data)
    }

    async putDeliverable(deliverable_id, input_data) {
        return makeAxios(this.api_url, "deliverable/" + deliverable_id, "PUT", this.bearer, "application/json", input_data)
    }

    async deleteDeliverable(deliverable_id) {
        return makeAxios(this.api_url, "deliverable/" + deliverable_id, "DELETE", this.bearer, "application/json")
    }

    async restoreDeliverable(deliverable_id) {
        //not implemented yet
        return;
        return makeAxios(this.api_url, "deliverable/" + deliverable_id + "/restore", "PUT", this.bearer, "application/json")
    }

    async getAvailableDeliverables() {
        return makeAxios(this.api_url, "deliverables/available", "GET", this.bearer, "application/json");
    }
}


class Priority {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.api_url = api_url;
    }

    async getAvailablePriorities() {
        return makeAxios(this.api_url, "priorities", "GET", this.bearer);
    }
}

class Patch {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.api_url = api_url;
    }

    async getAvailablePatches() {
        return makeAxios(this.api_url, "patches", "GET", this.bearer);
    }
}


class Log {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.api_url = api_url;
    }

    async getRecords(object_id, order="newest") {
        return makeAxios(this.api_url, "logs/" + object_id + "?order=" + order, "GET", this.bearer);
    }

    async getTasksRecords(user_uuid, order="newest") {
        return makeAxios(this.api_url, "logs/" + user_uuid + "/user_tasks_log_record?order=" + order + "&return=others_only", "GET", this.bearer);
    }
}


class User {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.users = [];
        this.api_url = api_url;
    }

    async getUsers() {
        return makeAxios(this.api_url, "users", "GET", this.bearer);
    }

    async getUser(user_id) {
        return makeAxios(this.api_url, "user/" + user_id, "GET", this.bearer)

    }

    async createUser(input_data) {
        return makeAxios(this.api_url, "users", "POST", this.bearer, "application/json", input_data)
    }

    async updateUser(user_id, input_data) {
        return makeAxios(this.api_url, "user/" + user_id, "PATCH", this.bearer, "application/json", input_data)
    }

    async putUser(user_id, input_data) {
        return makeAxios(this.api_url, "user/" + user_id, "PUT", this.bearer, "application/json", input_data)
    }

    //async uploadProfilePicture(user_id, image_data, crop_dimensions) {
    //    let bodyFormData = new FormData();
    //    bodyFormData.append('file', image_data)
    //    bodyFormData.append('crop_dimensions', crop_dimensions)
    //    return makeAxios(this.api_url, "user/" + user_id + "profile_picture", "POST", this.bearer, "multipart/form-data", bodyFormData)
    //}
    async uploadProfilePicture(user_id, input_data) {
        return makeAxios(this.api_url, "user/" + user_id + "/profile_picture", "PUT", this.bearer, "application/json", input_data)
    }

    async deleteUser(user_id) {
        return makeAxios(this.api_url, "user/" + user_id, "DELETE", this.bearer, "application/json")
    }

    async restoreUser(user_id) {
        return makeAxios(this.api_url, "user/" + user_id + "/restore", "PUT", this.bearer, "application/json")
    }

    async getAssignedTasks(user_id) {
        return makeAxios(this.api_url, "user/" + user_id + '/tasks', "GET", this.bearer)
    }

    async whoami() {
        return makeAxios(this.api_url, 'whoami', "GET", this.bearer)
    }
}

class Statistics {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.users = [];
        this.api_url = api_url;
    }

    async getUserStatistics(userUUID, startDateTime, endDateTime, role="coordinator") {
        return makeAxios(
            this.api_url,
            `statistics/${userUUID}?role=${role}&start_date_time=${startDateTime}&end_date_time=${endDateTime}`,
            "GET",
            this.bearer);
    }
}

class Control {
    constructor(api_url = "", bearer = "") {
        this.isAlreadyFetchingAccessToken = false;

        // This is the list of waiting requests that will retry after the JWT refresh complete
        this.subscribers = [];
        this.login = this.login.bind(this);
        this.initialiseClasses = this.initialiseClasses.bind(this);
        this.logout = this.logout.bind(this);
        this.ping = this.ping.bind(this);
        this.notifyDown = this.notifyDown.bind(this);
        this.notifyUp = this.notifyUp.bind(this);
        this.ping = this.ping.bind(this);
        //TODO: get this from server settings once implemented (api version)
        this.setApiURL(api_url);
        this.bearer = "";
        this.connected = true;
        this.connectionReattempts = 0;
        createTabIdentifier();

        if (bearer && api_url) {
            this.initialiseClasses(bearer)
        } else {
            this.comments = undefined;
            this.tasks = undefined;
            this.vehicles = undefined;
            this.initialised = false;
            this.users = undefined;
        }
    }

    async login(username, password) {
        if (!this.api_url)
            //TODO: throw proper error
            throw new Error("No api url is defined")
        return fetch(this.api_url + 'login', {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: 'username=' + username + '&password=' + password
        })
    .then(status)
            .then(json)
            .then((data) => {
                //console.log('Request succeeded with JSON response', data);
                return data;
            }).catch(function (error) {
                throw error;
            });
    }

    deleteApiURL() {
        this.api_url = "";
        this.logout();
    }

    async refreshToken() {
        return makeAxios(this.api_url, "login/refresh_token", "GET", this.bearer, "application/json")
    }

    setApiURL(url) {
        if (!url)
            return url;
        //url = url.endsWith("/") ? url + "api/v0.1/" : url + "/api/v0.1/";
        if (!url.startsWith("https://")) {
            if (url.startsWith("http://")) {
                const cut = url.substring("http://".length)
                url = url.includes("localhost") ? "http://" + cut : "https://" + cut
            } else {
                url = url.includes("localhost") ? "http://" + url : "https://" + url;
            }
        }
        this.api_url = url;
    }

    getServerSettings() {
        const self = this;
        if (!this.api_url) {
            return new Promise((resolve, reject) => {
                throw new Error("Can't get server settings without an API URL.")
            })
        } else {
            return axios.get(this.api_url + "server_settings")
                .then((data) => {
                    //console.log('Request succeeded with JSON response', data);
                    if (data)
                        return data;
                }).catch(function (error) {
                    console.log('Request failed', error.response);
                    self.api_url = "";
                    deleteApiURL();
                    throw error;
                });

        }
    }

    ping() {
        let self = this;
        return fetch(this.api_url + 'ping', {
            method: 'get',
        })
            .then((response) => {
                if (response.status === 200) {
                    if (!this.connected) {
                        this.notifyUp();
                        this.connected = true;
                        this.connectionReattempts = 0;

                    }
                }
                else {
                    if (this.connected) {
                        this.connectionReattempts = 0;
                        this.connected = false;
                        this.notifyDown();
                    }
                    else {
                        if (this.connectionReattempts === 10) {
                            this.notifyDown();
                            this.connectionReattempts = 0;
                        }
                    }
                    this.connectionReattempts += 1;
                }
            })
            .catch(function (error) {
                if (self.connected) {
                    self.connectionReattempts = 0;
                    self.connected = false;
                    self.notifyDown();
                }
                else {
                    if (self.connectionReattempts === 10) {
                        self.notifyDown();
                        self.connectionReattempts = 0;
                    }
                }
                self.connectionReattempts += 1;
                console.log("Request failed", error);
            });
    }

    notifyDown() {
        store.addNotification({
            title: "Connection to the server has been lost.",
            message: "Check your internet connection.",
            type: "warning",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 10000,
                onScreen: true
            }
        });

    }

    notifyUp() {
        store.addNotification({
            title: "Connection status.",
            message: "Connection has returned.",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 10000,
                onScreen: true
            }
        });
    }

    logout() {
        this.bearer = "";
        this.token = "";
        this.users = undefined;
        this.comments = undefined;
        this.tasks = undefined;
        this.deliverables = undefined;
        this.vehicles = undefined;
        this.locations = undefined;
        this.priorities = undefined;
        this.patches = undefined;
        this.initialised = false;
        this.log = false;
        this.statistics = false;
    }

    initialiseClasses(token) {
        this.token = token;
        this.bearer = "Bearer " + token;
        axios.defaults.headers.common['Authorization'] = this.bearer
        this.users = new User(this.bearer, this.api_url);
        this.comments = new Comment(this.bearer, this.api_url);
        this.tasks = new Task(this.bearer, this.api_url);
        this.deliverables = new Deliverable(this.bearer, this.api_url);
        this.vehicles = new Vehicle(this.bearer, this.api_url);
        this.locations = new Location(this.bearer, this.api_url);
        this.priorities = new Priority(this.bearer, this.api_url);
        this.patches = new Patch(this.bearer, this.api_url);
        this.log = new Log(this.bearer, this.api_url);
        this.statistics = new Statistics(this.bearer, this.api_url);
        this.initialised = true;
        const self = this;
        //TODO: This doesn't work if the token has expired fully fixxxxx
        axios.interceptors.response.use(
            function(response) {
                // If the request succeeds, we don't have to do anything and just return the response
                return response
            },
            function(error) {
                const errorResponse = error.response
                if (isTokenExpiredError(errorResponse)) {
                    return self.resetTokenAndReattemptRequest(error)
                }
                // If the error is due to other reasons, we just throw it back to axios
                return Promise.reject(error)
            }
        )
        function isTokenExpiredError(errorResponse) {
            throw errorResponse
            // Your own logic to determine if the error is due to JWT token expired returns a boolean value
        }

        //setInterval(this.ping, 4000);
    }


    async resetTokenAndReattemptRequest(error) {
        try {
            const { response: errorResponse } = error;
            const resetToken = await this.refreshToken(); // Your own mechanism to get the refresh token to refresh the JWT token
            if (!resetToken) {
                // We can't refresh, throw the error anyway
                return Promise.reject(error);
            }
            /* Proceed to the token refresh procedure
            We create a new Promise that will retry the request,
            clone all the request configuration from the failed
            request in the error object. */
            const retryOriginalRequest = new Promise(resolve => {
                /* We need to add the request retry to the queue
                since there another request that already attempt to
                refresh the token */
                this.addSubscriber(access_token => {
                    errorResponse.config.headers.Authorization = 'Bearer ' + access_token;
                    resolve(axios(errorResponse.config));
                });
            });
            if (!this.isAlreadyFetchingAccessToken) {
                this.isAlreadyFetchingAccessToken = true;
                const response = await axios({
                    method: 'post',
                    url: `<YOUR TOKEN REFREH ENDPOINT>`,
                    data: {
                        token: resetToken // Just an example, your case may vary
                    }
                });
                if (!response.data) {
                    return Promise.reject(error);
                }
                const newToken = response.data.token;
                saveLogin(newToken); // save the newly refreshed token for other requests to use
                this.isAlreadyFetchingAccessToken = false;
                this.onAccessTokenFetched(newToken);
            }
            return retryOriginalRequest;
        } catch (err) {
            return Promise.reject(err);
        }
    }

    onAccessTokenFetched(access_token) {
        // When the refresh is successful, we start retrying the requests one by one and empty the queue
        this.subscribers.forEach(callback => callback(access_token));
        this.subscribers = [];
    }

    addSubscriber(callback) {
        this.subscribers.push(callback);
    }
}


export default Control;
