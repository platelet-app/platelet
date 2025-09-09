import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import React, { useEffect, useState } from "react";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import { PaddedPaper } from "../../../styles/common";
import * as models from "../../../models/index";
import { DataStore } from "aws-amplify";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { useDispatch, useSelector } from "react-redux";
import { getWhoami, tenantIdSelector } from "../../../redux/Selectors";
import Forbidden from "../../../ErrorComponents/Forbidden";
import { createLoadingSelector } from "../../../redux/LoadingSelectors";

const initialRiderResponsibilityState = {
    label: "",
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

function AdminAddRiderResponsibility() {
    const [state, setState] = useState(initialRiderResponsibilityState);
    const tenantId = useSelector(tenantIdSelector);
    const loadingSelector = createLoadingSelector(["GET_WHOAMI"]);
    const whoamiFetching = useSelector(loadingSelector);
    const [isPosting, setIsPosting] = useState(false);
    const [inputVerified, setInputVerified] = useState(false);
    const dispatch = useDispatch();
    const { classes } = useStyles();
    const whoami = useSelector(getWhoami);

    async function addRiderResponsibilityToStore() {
        try {
            setIsPosting(true);
            const checker = await DataStore.query(
                models.RiderResponsibility,
                (r) => r.label("eq", state.label)
            );
            if (checker && checker.length > 0) {
                setIsPosting(false);
                dispatch(
                    displayErrorNotification("This rider role already exists")
                );
                return;
            }
            await DataStore.save(
                new models.RiderResponsibility({
                    ...state,
                    tenantId,
                    disabled: 0,
                })
            );
            setState(initialRiderResponsibilityState);
            setIsPosting(false);
        } catch (error) {
            console.log("error adding rider role:", error);
            setIsPosting(false);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    }

    function verifyInput() {
        setInputVerified(!!state.label);
    }

    useEffect(verifyInput, [state]);

    if (whoamiFetching) {
        return (
            <PaddedPaper>
                <Skeleton
                    sx={{ height: 200, width: "100%" }}
                    variant="rectangular"
                />
            </PaddedPaper>
        );
    } else if (!whoami.roles.includes(models.Role.ADMIN)) {
        return <Forbidden />;
    } else {
        return (
            <PaddedPaper>
                <Stack
                    className={classes.root}
                    direction={"column"}
                    justifyContent={"flex-start"}
                    alignItems={"top"}
                    spacing={3}
                >
                    <Typography variant={"h5"}>Add a new rider role</Typography>

                    {Object.keys(fields).map((key) => {
                        return (
                            <TextFieldUncontrolled
                                key={key}
                                value={state[key as keyof typeof fields]}
                                fullWidth
                                label={fields[key as keyof typeof fields]}
                                id={key}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setState((prevState) => ({
                                        ...prevState,
                                        [key]: e.target.value,
                                    }));
                                }}
                            />
                        );
                    })}
                    <Button
                        disabled={!inputVerified || isPosting}
                        onClick={addRiderResponsibilityToStore}
                    >
                        Add rider role
                    </Button>
                </Stack>
            </PaddedPaper>
        );
    }
}

export default AdminAddRiderResponsibility;
