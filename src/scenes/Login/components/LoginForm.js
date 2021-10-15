import Grid from "@mui/material/Grid";
import React, {useState} from "react";
import {loginRequest} from "../../../redux/login/LoginActions";
import {useDispatch, useSelector} from "react-redux";
import {TextFieldUncontrolled} from "../../../components/TextFields";
import Button from "@mui/material/Button";
import {createPostingSelector} from "../../../redux/LoadingSelectors";
import PasswordField from "./PasswordField";

export default function LoginForm(props) {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("")
    const postingSelector = createPostingSelector(["LOGIN"]);
    const isLoggingIn = useSelector(state => postingSelector(state));

    const [password, setPassword] = useState("")

    function handleLogin() {
        if (username && password)
            dispatch(loginRequest(username, password));
    }

    return (
        <Grid container spacing={1} direction={"column"} alignItems={"center"} justify={"center"}>
            <Grid item>
                <TextFieldUncontrolled label={"username"} value={username}
                                       variant={"outlined"}
                                       disabled={isLoggingIn}
                                       onPressEnter={() => {
                                           if (password && username)
                                               handleLogin();
                                       }}
                                       onChange={(e) => {
                                           setUsername(e.target.value)
                                       }}/>
            </Grid>
            <Grid item>
                <PasswordField
                    onChange={(e) => setPassword(e.target.value)}
                    password={password}
                    onPressEnter={() => {
                        if (password && username)
                            handleLogin();
                    }}
                    disabled={isLoggingIn}/>
            </Grid>
            <Grid item>
                <Button disabled={!username || !password || isLoggingIn} variant="contained" color="primary"
                        onClick={handleLogin}>
                    Login
                </Button>
            </Grid>
        </Grid>
    )
}
