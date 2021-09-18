import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";
import Divider from "@material-ui/core/Divider";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import { EditModeToggleButton } from "../../../components/EditModeToggleButton";

export const initialUserState = {
    id: null,
    username: "",
    contact: { emailAddress: "", telephoneNumber: "" },
    name: null,
    dateOfBirth: null,
    patch: "",
    roles: "",
    displayName: null,
    profilePictureURL: "",
    profilePictureThumbnailURL: "",
};

export default function UserProfile(props) {
    const [editMode, setEditMode] = useState(false);
    const [state, setState] = useState(initialUserState);
    const [oldState, setOldState] = useState({ ...props.user });
    const whoami = useSelector((state) => state.whoami.user);

    function updateStateFromProps() {
        setState(props.user);
        setOldState(props.user);
    }
    useEffect(updateStateFromProps, [props.user]);

    let header =
        props.user.id === whoami.uuid ? (
            <h2>My Profile.</h2>
        ) : (
            <h2>Profile for {state.displayName}</h2>
        );

    let editToggle = <></>;
    if (whoami.roles) {
        if (whoami.roles.includes("admin") || whoami.uuid === props.user.id) {
            editToggle = (
                <EditModeToggleButton
                    tooltipDefault={
                        props.user.id === whoami.uuid
                            ? "Edit your profile"
                            : "Edit this user"
                    }
                    value={editMode}
                    //TODO: should be a proper event object?
                    onChange={(v) => {
                        setEditMode(v);
                        if (!v) setState(oldState);
                    }}
                />
            );
        }
    }

    const saveButtons = !editMode ? (
        <></>
    ) : (
        <SaveCancelButtons
            onSave={() => {
                props.onUpdate(state);
                setEditMode(false);
                setOldState(state);
            }}
            onCancel={() => {
                setEditMode(false);
                setState(oldState);
            }}
        />
    );

    const divider = editMode ? (
        <></>
    ) : (
        <div style={{ width: "460px" }}>
            <Grid item>
                <Divider />
            </Grid>
        </div>
    );
    console.log(props.user);
    console.log(state);
    return (
        <Grid
            container
            direction={"column"}
            justify={"flex-start"}
            alignItems={"top"}
            spacing={3}
        >
            <Grid item>
                <Grid
                    container
                    direction={"row"}
                    justify={"space-between"}
                    alignItems={"top"}
                    spacing={3}
                >
                    <Grid item>{header}</Grid>
                    <Grid item>{editToggle}</Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid
                    container
                    direction={"column"}
                    justify={"flex-start"}
                    alignItems={"flex-start"}
                    spacing={1}
                >
                    <Grid item>
                        <TextFieldUncontrolled
                            value={state.name}
                            InputProps={{
                                readOnly: !editMode,
                                disableUnderline: !editMode,
                            }}
                            label={"Name"}
                            id={"users-name"}
                            onChange={(e) => {
                                setState({ ...state, name: e.target.value });
                            }}
                        />
                    </Grid>
                    {divider}
                    <Grid item>
                        <TextFieldUncontrolled
                            value={state.displayName}
                            InputProps={{
                                readOnly: !editMode,
                                disableUnderline: !editMode,
                            }}
                            label={"Display Name"}
                            id={"display-name"}
                            onChange={(e) => {
                                setState({
                                    ...state,
                                    displayName: e.target.value,
                                });
                            }}
                        />
                    </Grid>
                    {divider}
                    <Grid item>
                        <TextFieldUncontrolled
                            value={state.contact.emailAddress}
                            InputProps={{
                                readOnly: !editMode,
                                disableUnderline: !editMode,
                            }}
                            label={"Email Address"}
                            id={"email-address"}
                            onChange={(e) => {
                                setState({
                                    ...state,
                                    contact: {
                                        ...state.contact,
                                        emailAddress: e.target.value,
                                    },
                                });
                            }}
                        />
                    </Grid>
                    {divider}
                    <Grid item>
                        <TextFieldUncontrolled
                            value={state.contact.telephoneNumber}
                            InputProps={{
                                readOnly: !editMode,
                                disableUnderline: !editMode,
                            }}
                            label={"Contact Number"}
                            id={"contact-number"}
                            onChange={(e) => {
                                setState({
                                    ...state,
                                    contact: {
                                        ...state.contact,
                                        telephoneNumber: e.target.value,
                                    },
                                });
                            }}
                        />
                    </Grid>
                    {divider}
                </Grid>
            </Grid>
            <Grid item>{saveButtons}</Grid>
        </Grid>
    );
}
