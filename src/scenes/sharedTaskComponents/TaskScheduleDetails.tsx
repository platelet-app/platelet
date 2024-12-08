import * as React from "react";
import * as models from "../../models";
import {
    Box,
    Button,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EditIcon from "@mui/icons-material/Edit";
import humanReadableScheduleString from "../../utilities/humanReadableScheduleString";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import ClearIcon from "@mui/icons-material/Clear";
import TimeRelationPicker from "./TimeRelationPicker";
import { DatePicker } from "@mui/lab";

const isValidTime = (time: string) => {
    const [hours, minutes] = time.split(":").map((value) => parseInt(value));
    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
};

const isDueInOneHour = (schedule?: models.Schedule | null) => {
    if (!schedule) {
        return false;
    }
    const now = new Date();
    const scheduleDate = new Date(schedule?.date ?? "");
    scheduleDate.setUTCHours(parseInt(schedule.time?.split(":")[0] ?? "0"));
    scheduleDate.setUTCMinutes(parseInt(schedule.time?.split(":")[1] ?? "0"));
    scheduleDate.setUTCHours(scheduleDate.getUTCHours() - 1);

    if (scheduleDate < now) {
        return true;
    }
    return false;
};

const isOverDue = (schedule?: models.Schedule | null) => {
    if (!schedule) {
        return false;
    }
    const now = new Date();
    const scheduleDate = new Date(schedule?.date ?? "");
    scheduleDate.setUTCHours(parseInt(schedule.time?.split(":")[0] ?? "0"));
    scheduleDate.setUTCMinutes(parseInt(schedule.time?.split(":")[1] ?? "0"));
    if (scheduleDate < now) {
        return true;
    }
    return false;
};

type TaskScheduleDetailsProps = {
    schedule: models.Schedule | null;
    onClear: () => void;
    onChange: (value: models.Schedule) => void;
};

type TaskScheduleDetailsState = {
    time?: string | null;
    timeRelation?: models.TimeRelation | null;
    date?: Date | null;
};

const TaskScheduleDetails: React.FC<TaskScheduleDetailsProps> = ({
    schedule,
    onClear,
    onChange,
}) => {
    const [confirmClear, setConfirmClear] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [scheduleState, setScheduleState] =
        React.useState<TaskScheduleDetailsState | null>(null);

    const handleClear = () => {
        onClear();
        setConfirmClear(false);
    };

    const handleSetEditMode = () => {
        if (schedule) {
            setScheduleState({
                time: schedule?.time || "10:00",
                timeRelation:
                    (schedule?.relation as models.TimeRelation | null) ??
                    models.TimeRelation.ANYTIME,
                date: new Date(schedule?.date ?? ""),
            });
        } else {
            setScheduleState({
                time: "10:00",
                timeRelation: models.TimeRelation.ANYTIME,
                date: new Date(),
            });
        }
        setEditMode(true);
    };

    const handleSaveEdit = () => {
        if (scheduleState) {
            const { time, timeRelation, date } = scheduleState;
            let result = {};
            if (time) {
                if (timeRelation === models.TimeRelation.ANYTIME) {
                    result = { ...result, time: null };
                } else {
                    const timeDate = new Date();
                    timeDate.setHours(parseInt(time.split(":")[0]));
                    timeDate.setMinutes(parseInt(time.split(":")[1]));
                    const newTime = timeDate.toISOString().split("T")[1];
                    result = { ...result, time: newTime };
                }
            }
            if (date) {
                const newDate = date.toISOString().split("T")[0];
                result = { ...result, date: newDate };
            }
            if (timeRelation) {
                result = { ...result, relation: timeRelation };
            }
            onChange(result);
            setEditMode(false);
        }
    };

    const handleChangeDate = (date: Date | null) => {
        setScheduleState((prevState) => {
            if (prevState) {
                return { ...prevState, date };
            }
            return prevState;
        });
    };

    let iconColor = "";
    if (isDueInOneHour(schedule)) {
        iconColor = "orange";
    }
    if (isOverDue(schedule)) {
        iconColor = "red";
    }

    return (
        <>
            {schedule && (
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={1}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <ScheduleIcon sx={{ color: iconColor }} />
                        <Typography sx={{ fontWeight: "bold" }}>
                            {humanReadableScheduleString(schedule)}
                        </Typography>
                    </Box>
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
                        <IconButton onClick={handleSetEditMode}>
                            <EditIcon />
                        </IconButton>
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
                    <DatePicker
                        inputFormat={"dd/MM/yyyy"}
                        disablePast
                        value={new Date(scheduleState?.date ?? "")}
                        onChange={handleChangeDate}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    {scheduleState?.date && (
                        <TimeRelationPicker
                            time={scheduleState?.time?.substring(0, 5) ?? ""}
                            relation={
                                (scheduleState?.timeRelation as models.TimeRelation) ??
                                models.TimeRelation.ANYTIME
                            }
                            isValid={isValidTime(scheduleState?.time ?? "")}
                            handleChangeTime={(time: string) =>
                                setScheduleState((prevState) => {
                                    if (prevState) {
                                        return { ...prevState, time };
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

export default TaskScheduleDetails;
