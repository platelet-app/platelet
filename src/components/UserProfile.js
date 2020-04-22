import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {TextFieldControlled} from "./TextFieldControlled";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import {useDispatch, useSelector} from "react-redux";
import {setCommentsObjectUUID} from "../redux/Actions";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";

export default function UserProfile(props) {
    const dispatch = useDispatch()
    const [editMode, setEditMode] = useState(false);
    const whoami = useSelector(state => state.whoami);
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
                            <TextFieldControlled
                                value={props.user.name}
                                readOnly={!editMode}
                                label={"Name"}
                                id={"users-name"}
                                onChange={() => {
                                }}/>
                        </Grid>
                        {divider}
                        <Grid item>
                            <TextFieldControlled
                                value={props.user.display_name}
                                readOnly={!editMode}
                                label={"Display Name"}
                                id={"dispay-name"}
                                onChange={() => {
                                }}/>
                        </Grid>
                        {divider}
                        <Grid item>
                            <TextFieldControlled
                                value={props.user.email_address}
                                readOnly={!editMode}
                                label={"Email Address"}
                                id={"email-address"}
                                onChange={() => {
                                }}/>
                        </Grid>
                        {divider}
                        <Grid item>
                            <TextFieldControlled
                                value={props.user.contact_number}
                                readOnly={!editMode}
                                label={"Contact Number"}
                                id={"contact-number"}
                                onChange={() => {
                                }}/>
                        </Grid>
                        {divider}
                    </Grid>
                </Grid>
            </Grid>
    )
}
