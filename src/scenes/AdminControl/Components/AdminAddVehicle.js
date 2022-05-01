import { Button, Grid, TextField, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import DatePicker from "@mui/lab/DatePicker";
import React, { useEffect, useState } from "react";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import { PaddedPaper } from "../../../styles/common";
import * as models from "../../../models/index";
import { DataStore } from "aws-amplify";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
import { useDispatch, useSelector } from "react-redux";
import { encodeUUID } from "../../../utilities";
import { getWhoami, tenantIdSelector } from "../../../redux/Selectors";
import Forbidden from "../../../ErrorComponents/Forbidden";
import { createLoadingSelector } from "../../../redux/LoadingSelectors";
import FormSkeleton from "../../../SharedLoadingSkeletons/FormSkeleton";

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
});

const fields = {
    name: "Name",
    model: "Model",
    manufacturer: "Manufacturer",
};

function AdminAddVehicle() {
    const [state, setState] = useState(initialVehicleState);
    const loadingSelector = createLoadingSelector(["GET_WHOAMI"]);
    const whoamiFetching = useSelector(loadingSelector);
    const tenantId = useSelector(tenantIdSelector);
    const [isPosting, setIsPosting] = useState(false);
    const [inputVerified, setInputVerified] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();
    const whoami = useSelector(getWhoami);

    async function addVehicleToStore() {
        try {
            setIsPosting(true);
            const result = { ...state };
            if (
                state.dateOfRegistration &&
                state.dateOfRegistration instanceof Date
            ) {
                result.dateOfRegistration = state.dateOfRegistration
                    .toISOString()
                    .split("T")[0];
            }
            if (
                state.dateOfManufacture &&
                state.dateOfManufacture instanceof Date
            ) {
                result.dateOfManufacture = state.dateOfManufacture
                    .toISOString()
                    .split("T")[0];
            }
            const newVehicle = await DataStore.save(
                new models.Vehicle({ ...result, tenantId, disabled: 0 })
            );
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

    if (whoamiFetching) {
        return <FormSkeleton />;
    } else if (!whoami.roles.includes("ADMIN")) {
        return <Forbidden />;
    } else {
        return (
            <PaddedPaper>
                <Grid
                    container
                    className={classes.root}
                    direction={"column"}
                    justifyContent={"flex-start"}
                    alignItems={"top"}
                    spacing={3}
                >
                    <Grid item>
                        <Typography variant={"h5"}>
                            Add a new vehicle
                        </Typography>
                    </Grid>

                    {Object.keys(fields).map((key) => {
                        return (
                            <Grid key={key} item>
                                <TextFieldUncontrolled
                                    value={state[key]}
                                    fullWidth
                                    label={fields[key]}
                                    id={key}
                                    onChange={(e) => {
                                        setState((prevState) => ({
                                            ...prevState,
                                            [key]: e.target.value,
                                        }));
                                    }}
                                />
                            </Grid>
                        );
                    })}
                    <Grid item>
                        <DatePicker
                            inputFormat={"dd/mm/yyyy"}
                            renderInput={(props) => <TextField {...props} />}
                            label={"Date of registration"}
                            onChange={(value) => {
                                setState((prevState) => ({
                                    ...prevState,
                                    dateOfRegistration: value,
                                }));
                            }}
                            value={state.dateOfRegistration}
                        />
                    </Grid>
                    <Grid item>
                        <DatePicker
                            inputFormat={"dd/mm/yyyy"}
                            renderInput={(props) => <TextField {...props} />}
                            label={"Date of manufacture"}
                            onChange={(value) => {
                                setState((prevState) => ({
                                    ...prevState,
                                    dateOfManufacture: value,
                                }));
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
                </Grid>
            </PaddedPaper>
        );
    }
}

export default AdminAddVehicle;
