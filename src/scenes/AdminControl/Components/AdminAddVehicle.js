import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import React, { useEffect, useState } from "react";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import { PaddedPaper } from "../../../styles/common";
import * as models from "../../../models/index";
import { DataStore } from "@aws-amplify/datastore";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
import { useDispatch } from "react-redux";
import { encodeUUID } from "../../../utilities";

const initialVehicleState = {
    name: "",
    manufacturer: "",
    model: "",
    dateOfManufacture: null,
    dateOfRegistration: null,
};

const useStyles = makeStyles({
    root: {
        width: "100%",
        maxWidth: 460,
    },
    message: {
        height: 80,
    },
});

function AdminAddVehicle() {
    const [state, setState] = useState(initialVehicleState);
    const [message, setMessage] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [inputVerified, setInputVerified] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();

    async function addVehicleToStore() {
        try {
            setIsPosting(true);
            const result = { ...state };
            if (
                state.dateOfRegistration &&
                state.dateOfRegistration instanceof Date
            ) {
                result.dateOfRegistration =
                    state.dateOfRegistration.toISOString();
            }
            if (
                state.dateOfManufacture &&
                state.dateOfManufacture instanceof Date
            ) {
                result.dateOfManufacture =
                    state.dateOfManufacture.toISOString();
            }
            const newVehicle = await DataStore.save(new models.Vehicle(result));
            setState(initialVehicleState);
            setIsPosting(false);
            dispatch(
                displayInfoNotification(
                    "Vehicle added",
                    undefined,
                    `/vehicle/${encodeUUID(newVehicle.id)}`
                )
            );
        } catch (error) {
            console.log("error adding vehicle:", error);
            setIsPosting(false);
            dispatch(displayErrorNotification(error.message));
        }
    }

    function verifyInput() {
        setInputVerified(!!state.name);
    }
    useEffect(verifyInput, [state]);

    return (
        <PaddedPaper>
            <Grid
                container
                className={classes.root}
                direction={"column"}
                justify={"flex-start"}
                alignItems={"top"}
                spacing={3}
            >
                <Grid item>
                    <Typography variant={"h5"}>Add a new vehicle</Typography>
                </Grid>
                <Grid item>
                    <TextFieldUncontrolled
                        value={state.name}
                        fullWidth
                        label={"Name"}
                        id={"name"}
                        onChange={(e) => {
                            setState({ ...state, name: e.target.value });
                        }}
                    />
                </Grid>
                <Grid item>
                    <TextFieldUncontrolled
                        value={state.manufacturer}
                        fullWidth
                        label={"Manufacturer"}
                        id={"manufacturer"}
                        onChange={(e) => {
                            setState({
                                ...state,
                                manufacturer: e.target.value,
                            });
                        }}
                    />
                </Grid>
                <Grid item>
                    <TextFieldUncontrolled
                        value={state.model}
                        fullWidth
                        label={"Model"}
                        id={"model"}
                        onChange={(e) => {
                            setState({
                                ...state,
                                model: e.target.value,
                            });
                        }}
                    />
                </Grid>
                <Grid item>
                    <DatePicker
                        label={"Date of registration"}
                        onChange={(value) => {
                            setState({ ...state, dateOfRegistration: value });
                        }}
                        value={state.dateOfRegistration}
                    />
                </Grid>
                <Grid item>
                    <DatePicker
                        label={"Date of manufacture"}
                        onChange={(value) => {
                            setState({ ...state, dateOfManufacture: value });
                        }}
                        value={state.dateOfManufacture}
                    />
                </Grid>
                <Grid item>
                    <Button
                        disabled={!inputVerified || isPosting}
                        onClick={addVehicleToStore}
                    >
                        Add vehicle
                    </Button>
                </Grid>
                <Grid className={classes.message} item>
                    <Typography>{message}</Typography>
                </Grid>
            </Grid>
        </PaddedPaper>
    );
}

export default AdminAddVehicle;
