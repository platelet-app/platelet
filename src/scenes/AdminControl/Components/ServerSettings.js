import React, {useEffect, useState} from "react";
import {setCommentsObjectUUID} from "../../../redux/Actions";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import {updateUserRequest} from "../../../redux/users/UsersActions";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import {TextFieldUncontrolled} from "../../../components/TextFields";
import {useDispatch, useSelector} from "react-redux";
import {createPostingSelector} from "../../../redux/selectors";
import {EditModeToggleButton} from "../../../components/EditModeToggleButton";

export function ServerSettings(props) {
    const dispatch = useDispatch()
    const [editMode, setEditMode] = useState(false);
    const postingSelector = createPostingSelector(["UPDATE_SERVER_SETTINGS"]);
    const isPosting = useSelector(state => postingSelector(state));
    const [state, setState] = useState({...props.serverSettings})
    const [oldState, setOldState] = useState({...props.serverSettings})

    function resetAfterPost() {
        if (!isPosting && editMode) {
            setEditMode(false)
        }
    }

    useEffect(resetAfterPost, [isPosting])

    let header = <h2>Server settings</h2>;
    const saveButtons = !editMode ? <></> :
        <SaveCancelButtons
            disabled={isPosting}
            onSave={() => {
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
                        <EditModeToggleButton
                            tooltipDefault={"Change server settings"}
                            value={editMode}
                            //TODO: should be a proper event object?
                            onChange={(v) => {
                                setEditMode(v)
                                if (!v)
                                    setState(oldState);
                            }}/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid container direction={"column"} justify={"flex-start"} alignItems={"flex-start"}
                      spacing={1}>
                    <Grid item>
                        <TextFieldUncontrolled
                            value={state.organisation_name}
                            InputProps={{
                                readOnly: !editMode,
                                disableUnderline: !editMode
                            }}
                            label={"Organisation Name"}
                            id={"organisation-name"}
                            onChange={(e) => {
                                setState({...state, organisation_name: e.target.value})
                            }}/>
                    </Grid>
                    {divider}
                    <Grid item>
                        <TextFieldUncontrolled
                            value={state.hostname}
                            InputProps={{
                                readOnly: !editMode,
                                disableUnderline: !editMode
                            }}
                            disabled={isPosting}
                            label={"Hostname"}
                            id={"hostname"}
                            onChange={(e) => {
                                setState({...state, hostname: e.target.value})
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
