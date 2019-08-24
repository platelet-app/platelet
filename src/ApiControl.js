function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject({ "status_code": response.status, "error": new Error(response.statusText), "response": response.json() })
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
            console.log('Request succeeded with JSON response', data);
            return data;
        }).catch(function (error) {
            console.log('Request failed', error);
            return data;
        });

}

class Vehicle {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.api_url = api_url;
    }

    async getVehicles(user_id) {
        return makeFetch(this.api_url, "vehicles/" + user_id, "GET", this.bearer)
    }

    async getVehicle(vehicle_id) {
        return makeFetch(this.api_url, "vehicle/" + vehicle_id, "GET", this.bearer)
    }

    async createVehicle(input_data) {
        return makeFetch(this.api_url,  "vehicles", "POST", this.bearer, "application/json", input_data)
    }
}

class Location {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.api_url = api_url;
    }

    async getLocations() {
        return makeFetch(this.api_url, "locations", "GET", this.bearer)
    }

    async getLocation(location_id) {
        return makeFetch(this.api_url, "location/" + location_id, "GET", this.bearer)
    }

    async createLocation(input_data) {
        return makeFetch(this.api_url, "locations", "POST", this.bearer, "application/json", input_data)
    }
}

class Note {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.api_url = api_url;
    }

    async getNotes(item_id) {
        return makeFetch(this.api_url, "notes/" + item_id, "GET", this.bearer)
    }

    async getNote(note_id) {
        return makeFetch(this.api_url, "note/" + note_id, "GET", this.bearer)
    }

    async createNote(input_data) {
        return makeFetch(this.api_url, "notes", "POST", this.bearer, "application/json", input_data)
    }
}

class Task {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.api_url = api_url;
    }

    async getTasks(session_id) {
        return makeFetch(this.api_url, "tasks" + session_id, "GET", this.bearer)
    }

    async getTask(task_id) {
        return makeFetch(this.api_url, "task/" + task_id, "GET", this.bearer)
    }

    async createTask(input_data) {
        return makeFetch(this.api_url, "tasks", "POST", this.bearer, "application/json", input_data)
    }

    async updateTask(task_id, input_data) {
        return makeFetch(this.api_url, "task/" + task_id, "PUT", this.bearer, "application/json", input_data)
    }
}

class Session {
    constructor(bearer, api_url) {
        this.bearer = bearer;
        this.users = undefined;
        this.api_url = api_url;
    }

    async getSessions(user_id) {
        return makeFetch(this.api_url, "sessions/" + user_id, "GET", this.bearer)
    }

    async getSession(session_id) {
        return makeFetch(this.api_url, "session/" + session_id, "GET", this.bearer)

    }

    async createSession(input_data) {
        if (input_data) {
            return makeFetch(this.api_url, "sessions", "POST", this.bearer, "application/json", input_data)
        }
        else  {
            return makeFetch(this.api_url, "sessions", "POST", this.bearer)
        }
    }

}

class User {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.users = undefined;
        this.api_url = api_url;
    }

    async getUsers() {
        return makeFetch(this.api_url, "users", "GET", this.bearer)
    }

    async getUser(user_id) {
        return makeFetch(this.api_url, "user/" + user_id, "GET", this.bearer)

    }

    async createUser(input_data) {
        return makeFetch(this.api_url, "users", "POST", this.bearer, "application/json", input_data)
    }

    async whoami() {
        return makeFetch(this.api_url, 'whoami', "GET", this.bearer)
    }
}

class Control {
    constructor(api_url, bearer = undefined) {
        this.login = this.login.bind(this);
        this.initialiseClasses = this.initialiseClasses.bind(this);
        this.logout = this.logout.bind(this);
        this.api_url = api_url;
        this.token = "";
        this.bearer = "";
        if (bearer) {
            this.initialiseClasses(bearer)
        } else {
            this.sessions = undefined;
            this.notes = undefined;
            this.tasks = undefined;
            this.vehicles = undefined;
            this.initialised = false;
            this.users = undefined;
        }
    }

    async login(username, password) {
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
                console.log("Login successful");
                this.token = data['access_token'];
                this.initialiseClasses(this.token)
            })
            .catch(function (error) {
                console.log("Request failed", error);
                throw error
            });
    }

    logout() {
        this.bearer = "";
        this.token = "";
        this.sessions = undefined;
        this.notes = undefined;
        this.tasks = undefined;
        this.vehicles = undefined;
        this.initialised = false;
        this.users = undefined;
    }

    initialiseClasses(token) {
        this.bearer = "Bearer " + token;
        this.users = new User(this.bearer, this.api_url);
        this.sessions = new Session(this.bearer, this.api_url);
        this.notes = new Note(this.bearer, this.api_url);
        this.tasks = new Task(this.bearer, this.api_url);
        this.vehicles = new Vehicle(this.bearer, this.api_url);
        this.locations = new Location(this.bearer, this.api_url);
        this.initialised = true;
    }
}

export default Control;