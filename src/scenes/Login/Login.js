import React, {useEffect, useState} from 'react';
import '../../App.css';
import 'typeface-roboto'
import {useSelector} from "react-redux";
import {withSnackbar} from 'notistack';
import {PaddedPaper} from "../../styles/common";
import Grid from "@mui/material/Grid";
import LoginForm from "./components/LoginForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import makeStyles from "@mui/material/styles/makeStyles";

function getMessage(status) {
    switch (status) {
        case 401:
            return "Failed login. Please check your details."
        case 403:
            return "Unauthorised. Please check with your organisation."
        default:
            return ""
    }
}

const useStyles = makeStyles({
    root: {
        margin: "auto"
    }
})

function Login(props) {
    const authStatus = useSelector(state => state.authStatus);
    const serverSettings = useSelector(state => state.serverSettings);
    const whoamiUUID = useSelector(state => state.whoami.user.uuid);
    const forcePasswordReset = useSelector(state => state.whoami.user.password_reset_on_login);

    const classes = useStyles();

    useEffect(() => {
        const message = getMessage(authStatus);
        if (message)
            props.enqueueSnackbar(getMessage(authStatus), {variant: "warning", autoHideDuration: 4000});
    }, [authStatus])

    const form = forcePasswordReset ? <ResetPasswordForm userUUID={whoamiUUID}/> : <LoginForm/>;

    return (
        <PaddedPaper className={classes.root} width={"400px"} height={"300px"}>
            <Grid container spacing={1} direction={"column"} alignItems={"center"} justify={"center"}>
                <Grid item>
                    <img alt={"Organisation logo"} src={serverSettings.image_url} height={"50px"} width={"120px"} style={{objectFit: "contain"}}/>
                </Grid>
                <Grid item>
                    {form}
                </Grid>
            </Grid>
        </PaddedPaper>
    )
}

export default withSnackbar(Login)
