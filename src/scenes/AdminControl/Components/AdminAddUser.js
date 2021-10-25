import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Grid, Button, TextField, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import {
    TextFieldUncontrolled,
    TextFieldControlled,
} from "../../../components/TextFields";
import { PaddedPaper, showHide } from "../../../styles/common";
import { useDispatch, useSelector } from "react-redux";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
import Forbidden from "../../../ErrorComponents/Forbidden";
import { getWhoami } from "../../../redux/Selectors";
import { createLoadingSelector } from "../../../redux/LoadingSelectors";
import FormSkeleton from "../../../SharedLoadingSkeletons/FormSkeleton";
import { encodeUUID } from "../../../utilities";

const useStyles = makeStyles({
    root: {
        width: "100%",
        maxWidth: 460,
    },
    message: {
        height: 80,
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
    const whoami = useSelector(getWhoami);
    const loadingSelector = createLoadingSelector(["GET_WHOAMI"]);
    const whoamiFetching = useSelector(loadingSelector);
    const [usernameMode, setUsernameMode] = useState(true);
    const [passwordVerified, setPasswordVerified] = useState(true);
    const [inputVerified, setInputVerified] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const classes = useStyles();

    function verifyInput() {
        setInputVerified(
            state.username &&
                state.password &&
                state.attributes.name &&
                state.attributes.email &&
                passwordVerified
        );
    }
    useEffect(verifyInput, [state, passwordVerified]);

    function verifyPassword() {
        setPasswordVerified(state.password === state.passwordCheck);
    }

    useEffect(verifyPassword, [state.passwordCheck, state.password]);
    useEffect(() => {
        if (message) setMessage("");
    }, [state]);
    async function signUp() {
        try {
            setIsPosting(true);
            if (
                false ||
                !process.env.REACT_APP_OFFLINE_ONLY ||
                process.env.REACT_APP_OFFLINE_ONLY === "false"
            ) {
                const { userSub } = await Auth.signUp({
                    ...state,
                });
                dispatch(
                    displayInfoNotification(
                        "User registered and will be available after they confirm their account"
                    )
                );
            } else {
                // Only add the user to DataStore if we're working offline, otherwise get it from amplify once user is confirmed
                const newContact = await DataStore.save(
                    new models.AddressAndContactDetails({
                        emailAddress: state.attributes.email,
                    })
                );
                const newUser = await DataStore.save(
                    new models.User({
                        name: state.attributes.name,
                        displayName: state.attributes.name,
                        active: 1,
                        username: state.username,
                        contact: newContact,
                    })
                );
                dispatch(
                    displayInfoNotification(
                        "User added",
                        undefined,
                        `/user/${encodeUUID(newUser.id)}`
                    )
                );
            }
            setState(initialState);
            setIsPosting(false);
        } catch (error) {
            console.log("error signing up:", error);
            setIsPosting(false);
            dispatch(displayErrorNotification(error.message));
        }
    }
    const { show, hide } = showHide();
    if (whoamiFetching) {
        return <FormSkeleton />;
    } else if (!whoami.roles.includes("ADMIN")) {
        return <Forbidden />;
    } else {
        return (
            <PaddedPaper>
                <Grid
                    container
                    className={classes.root}
                    direction={"column"}
                    justifyContent={"flex-start"}
                    alignItems={"top"}
                    spacing={3}
                >
                    <Grid item>
                        <Typography variant={"h5"}>Add a new user</Typography>
                    </Grid>
                    <Grid item>
                        <TextFieldUncontrolled
                            className={usernameMode ? show : hide}
                            value={state.username}
                            fullWidth
                            label={"Username"}
                            id={"username"}
                            onChange={(e) => {
                                setState((prevState) => ({
                                    ...prevState,
                                    username: e.target.value,
                                }));
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <TextFieldUncontrolled
                            fullWidth
                            label={"Email address"}
                            id={"email"}
                            onChange={(e) =>
                                setState((prevState) => ({
                                    ...prevState,
                                    username: usernameMode
                                        ? prevState.username
                                        : e.target.value,
                                    attributes: {
                                        ...prevState.attributes,
                                        email: e.target.value,
                                    },
                                }))
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
                                setState((prevState) => ({
                                    ...prevState,
                                    attributes: {
                                        ...prevState.attributes,
                                        name: e.target.value,
                                    },
                                }))
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
                                setState((prevState) => ({
                                    ...prevState,
                                    password: e.target.value,
                                }));
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            margin="dense"
                            id={"password-confirm"}
                            error={!passwordVerified}
                            helperText={
                                !passwordVerified
                                    ? "Passwords do not match"
                                    : ""
                            }
                            label={"Password confirm"}
                            value={state.passwordCheck}
                            inputProps={{
                                type: "password",
                            }}
                            fullWidth
                            autoComplete="new-password"
                            onChange={(e) => {
                                setState((prevState) => ({
                                    ...prevState,
                                    passwordCheck: e.target.value,
                                }));
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            disabled={!inputVerified || isPosting}
                            onClick={signUp}
                        >
                            Add user
                        </Button>
                    </Grid>
                    <Grid className={classes.message} item>
                        <Typography>{message}</Typography>
                    </Grid>
                </Grid>
            </PaddedPaper>
        );
    }
}

export default AdminAddUser;
