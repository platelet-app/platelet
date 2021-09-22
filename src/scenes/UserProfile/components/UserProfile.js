import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import Divider from "@material-ui/core/Divider";
import SaveCancelButtons from "../../../components/SaveCancelButtons";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import { EditModeToggleButton } from "../../../components/EditModeToggleButton";
import { getWhoami } from "../../../redux/Selectors";
import _ from "lodash";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";

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
    const dispatch = useDispatch();
    const whoami = useSelector(getWhoami);

    function updateStateFromProps() {
        setState(props.user);
        setOldState(props.user);
    }
    useEffect(updateStateFromProps, [props.user]);

    let header =
        props.user.id === whoami.id ? (
            <h2>My Profile.</h2>
        ) : (
            <h2>Profile for {state.displayName}</h2>
        );

    let editToggle = <></>;
    if (whoami.roles) {
        if (whoami.roles.includes("ADMIN") || whoami.id === props.user.id) {
            editToggle = (
                <EditModeToggleButton
                    tooltipDefault={
                        props.user.id === whoami.id
                            ? "Edit your profile"
                            : "Edit this user"
                    }
                    value={editMode}
                    onChange={(v) => {
                        setEditMode(v);
                        if (!v) setState(oldState);
                    }}
                />
            );
        }
    }

    function verifyUpdate(value) {
        const existing = props.displayNames.find(
            (u) => u.displayName === value.displayName
        );
        if (existing) {
            if (state.id !== existing.id) {
                dispatch(
                    displayErrorNotification("Display name is already in use.")
                );
                return false;
            }
        }
        return true;
    }

    const saveButtons = !editMode ? (
        <></>
    ) : (
        <SaveCancelButtons
            onSave={() => {
                if (verifyUpdate(state)) {
                    props.onUpdate(
                        _.omit(state, "_deleted", "_lastChangedAt", "_version")
                    );
                    setEditMode(false);
                    setOldState(state);
                }
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
                            value={state.emailAddress}
                            email
                            InputProps={{
                                readOnly: !editMode,
                                disableUnderline: !editMode,
                            }}
                            label={"Email Address"}
                            id={"email-address"}
                            onChange={(e) => {
                                setState({
                                    ...state,
                                    emailAddress: e.target.value,
                                });
                            }}
                        />
                    </Grid>
                    {divider}
                    <Grid item>
                        <TextFieldUncontrolled
                            value={state.telephoneNumber}
                            tel
                            InputProps={{
                                readOnly: !editMode,
                                disableUnderline: !editMode,
                            }}
                            label={"Contact Number"}
                            id={"contact-number"}
                            onChange={(e) => {
                                setState({
                                    ...state,
                                    telephoneNumber: e.target.value,
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
