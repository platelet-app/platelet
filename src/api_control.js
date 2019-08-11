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

function make_fetch(api_url, url, type, auth, content_type = undefined, data = undefined) {
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
    })
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

    async get_vehicles(user_id) {
        return make_fetch(this.api_url, "vehicles/" + user_id, "GET", this.bearer)
    }

    async get_vehicle(vehicle_id) {
        return make_fetch(this.api_url, "vehicle/" + vehicle_id, "GET", this.bearer)
    }

    async create_vehicle(input_data) {
        return make_fetch(this.api_url,  "vehicles", "POST", this.bearer, "application/json", input_data)
    }
}

class Location {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.api_url = api_url;
    }

    async get_locations(function_to_call = undefined) {
        return make_fetch(this.api_url, "locations", "GET", this.bearer)
    }

    async get_location(location_id) {
        return make_fetch(this.api_url, "location/" + location_id, "GET", this.bearer)
    }

    async create_location(input_data) {
        return make_fetch(this.api_url, "locations", "POST", this.bearer, "application/json", input_data)
    }
}

class Note {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.api_url = api_url;
    }

    async get_notes(item_id) {
        return make_fetch(this.api_url, "notes/" + item_id, "GET", this.bearer)
    }

    async get_note(note_id) {
        return make_fetch(this.api_url, "note/" + note_id, "GET", this.bearer)
    }

    async create_note(input_data) {
        return make_fetch(this.api_url, "notes", "POST", this.bearer, "application/json", input_data)
    }
}

class Task {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.api_url = api_url;
    }

    async get_tasks(session_id) {
        return make_fetch(this.api_url, "tasks" + session_id, "GET", this.bearer)
    }

    async get_task(task_id) {
        return make_fetch(this.api_url, "task/" + task_id, "GET", this.bearer)
    }

    async create_task(input_data) {
        return make_fetch(this.api_url, "tasks", "POST", this.bearer, "application/json", input_data)
    }
}

class Session {
    constructor(bearer, api_url) {
        this.bearer = bearer;
        this.users = undefined;
        this.api_url = api_url;
    }

    async get_sessions(user_id) {
        return make_fetch(this.api_url, "sessions/" + user_id, "GET", this.bearer)
    }

    async get_session(session_id) {
        return make_fetch(this.api_url, "session/" + session_id, "GET", this.bearer)

    }

    async create_session(input_data) {
        if (input_data) {
            return make_fetch(this.api_url, "sessions", "POST", this.bearer, "application/json", input_data)
        }
        else  {
            return make_fetch(this.api_url, "sessions", "POST", this.bearer)
        }
    }

}

class User {
    constructor(bearer, api_url){
        this.bearer = bearer;
        this.users = undefined;
        this.api_url = api_url;
    }

    async get_users() {
        return make_fetch(this.api_url, "users", "GET", this.bearer)
    }

    async get_user(user_id) {
        return make_fetch(this.api_url, "user/" + user_id, "GET", this.bearer)

    }

    async create_user(input_data) {
        return make_fetch(this.api_url, "users", "POST", this.bearer, "application/json", input_data)
    }

    async whoami() {
        return make_fetch(this.api_url, 'whoami', "GET", this.bearer)
    }
}

class Control {
    constructor(api_url) {
        this.api_url = api_url;
        this.token = "";
        this.bearer = "";
        this.sessions = undefined;
        this.notes = undefined;
        this.tasks = undefined;
        this.vehicles = undefined;
        this.initialised = false;
        this.users = undefined;
        this.login = this.login.bind(this);
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
                this.bearer = "Bearer " + this.token;
                this.users = new User(this.bearer, this.api_url);
                this.sessions = new Session(this.bearer, this.api_url);
                console.log("asdfasdfa")
                this.notes = new Note(this.bearer, this.api_url);
                this.tasks = new Task(this.bearer, this.api_url);
                this.vehicles = new Vehicle(this.bearer, this.api_url);
                this.initialised = true;
            })
            .catch(function (error) {
                console.log("Request failed", error);
                throw error
            });
    }

}

export default Control;