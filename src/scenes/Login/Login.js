import React, {useEffect, useState} from 'react';
import '../../App.css';
import 'typeface-roboto'
import Button from '@material-ui/core/Button'
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "../../redux/login/LoginActions";
import {withSnackbar} from 'notistack';
import {PaddedPaper} from "../../styles/common";
import Grid from "@material-ui/core/Grid";
import {TextFieldUncontrolled} from "../../components/TextFields";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {createPostingSelector} from "../../redux/selectors";
import Typography from "@material-ui/core/Typography";
import LoginForm from "./components/LoginForm";
import ResetPasswordForm from "./components/ResetPasswordForm";

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

function Login(props) {
    const authStatus = useSelector(state => state.authStatus);
    const serverSettings = useSelector(state => state.serverSettings);
    const whoamiUUID = useSelector(state => state.whoami.user.uuid);
    const forcePasswordReset = useSelector(state => state.whoami.user.password_reset_on_login);


    useEffect(() => {
        const message = getMessage(authStatus);
        if (message)
            props.enqueueSnackbar(getMessage(authStatus), {variant: "warning", autoHideDuration: 4000});
    }, [authStatus])

    const form = forcePasswordReset ? <ResetPasswordForm userUUID={whoamiUUID}/> : <LoginForm/>;

    return (
        <PaddedPaper width={"400px"} height={"400px"}>
            <Grid container spacing={1} direction={"column"} alignItems={"center"} justify={"center"}>
                <Grid item>
                    <img alt={"Organisation logo"} src={serverSettings.image_url} height={"120px"} width={"120px"} style={{objectFit: "cover"}}/>
                </Grid>
                <Grid item>
                    <Typography variant="h6">
                        {serverSettings ? serverSettings.organisation_name : ""}
                    </Typography>
                </Grid>
                <Grid item>
                    {form}
                </Grid>
            </Grid>
        </PaddedPaper>
    )

}

export default withSnackbar(Login)