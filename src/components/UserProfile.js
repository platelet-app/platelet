import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {TextFieldUncontrolled} from "./TextFieldControlled";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import {useDispatch, useSelector} from "react-redux";
import {setCommentsObjectUUID} from "../redux/Actions";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import {updateUser} from "../redux/users/UsersActions";
import {createPostingSelector} from "../redux/selectors";
import SaveCancelButtons from "./SaveCancelButtons";

export default function UserProfile(props) {
    const dispatch = useDispatch()
    const [editMode, setEditMode] = useState(false);
    const postingSelector = createPostingSelector(["UPDATE_USER"]);
    const isPosting = useSelector(state => postingSelector(state));
    const [state, setState] = useState({...props.user})
    const [oldState, setOldState] = useState({...props.user})
    const whoami = useSelector(state => state.whoami);

    function resetAfterPost() {
        if (!isPosting && editMode) {
            setEditMode(false)
        }
    }

    useEffect(resetAfterPost, [isPosting])

    dispatch(setCommentsObjectUUID(props.user.uuid));
    let header = props.user.uuid === whoami.uuid ? <h2>My Profile.</h2> :
        <h2>Profile for {props.user.display_name}</h2>;

    let editToggle = <></>;
    if (whoami.roles.includes("admin") || whoami.uuid === props.user.uuid) {
        editToggle = editMode ?
            <IconButton
                color="inherit"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => {
                    setEditMode(!editMode);
                }}>
                <EditIcon/>
            </IconButton> :
            <IconButton
                color="gray"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => {
                    setEditMode(!editMode);
                }}>
                <EditIcon/>
            </IconButton>;
    }

    const saveButtons = !editMode ? <></> :
        <SaveCancelButtons
            disabled={isPosting}
            onSave={() => {
                dispatch(updateUser({userUUID: props.user.uuid, payload: state}));
                setOldState(state);
            }}
            onCancel={() => {
                setEditMode(false);
                setState(oldState);
            }}
        />

    const divider = editMode ? <></> : <div style={{width: "460px"}}><Grid item><Divider/></Grid></div>;
    return (
        <Grid container direction={"column"} justify={"flex-start"} alignItems={"top"} spacing={3}>
            <Grid item>
                <Grid container direction={"row"} justify={"space-between"} alignItems={"top"} spacing={3}>
                    <Grid item>
                        {header}
                    </Grid>
                    <Grid item>
                        <Tooltip title={props.user.uuid === whoami.uuid ? "Edit your profile" : "Edit this user"}>
                            {editToggle}
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid container direction={"column"} justify={"flex-start"} alignItems={"flex-start"}
                      spacing={1}>
                    <Grid item>
                        <TextFieldUncontrolled
                            value={state.name}
                            readOnly={!editMode}
                            label={"Name"}
                            id={"users-name"}
                            onChange={(e) => {
                                setState({...state, name: e.target.value})
                            }}/>
                    </Grid>
                    {divider}
                    <Grid item>
                        <TextFieldUncontrolled
                            value={state.display_name}
                            readOnly={!editMode}
                            disabled={isPosting}
                            label={"Display Name"}
                            id={"dispay-name"}
                            onChange={(e) => {
                                setState({...state, display_name: e.target.value})
                            }}/>
                    </Grid>
                    {divider}
                    <Grid item>
                        <TextFieldUncontrolled
                            value={state.email}
                            readOnly={!editMode}
                            disabled={isPosting}
                            label={"Email Address"}
                            id={"email-address"}
                            onChange={(e) => {
                                setState({...state, email: e.target.value})
                            }}/>
                    </Grid>
                    {divider}
                    <Grid item>
                        <TextFieldUncontrolled
                            value={state.contact_number}
                            readOnly={!editMode}
                            disabled={isPosting}
                            label={"Contact Number"}
                            id={"contact-number"}
                            onChange={(e) => {
                                setState({...state, contact_number: e.target.value})
                            }}/>
                    </Grid>
                    {divider}
                </Grid>
            </Grid>
            <Grid item>
                {saveButtons}
            </Grid>
        </Grid>
    )
}
