import { Button, Grid, Skeleton, TextField, Typography } from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import React, { useEffect, useState } from "react";
import { PaddedPaper } from "../../../styles/common";
import * as models from "../../../models/index";
import { DataStore } from "aws-amplify";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { useDispatch, useSelector } from "react-redux";
import { getWhoami, tenantIdSelector } from "../../../redux/Selectors";
import Forbidden from "../../../ErrorComponents/Forbidden";
import { createLoadingSelector } from "../../../redux/LoadingSelectors";
import { deliverableIcons, deliverableUnits } from "../../../apiConsts";
import DeliverableIconPicker from "./DeliverableIconPicker";
import UnitSelector from "../../../components/UnitSelector";
import DeliverableTypeTagger from "./DeliverableTypeTagger";

const initialDeliverableTypeState = {
    label: "",
    icon: deliverableIcons.other,
    defaultUnit: deliverableUnits.none,
    tags: [],
};

const useStyles = makeStyles()({
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
    const tenantId = useSelector(tenantIdSelector);
    const loadingSelector = createLoadingSelector(["GET_WHOAMI"]);
    const whoamiFetching = useSelector(loadingSelector);
    const [isPosting, setIsPosting] = useState(false);
    const [inputVerified, setInputVerified] = useState(false);
    const dispatch = useDispatch();
    const { classes } = useStyles();
    const whoami = useSelector(getWhoami);

    async function addDeliverableTypeToStore() {
        try {
            setIsPosting(true);
            await DataStore.save(
                new models.DeliverableType({ ...state, tenantId, disabled: 0 })
            );
            setState(initialDeliverableTypeState);
            setIsPosting(false);
        } catch (error) {
            console.log("error adding deliverable type:", error);
            setIsPosting(false);
            dispatch(displayErrorNotification("Sorry, something went wrong."));
        }
    }
    const deleteTag = (tag) => {
        setState((prevState) => ({
            ...prevState,
            tags: prevState.tags.filter((t) => t !== tag),
        }));
    };

    const addTag = (value) => {
        if (state.tags.includes(value.toLowerCase())) {
            return;
        }
        setState((prevState) => ({
            ...prevState,
            tags: [...prevState.tags, value.toLowerCase()],
        }));
    };

    function verifyInput() {
        setInputVerified(!!state.label);
    }
    useEffect(verifyInput, [state]);

    if (whoamiFetching) {
        return (
            <PaddedPaper>
                <Skeleton
                    sx={{ height: 450, width: "100%" }}
                    variant="rectangle"
                />
            </PaddedPaper>
        );
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
                            Add a new deliverable type
                        </Typography>
                    </Grid>

                    {Object.keys(fields).map((key) => {
                        return (
                            <Grid key={key} item>
                                <TextField
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
                        <DeliverableIconPicker
                            value={state.icon}
                            onChange={(icon) =>
                                setState((prevState) => ({
                                    ...prevState,
                                    icon,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item>
                        <UnitSelector
                            value={state.defaultUnit}
                            label={"Default unit"}
                            onChange={(value) =>
                                setState((prevState) => ({
                                    ...prevState,
                                    defaultUnit: value,
                                }))
                            }
                        />
                    </Grid>
                    <Grid item>
                        <Typography
                            sx={{
                                color: "gray",
                                fontStyle: "italic",
                                marginBottom: 1,
                            }}
                        >
                            Add tags to make finding this item easier
                        </Typography>
                        <DeliverableTypeTagger
                            onAdd={addTag}
                            onDelete={deleteTag}
                            value={state.tags}
                        />
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
