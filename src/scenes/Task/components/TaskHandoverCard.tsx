import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";
import * as models from "../../../models";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

type TaskHandoversProps = {
    handover: models.Handover;
    onClear?: () => void;
};

const TaskHandoverCard: React.FC<TaskHandoversProps> = ({
    handover,
    onClear,
}) => {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%", marginLeft: 1 }}
        >
            {handover.handoverLocation ? (
                <Typography>{handover.handoverLocation.line1}</Typography>
            ) : (
                <FavouriteLocationsSelect />
            )}
            {onClear && (
                <IconButton aria-label="Clear handover" onClick={onClear}>
                    <HighlightOffIcon />
                </IconButton>
            )}
        </Stack>
    );
};

export default TaskHandoverCard;
