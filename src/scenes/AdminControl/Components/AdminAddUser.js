import React, { useState } from "react";

import { Auth } from "aws-amplify";
import { TextField, Grid, Button } from "@material-ui/core";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";

const initialState = {
    username: "",
    password: "",
    attributes: { name: "", email: "" },
};

function AdminAddUser(props) {
    const [state, setState] = useState(initialState);
    async function signUp() {
        try {
            const { user } = await Auth.signUp({
                ...state,
            });
            // DataStore.save(
            //     new models.User({
            //         name: state.attributes.name,
            //         displayName: state.attributes.name,
            //         active: 1,
            //         username: state.username,
            //         email: state.attributes.email,
            //     })
            // );
            // console.log(user);
        } catch (error) {
            console.log("error signing up:", error);
        }
    }
    return (
        <Grid>
            <Grid item>
                <TextField
                    onChange={(e) =>
                        setState({ ...state, username: e.target.value })
                    }
                    value={state.username}
                />
            </Grid>
            <Grid item>
                <TextField
                    onChange={(e) =>
                        setState({
                            ...state,
                            attributes: {
                                ...state.attributes,
                                name: e.target.value,
                            },
                        })
                    }
                    value={state.attributes.name}
                />
            </Grid>
            <Grid item>
                <TextField
                    onChange={(e) =>
                        setState({ ...state, password: e.target.value })
                    }
                    value={state.password}
                />
            </Grid>
            <Grid item>
                <TextField
                    onChange={(e) =>
                        setState({
                            ...state,
                            attributes: {
                                ...state.attributes,
                                email: e.target.value,
                            },
                        })
                    }
                    value={state.attributes.email}
                />
            </Grid>
            <Grid item>
                <Button onClick={signUp}>Confirm</Button>
            </Grid>
        </Grid>
    );
}

export default AdminAddUser;
