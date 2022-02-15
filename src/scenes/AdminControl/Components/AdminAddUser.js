import React, { useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Button, TextField, Typography, Stack } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Auth, DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import { PaddedPaper } from "../../../styles/common";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
import Forbidden from "../../../ErrorComponents/Forbidden";
import { getWhoami, tenantIdSelector } from "../../../redux/Selectors";
import { createLoadingSelector } from "../../../redux/LoadingSelectors";
import FormSkeleton from "../../../SharedLoadingSkeletons/FormSkeleton";
import { encodeUUID } from "../../../utilities";
import { userRoles } from "../../../apiConsts";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import * as mutations from "../../../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";

const useStyles = makeStyles({
    root: {
        maxWidth: 460,
    },
    message: {
        height: 80,
    },
});
const initialState = {
    name: "",
    email: "",
};

const fields = {
    name: "Name",
    email: "Email",
};

function AdminAddUser() {
    const [state, setState] = useState(initialState);
    //TODO: eventually want to make signup only with email address
    const whoami = useSelector(getWhoami);
    const tenantId = useSelector(tenantIdSelector);
    const loadingSelector = createLoadingSelector(["GET_WHOAMI"]);
    const whoamiFetching = useSelector(loadingSelector);
    const [passwordVerified, setPasswordVerified] = useState(true);
    const [inputVerified, setInputVerified] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const classes = useStyles();
    const [rolesState, setRolesState] = useState([]);

    function onClickToggle(key) {
        setRolesState((prevState) => {
            if (prevState.includes(key))
                return prevState.filter((v) => v !== key);
            else return [...prevState, key];
        });
    }

    function verifyInput() {
        setInputVerified(
            //state.password &&
            state.name && state.email
            //passwordVerified
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
            if (!tenantId) {
                dispatch(displayErrorNotification("Tenant ID not found"));
                return;
            }
            setIsPosting(true);
            await API.graphql(
                graphqlOperation(mutations.registerUser, {
                    name: state.name,
                    email: state.email,
                    roles: rolesState,
                    tenantId,
                })
            );

            setIsPosting(false);

            dispatch(displayInfoNotification("User added"));
            setState(initialState);
            setIsPosting(false);
        } catch (error) {
            console.log("error signing up:", error);
            setIsPosting(false);
            dispatch(displayErrorNotification(error.message));
        }
    }
    if (whoamiFetching) {
        return <FormSkeleton />;
    } else if (!whoami.roles.includes("ADMIN")) {
        return <Forbidden />;
    } else {
        return (
            <PaddedPaper>
                <Stack
                    className={classes.root}
                    direction={"column"}
                    justifyContent={"flex-start"}
                    alignItems={"top"}
                    spacing={3}
                >
                    <Typography variant={"h5"}>Add a new user</Typography>
                    {Object.entries(fields).map(([key, value]) => (
                        <TextFieldUncontrolled
                            key={key}
                            label={value}
                            value={state[key]}
                            onChange={(e) =>
                                setState((prevState) => ({
                                    ...prevState,
                                    [key]: e.target.value,
                                }))
                            }
                        />
                    ))}
                    {false && ( // no password fields for now
                        <>
                            <TextField
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
                        </>
                    )}

                    <Stack
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={2}
                        direction="row"
                    >
                        <ToggleButtonGroup
                            value={rolesState}
                            orientation="vertical"
                            aria-label="task actions"
                        >
                            {Object.values(_.omit(userRoles, "user")).map(
                                (value) => {
                                    return (
                                        <ToggleButton
                                            sx={{
                                                paddingTop: 1.5,
                                                paddingBottom: 1.5,
                                            }}
                                            key={value}
                                            disabled={false}
                                            aria-disabled={false}
                                            aria-label={value}
                                            value={value}
                                            onClick={() => onClickToggle(value)}
                                        >
                                            {rolesState.includes(value) ? (
                                                <CheckBoxIcon />
                                            ) : (
                                                <CheckBoxOutlineBlankIcon />
                                            )}
                                        </ToggleButton>
                                    );
                                }
                            )}
                        </ToggleButtonGroup>
                        <Stack sx={{ width: "100%" }} direction="column">
                            {Object.values(_.omit(userRoles, "user")).map(
                                (value) => {
                                    const disabled = false;
                                    return (
                                        <Stack
                                            justifyContent="space-between"
                                            alignItems="center"
                                            direction="row"
                                        >
                                            <Typography
                                                onClick={() => {
                                                    if (disabled) return;
                                                    onClickToggle(value);
                                                }}
                                                sx={{
                                                    paddingTop: 1.5,
                                                    paddingBottom: 1.5,
                                                    cursor: disabled
                                                        ? "default"
                                                        : "pointer",
                                                    color: disabled
                                                        ? "gray"
                                                        : "text.primary",
                                                }}
                                            >
                                                {value}
                                            </Typography>
                                        </Stack>
                                    );
                                }
                            )}
                        </Stack>
                    </Stack>

                    <Button
                        disabled={!inputVerified || isPosting}
                        onClick={signUp}
                    >
                        Add user
                    </Button>
                    <Typography>{message}</Typography>
                </Stack>
            </PaddedPaper>
        );
    }
}

export default AdminAddUser;
