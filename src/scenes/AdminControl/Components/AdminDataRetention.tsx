import {
    Button,
    Checkbox,
    FormControlLabel,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import React, { useState } from "react";
import { PaddedPaper } from "../../../styles/common";
import { useDispatch, useSelector } from "react-redux";
import { getWhoami } from "../../../redux/Selectors";
import Forbidden from "../../../ErrorComponents/Forbidden";
import { createLoadingSelector } from "../../../redux/LoadingSelectors";
import * as models from "../../../models/index";
import DataRetentionSelector, {
    DataRetentionValue,
    TimeUnit,
} from "../../../components/DataRetentionSelector";
import { displayInfoNotification } from "../../../redux/notifications/NotificationsActions";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

const initialDataRetentionState: DataRetentionValue = {
    value: 30,
    unit: TimeUnit.DAYS,
};

const useStyles = makeStyles()({
    root: {
        width: "100%",
        maxWidth: 460,
    },
});

function AdminDataRetention() {
    const [state, setState] = useState<DataRetentionValue>(
        initialDataRetentionState
    );
    const [noRetention, setNoRetention] = useState(true);
    const [showWarningDialog, setShowWarningDialog] = useState(false);
    const loadingSelector = createLoadingSelector(["GET_WHOAMI"]);
    const whoamiFetching = useSelector(loadingSelector);
    const [isPosting, setIsPosting] = useState(false);
    const dispatch = useDispatch();
    const { classes } = useStyles();
    const whoami = useSelector(getWhoami);

    // Calculate total days for comparison
    // Note: This uses approximate values for simplicity:
    // - Months are assumed to be 30 days
    // - Years are assumed to be 365 days
    // For precise calculations, backend should use actual calendar dates
    const getTotalDays = (value: number, unit: TimeUnit): number => {
        switch (unit) {
            case TimeUnit.DAYS:
                return value;
            case TimeUnit.WEEKS:
                return value * 7;
            case TimeUnit.MONTHS:
                return value * 30; // Approximate
            case TimeUnit.YEARS:
                return value * 365; // Approximate, not accounting for leap years
            default:
                return value;
        }
    };

    function handleSaveConfirmed() {
        setIsPosting(true);
        // Simulate async operation for better UX
        setTimeout(() => {
            // TODO: Implement actual save logic with DataStore or API
            if (noRetention) {
                console.log("Saving data retention settings: indefinite");
                dispatch(
                    displayInfoNotification(
                        "Data retention set to indefinite (no automatic deletion)"
                    )
                );
            } else {
                console.log("Saving data retention settings:", state);
                dispatch(
                    displayInfoNotification(
                        `Data retention set to ${state.value} ${state.unit}`
                    )
                );
            }
            setIsPosting(false);
            setShowWarningDialog(false);
        }, 500);
    }

    function handleSave() {
        // Check if retention is enabled and less than 7 days
        if (!noRetention) {
            const totalDays = getTotalDays(state.value, state.unit);
            if (totalDays < 7) {
                setShowWarningDialog(true);
                return;
            }
        }
        handleSaveConfirmed();
    }

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
        const totalDays = !noRetention
            ? getTotalDays(state.value, state.unit)
            : 0;
        return (
            <PaddedPaper>
                <Stack
                    className={classes.root}
                    direction={"column"}
                    justifyContent={"flex-start"}
                    alignItems={"flex-start"}
                    spacing={3}
                >
                    <Typography variant={"h5"}>
                        Set data retention time
                    </Typography>
                    <Typography
                        sx={{
                            color: "gray",
                            fontStyle: "italic",
                        }}
                    >
                        Determine how long data should be retained before
                        automatic deletion
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={noRetention}
                                onChange={(e) =>
                                    setNoRetention(e.target.checked)
                                }
                                disabled={isPosting}
                            />
                        }
                        label="Retain data indefinitely (no automatic deletion)"
                    />
                    {!noRetention && (
                        <DataRetentionSelector
                            value={state}
                            onChange={setState}
                            disabled={isPosting}
                        />
                    )}
                    <Button
                        disabled={isPosting}
                        onClick={handleSave}
                        sx={{ alignSelf: "flex-start" }}
                    >
                        Save retention settings
                    </Button>
                </Stack>
                <ConfirmationDialog
                    open={showWarningDialog}
                    onCancel={() => setShowWarningDialog(false)}
                    onConfirmation={handleSaveConfirmed}
                    dialogTitle="Short Retention Period Warning"
                >
                    <Typography>
                        You are setting a very short data retention period of{" "}
                        <strong>
                            {totalDays} day{totalDays !== 1 ? "s" : ""}
                        </strong>
                        . All data older than this will be automatically deleted.
                    </Typography>
                    <Typography sx={{ marginTop: 2 }}>
                        Are you sure you want to proceed with this setting?
                    </Typography>
                </ConfirmationDialog>
            </PaddedPaper>
        );
    }
}

export default AdminDataRetention;
