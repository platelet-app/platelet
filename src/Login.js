import React, {useEffect, useState} from 'react';
import './App.css';
import 'typeface-roboto'
import Button from '@material-ui/core/Button'
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "./redux/login/Actions";
import { withSnackbar } from 'notistack';
import {PaddedPaper} from "./css/common";
import Grid from "@material-ui/core/Grid";
import {TextFieldUncontrolled} from "./components/TextFieldControlled";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from "@material-ui/core/TextField";

function getMessage(status) {
    switch (status) {
        case 401:
            return "Failed login. Please check your details."
        case 403:
            return "Unauthorised. Please check with your organisation."
        case 0:
            return ""
    }
}

function Login(props) {

    const dispatch = useDispatch();
    const authStatus = useSelector(state => state.authStatus);
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    function handleLogin() {
        if (username && password)
            dispatch(loginUser({username, password}));
    }

    useEffect(() => {
        const message = getMessage(authStatus);
        if (message)
            props.enqueueSnackbar(getMessage(authStatus),  { variant: "warning", autoHideDuration: 4000 });
    }, [authStatus])

    return (
                <PaddedPaper width={"400px"} height={"400px"}>
                    <Grid container spacing={1} direction={"column"} alignItems={"center"} justify={"center"}>
                        <Grid item>
                <TextFieldUncontrolled label={"username"} value={username}
                                       variant={"outlined"}
                                       onPressEnter={handleLogin}
                                       onChange={(e) => {setUsername(e.target.value)}}/>
                        </Grid>
                        <Grid item>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    onKeyPress={(ev) => {
                                        if (ev.key === 'Enter') {
                                            handleLogin()
                                            ev.preventDefault();
                                        }
                                    }}
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {setPassword(e.target.value)}}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                onMouseDown={(e) => e.preventDefault()}
                                                edge="end"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    labelWidth={70}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item>
                <Button disabled={!username || !password} variant="contained" color="primary" onClick={handleLogin}>
                    Login
                </Button>
                        </Grid>
                    </Grid>
                </PaddedPaper>
    )

}

export default withSnackbar(Login)