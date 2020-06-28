import Grid from "@material-ui/core/Grid";
import React, {useState} from "react";
import {loginUser} from "../../../redux/login/LoginActions";
import {useDispatch, useSelector} from "react-redux";
import {TextFieldUncontrolled} from "../../../components/TextFields";
import Button from "@material-ui/core/Button";
import {createPostingSelector} from "../../../redux/selectors";
import PasswordField from "./PasswordField";

export default function LoginForm(props) {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("")
    const postingSelector = createPostingSelector(["LOGIN"]);
    const isLoggingIn = useSelector(state => postingSelector(state));

    const [password, setPassword] = useState("")

    function handleLogin() {
        if (username && password)
            dispatch(loginUser({username, password}));
    }

    return (
        <Grid container spacing={1} direction={"column"} alignItems={"center"} justify={"center"}>
            <Grid item>
                <TextFieldUncontrolled label={"username"} value={username}
                                       variant={"outlined"}
                                       disabled={isLoggingIn}
                                       onPressEnter={handleLogin}
                                       onChange={(e) => {
                                           setUsername(e.target.value)
                                       }}/>
            </Grid>
            <Grid item>
                <PasswordField onChange={(e) => setPassword(e.target.value)} password={password} disabled={isLoggingIn}/>
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
