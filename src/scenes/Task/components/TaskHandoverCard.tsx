import { Stack, Typography } from "@mui/material";
import React from "react";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";
import * as models from "../../../models";

type TaskHandoversProps = {
    handover: models.Handover;
};

const TaskHandoverCard: React.FC<TaskHandoversProps> = ({ handover }) => {
    return (
        <Stack>
            {handover.handoverLocation ? (
                <Typography>{handover.handoverLocation.line1}</Typography>
            ) : (
                <FavouriteLocationsSelect />
            )}
        </Stack>
    );
};

export default TaskHandoverCard;
