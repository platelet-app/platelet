import React, {useState} from "react";
import {PaddedPaper} from "../css/common";
import Grid from "@material-ui/core/Grid";
import {TextFieldControlled} from "./TextFieldControlled";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import {useSelector} from "react-redux";

export default function UserProfile(props) {
    const [editMode, setEditMode] = useState(false);
    const whoami = useSelector(state => state.whoami);
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
return (
    <PaddedPaper>
        <Grid container direction={"row"} justify={"space-between"} alignItems={"top"} spacing={3}>
            <Grid item>
                {header}
            </Grid>
            <Grid item>
                {editToggle}
            </Grid>
            <Grid item>
                <TextFieldControlled
                    value={props.user.name}
                    label={"Name"}
                    id={"users-name"}
                    disabled={!editMode}
                    onSelect={() => {
                    }}/>
                <TextFieldControlled
                    value={props.user.display_name}
                    label={"Display Name"}
                    id={"dispay-name"}
                    disabled={!editMode}
                    onSelect={() => {
                    }}/>
                <TextFieldControlled
                    value={props.user.email_address}
                    label={"Email Address"}
                    id={"email-address"}
                    disabled={!editMode}
                    onSelect={() => {
                    }}/>
                <TextFieldControlled
                    value={props.user.contact_number}
                    label={"Contact Number"}
                    id={"contact-number"}
                    disabled={!editMode}
                    onSelect={() => {
                    }}/>
            </Grid>
        </Grid>
    </PaddedPaper>
)
}
