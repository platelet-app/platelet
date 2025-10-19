import * as React from "react";
import * as models from "../../../models";
import {
    Box,
    Button,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import ClearIcon from "@mui/icons-material/Clear";
import TimeRelationPicker from "../TimeRelationPicker";
import { DatePicker } from "@mui/lab";
import TaskScheduleIconText from "../TaskScheduleIconText";
import { Schedule } from "../PickUpAndDeliverSchedule";
import { convertScheduleToTaskData } from "../../../utilities/convertScheduleToTaskData";
import useIsPaidSubscription from "../../../hooks/useIsPaidSubscription";
import calculateDefaultEditTimes from "./utils/calculateDefaultEditTimes";

const isValidTime = (time: string) => {
    const [hours, minutes] = time.split(":").map((value) => parseInt(value));
    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
};

type TaskScheduleDetailsProps = {
    schedule: models.Schedule | null;
    onClear: () => void;
    onChange: (value: models.Schedule) => void;
    noWarning?: boolean;
    hideDate?: boolean;
};

export const TaskScheduleDetails: React.FC<TaskScheduleDetailsProps> = ({
    schedule,
    onClear,
    onChange,
    noWarning = true,
    hideDate = false,
}) => {
    const [confirmClear, setConfirmClear] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [scheduleState, setScheduleState] = React.useState<Schedule | null>(
        null
    );

    const isPaid = useIsPaidSubscription();

    const handleClear = () => {
        onClear();
        setConfirmClear(false);
    };

    const handleSetEditMode = () => {
        setScheduleState(calculateDefaultEditTimes(schedule, hideDate));
        setEditMode(true);
    };

    const handleSaveEdit = () => {
        if (scheduleState) {
            const schedule = convertScheduleToTaskData(scheduleState);
            if (schedule) {
                onChange(schedule);
                setEditMode(false);
            }
        }
    };

    const handleChangeDate = (customDate: Date | null) => {
        setScheduleState((prevState) => {
            if (prevState) {
                return { ...prevState, date: customDate };
            }
            return prevState;
        });
    };

    return (
        <>
            {schedule && (
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                >
                    <TaskScheduleIconText
                        schedule={schedule}
                        showWarning={!noWarning}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <IconButton onClick={() => setConfirmClear(true)}>
                            <ClearIcon />
                        </IconButton>
                        {isPaid && (
                            <IconButton onClick={handleSetEditMode}>
                                <EditIcon />
                            </IconButton>
                        )}
                    </Box>
                </Stack>
            )}
            {!schedule && (
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                >
                    <Typography>No schedule set</Typography>
                    <Button color="primary" onClick={handleSetEditMode}>
                        Add schedule
                    </Button>
                </Stack>
            )}
            <ConfirmationDialog
                onConfirmation={handleClear}
                open={confirmClear}
                onCancel={() => setConfirmClear(false)}
                dialogTitle={"Clear schedule"}
            >
                Are you sure you want to clear the schedule?
            </ConfirmationDialog>
            <ConfirmationDialog
                onConfirmation={handleSaveEdit}
                open={editMode}
                onCancel={() => setEditMode(false)}
                dialogTitle={"Edit schedule"}
            >
                <Stack sx={{ minWidth: 500 }} spacing={2}>
                    {!hideDate && (
                        <DatePicker
                            inputFormat={"dd/MM/yyyy"}
                            disablePast
                            value={new Date(scheduleState?.date ?? "")}
                            onChange={handleChangeDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    )}
                    {scheduleState?.date && (
                        <TimeRelationPicker
                            timePrimary={
                                scheduleState?.timePrimary?.substring(0, 5) ??
                                ""
                            }
                            timeSecondary={
                                scheduleState?.timeSecondary?.substring(0, 5) ??
                                ""
                            }
                            relation={
                                (scheduleState?.timeRelation as models.TimeRelation) ??
                                models.TimeRelation.ANYTIME
                            }
                            showOnlyTodayTimes={
                                !hideDate &&
                                new Date(scheduleState.date).getDate() ===
                                    new Date().getDate()
                            }
                            isValid={isValidTime(
                                scheduleState?.timePrimary ?? ""
                            )}
                            isValidSecondary={isValidTime(
                                scheduleState?.timeSecondary ?? ""
                            )}
                            handleChangeTime={(time: string) =>
                                setScheduleState((prevState) => {
                                    if (prevState) {
                                        return {
                                            ...prevState,
                                            timePrimary: time,
                                        };
                                    }
                                    return prevState;
                                })
                            }
                            handleChangeSecondaryTime={(timeSecond: string) =>
                                setScheduleState((prevState) => {
                                    if (prevState) {
                                        return {
                                            ...prevState,
                                            timeSecondary: timeSecond,
                                        };
                                    }
                                    return prevState;
                                })
                            }
                            handleChange={(relation: models.TimeRelation) =>
                                setScheduleState((prevState) => {
                                    if (prevState) {
                                        return {
                                            ...prevState,
                                            timeRelation: relation,
                                        };
                                    }
                                    return prevState;
                                })
                            }
                        />
                    )}
                </Stack>
            </ConfirmationDialog>
        </>
    );
};
