import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {useDispatch, useSelector} from "react-redux";
import Divider from "@material-ui/core/Divider";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import {updateUserRequest} from "../../../redux/users/UsersActions";
import {TextFieldUncontrolled} from "../../../components/TextFields";
import {createPostingSelector} from "../../../redux/selectors";
import {setCommentsObjectUUID} from "../../../redux/Actions";
import {EditModeToggleButton} from "../../../components/EditModeToggleButton";

export default function UserProfile(props) {
    const dispatch = useDispatch()
    const [editMode, setEditMode] = useState(false);
    const postingSelector = createPostingSelector(["UPDATE_USER"]);
    const isPosting = useSelector(state => postingSelector(state));
    const [state, setState] = useState({...props.user})
    const [oldState, setOldState] = useState({...props.user})
    const whoami = useSelector(state => state.whoami.user);

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
    if (whoami.roles) {
        if (whoami.roles.includes("admin") || whoami.uuid === props.user.uuid) {
            editToggle = <EditModeToggleButton
                tooltipDefault={props.user.uuid === whoami.uuid ? "Edit your profile" : "Edit this user"}
                value={editMode}
                //TODO: should be a proper event object?
                onChange={(v) => {
                    setEditMode(v)
                    if (!v)
                        setState(oldState);
                }}/>
        }
    }

    const saveButtons = !editMode ? <></> :
        <SaveCancelButtons
            disabled={isPosting}
            onSave={() => {
                dispatch(updateUserRequest(props.user.uuid, state));
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
                        {editToggle}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid container direction={"column"} justify={"flex-start"} alignItems={"flex-start"}
                      spacing={1}>
                    <Grid item>
                        <TextFieldUncontrolled
                            value={state.name}
                            InputProps={{
                                readOnly: !editMode,
                                disableUnderline: !editMode
                            }}
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
                            InputProps={{
                                readOnly: !editMode,
                                disableUnderline: !editMode
                            }}
                            disabled={isPosting}
                            label={"Display Name"}
                            id={"display-name"}
                            onChange={(e) => {
                                setState({...state, display_name: e.target.value})
                            }}/>
                    </Grid>
                    {divider}
                    <Grid item>
                        <TextFieldUncontrolled
                            value={state.email}
                            InputProps={{
                                readOnly: !editMode,
                                disableUnderline: !editMode
                            }}
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
                            InputProps={{
                                readOnly: !editMode,
                                disableUnderline: !editMode
                            }}
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
