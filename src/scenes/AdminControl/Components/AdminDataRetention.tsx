import { Button, Skeleton, Stack, Typography } from "@mui/material";
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
    const loadingSelector = createLoadingSelector(["GET_WHOAMI"]);
    const whoamiFetching = useSelector(loadingSelector);
    const [isPosting, setIsPosting] = useState(false);
    const dispatch = useDispatch();
    const { classes } = useStyles();
    const whoami = useSelector(getWhoami);

    function handleSave() {
        setIsPosting(true);
        // TODO: Implement actual save logic with DataStore or API
        console.log("Saving data retention settings:", state);
        dispatch(
            displayInfoNotification(
                `Data retention set to ${state.value} ${state.unit}`
            )
        );
        setIsPosting(false);
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
        return (
            <PaddedPaper>
                <Stack
                    className={classes.root}
                    direction={"column"}
                    justifyContent={"flex-start"}
                    alignItems={"top"}
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
                    <DataRetentionSelector
                        value={state}
                        onChange={setState}
                        disabled={isPosting}
                    />
                    <Button disabled={isPosting} onClick={handleSave}>
                        Save retention settings
                    </Button>
                </Stack>
            </PaddedPaper>
        );
    }
}

export default AdminDataRetention;
