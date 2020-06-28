import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import PasswordField from "./PasswordField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {createPostingSelector} from "../../../redux/selectors";
import {useDispatch, useSelector} from "react-redux";
import {updateUser, updateUserPassword} from "../../../redux/users/UsersActions";

export default function ResetPasswordForm(props) {
    const dispatch = useDispatch();
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const postingSelector = createPostingSelector(["UPDATE_USER"]);
    const isPosting = useSelector(state => postingSelector(state));

    function handlePasswordReset() {
        const payload = {password: newPass}
        dispatch(updateUserPassword({userUUID: props.userUUID, payload}))
    }

    return (
        <Grid container direction={"column"} spacing={3} alignItems={"center"} justify={"flex-start"}>
            <Grid item>
                <Typography>You must reset your password before logging in.</Typography>
            </Grid>
            <Grid item>
                <PasswordField onChange={e => setNewPass(e.target.value)} label={"New password"}/>
            </Grid>
            <Grid item>
                <PasswordField onChange={e => setConfirmPass(e.target.value)} label={"Confirm new password"}/>
            </Grid>
            <Grid item>
            <Button disabled={!newPass || !confirmPass || isPosting || newPass !== confirmPass} variant="contained" color="primary"
                    onClick={handlePasswordReset}>
                Change password
            </Button>
            </Grid>
        </Grid>
    )
}