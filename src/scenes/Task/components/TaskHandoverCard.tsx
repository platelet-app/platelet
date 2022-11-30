import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";
import * as models from "../../../models";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { DataStore } from "aws-amplify";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { useDispatch } from "react-redux";

type TaskHandoversProps = {
    handover: models.Handover;
    onClear?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    disableUp?: boolean;
    disableDown?: boolean;
};

const TaskHandoverCard: React.FC<TaskHandoversProps> = ({
    handover,
    onClear,
    onMoveUp,
    onMoveDown,
    disableUp,
    disableDown,
}) => {
    const dispatch = useDispatch();
    const saveLocation = async (location: models.Location) => {
        try {
            if (location) {
                const existingHandover = await DataStore.query(
                    models.Handover,
                    handover.id
                );
                if (existingHandover) {
                    await DataStore.save(
                        models.Handover.copyOf(existingHandover, (updated) => {
                            updated.handoverLocation = location;
                        })
                    );
                }
            }
        } catch (e: any) {
            console.log(e);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        }
    };
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ marginLeft: 1 }}
        >
            {handover.handoverLocation ? (
                <Typography>{handover.handoverLocation.line1}</Typography>
            ) : (
                <FavouriteLocationsSelect onSelect={saveLocation} />
            )}
            <Stack direction="row" alignItems="center">
                {onMoveUp && (
                    <IconButton
                        aria-label="Move handover up"
                        disabled={disableUp}
                        onClick={onMoveUp}
                    >
                        <ArrowUpwardIcon />
                    </IconButton>
                )}
                {onMoveDown && (
                    <IconButton
                        aria-label="Move handover down"
                        onClick={onMoveDown}
                        disabled={disableDown}
                    >
                        <ArrowDownwardIcon />
                    </IconButton>
                )}
                {onClear && (
                    <IconButton aria-label="Clear handover" onClick={onClear}>
                        <HighlightOffIcon />
                    </IconButton>
                )}
            </Stack>
        </Stack>
    );
};

export default TaskHandoverCard;
