import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Grid, Button, makeStyles, TextField } from "@material-ui/core";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import {
    TextFieldUncontrolled,
    TextFieldControlled,
} from "../../../components/TextFields";
import { showHide } from "../../../styles/common";
import { useDispatch } from "react-redux";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";

const useStyles = makeStyles({
    root: {
        width: "50%",
        maxWidth: 460,
    },
});
const initialState = {
    username: "",
    password: "",
    passwordCheck: "",
    attributes: { name: "", email: "" },
};

function AdminAddUser() {
    const [state, setState] = useState(initialState);
    //TODO: eventually want to make signup only with email address unless chosen otherwise
    const [usernameMode, setUsernameMode] = useState(true);
    const [passwordVerified, setPasswordVerified] = useState(true);
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(
        () => setPasswordVerified(state.password === state.passwordCheck),
        [state.passwordCheck, state.password]
    );
    async function signUp() {
        try {
            const { user } = await Auth.signUp({
                ...state,
            });
            //TODO: remove this after DataStore sync is fixed up
            DataStore.save(
                new models.User({
                    name: state.attributes.name,
                    displayName: state.attributes.name,
                    active: 1,
                    username: state.username,
                    emailAddress: state.attributes.email,
                })
            );
            console.log(user);
        } catch (error) {
            console.log("error signing up:", error);
            dispatch(displayErrorNotification(error.message));
        }
    }
    const { show, hide } = showHide();
    return (
        <Grid
            container
            className={classes.root}
            direction={"column"}
            justify={"flex-start"}
            alignItems={"top"}
            spacing={3}
        >
            <Grid item>
                <TextFieldUncontrolled
                    className={usernameMode ? show : hide}
                    value={state.username}
                    fullWidth
                    label={"Username"}
                    id={"username"}
                    onChange={(e) => {
                        setState({ ...state, username: e.target.value });
                    }}
                />
            </Grid>
            <Grid item>
                <TextFieldUncontrolled
                    fullWidth
                    label={"Email address"}
                    id={"email"}
                    onChange={(e) =>
                        setState({
                            ...state,
                            username: usernameMode
                                ? state.username
                                : e.target.value,
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
                <TextFieldUncontrolled
                    fullWidth
                    label={"Name"}
                    id={"name"}
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
                <TextFieldUncontrolled
                    value={state.password}
                    inputProps={{
                        type: "password",
                    }}
                    fullWidth
                    label={"Password"}
                    id={"password"}
                    autoComplete="new-password"
                    onChange={(e) => {
                        setState({ ...state, password: e.target.value });
                    }}
                />
            </Grid>
            <Grid item>
                <TextField
                    margin="dense"
                    id={"password-confirm"}
                    error={!passwordVerified}
                    helperText={
                        !passwordVerified ? "Passwords do not match" : ""
                    }
                    label={"Password confirm"}
                    value={state.passwordCheck}
                    inputProps={{
                        type: "password",
                    }}
                    fullWidth
                    autoComplete="new-password"
                    onChange={(e) => {
                        setState({ ...state, passwordCheck: e.target.value });
                    }}
                />
            </Grid>
            <Grid item>
                <Button disabled={!passwordVerified} onClick={signUp}>
                    Add user
                </Button>
            </Grid>
        </Grid>
    );
}

export default AdminAddUser;
