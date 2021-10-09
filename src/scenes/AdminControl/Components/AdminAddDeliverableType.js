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
import { useDispatch, useSelector } from "react-redux";
import { encodeUUID } from "../../../utilities";
import { getWhoami } from "../../../redux/Selectors";
import Forbidden from "../../../ErrorComponents/Forbidden";
import { createLoadingSelector } from "../../../redux/LoadingSelectors";
import FormSkeleton from "../../../SharedLoadingSkeletons/FormSkeleton";
import { deliverableIcons } from "../../../apiConsts";
import DeliverableIconPicker from "./DeliverableIconPicker";

const initialDeliverableTypeState = {
    label: "",
    icon: deliverableIcons.other,
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

const fields = {
    label: "Label",
};

function AdminAddDeliverableType() {
    const [state, setState] = useState(initialDeliverableTypeState);
    const loadingSelector = createLoadingSelector(["GET_WHOAMI"]);
    const whoamiFetching = useSelector(loadingSelector);
    const [isPosting, setIsPosting] = useState(false);
    const [inputVerified, setInputVerified] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();
    const whoami = useSelector(getWhoami);

    async function addDeliverableTypeToStore() {
        try {
            setIsPosting(true);
            const result = { ...state };
            await DataStore.save(new models.DeliverableType(result));
            setState(initialDeliverableTypeState);
            setIsPosting(false);
            dispatch(displayInfoNotification("Deliverable type added"));
        } catch (error) {
            console.log("error adding deliverable type:", error);
            setIsPosting(false);
            dispatch(displayErrorNotification(error.message));
        }
    }

    function verifyInput() {
        setInputVerified(!!state.label);
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
                    justify={"flex-start"}
                    alignItems={"top"}
                    spacing={3}
                >
                    <Grid item>
                        <Typography variant={"h5"}>
                            Add a new deliverable type
                        </Typography>
                    </Grid>

                    {Object.keys(fields).map((key) => {
                        return (
                            <Grid key={key} style={{ width: "50%" }} item>
                                <TextFieldUncontrolled
                                    value={state[key]}
                                    fullWidth
                                    label={fields[key]}
                                    id={key}
                                    onChange={(e) => {
                                        setState({
                                            ...state,
                                            [key]: e.target.value,
                                        });
                                    }}
                                />
                            </Grid>
                        );
                    })}
                    <Grid item>
                        <DeliverableIconPicker />
                    </Grid>
                    <Grid item>
                        <Button
                            disabled={!inputVerified || isPosting}
                            onClick={addDeliverableTypeToStore}
                        >
                            Add deliverable type
                        </Button>
                    </Grid>
                </Grid>
            </PaddedPaper>
        );
    }
}

export default AdminAddDeliverableType;
