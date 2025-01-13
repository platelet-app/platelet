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
import EditIcon from "@mui/icons-material/Edit";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import ClearIcon from "@mui/icons-material/Clear";
import TimeRelationPicker from "./TimeRelationPicker";
import { DatePicker } from "@mui/lab";
import TaskScheduleIconText from "./TaskScheduleIconText";
import moment from "moment";

const isValidTime = (time: string) => {
    const [hours, minutes] = time.split(":").map((value) => parseInt(value));
    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
};

type TaskScheduleDetailsProps = {
    schedule: models.Schedule | null;
    onClear: () => void;
    onChange: (value: models.Schedule) => void;
    noWarning?: boolean;
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
    noWarning = true,
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
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        let defaultTime = "10:00";
        if (currentMinute > 30) {
            const paddedHour = (currentHour + 1).toString().padStart(2, "0");
            defaultTime = `${paddedHour}:00`;
        } else if (currentMinute > 0) {
            const paddedHour = currentHour.toString().padStart(2, "0");
            defaultTime = `${paddedHour}:30`;
        }

        if (schedule) {
            setScheduleState({
                time:
                    moment(schedule?.timePrimary).format("HH:mm") ||
                    defaultTime,
                timeRelation:
                    (schedule?.relation as models.TimeRelation | null) ??
                    models.TimeRelation.ANYTIME,
                date: new Date(schedule?.timePrimary ?? ""),
            });
        } else {
            setScheduleState({
                time: defaultTime,
                timeRelation: models.TimeRelation.ANYTIME,
                date: new Date(),
            });
        }
        setEditMode(true);
    };

    const handleSaveEdit = () => {
        if (scheduleState) {
            const { time, timeRelation, date } = scheduleState;
            const timePrimaryDate = new Date(date ?? "");
            timePrimaryDate.setHours(parseInt(time?.split(":")[0] ?? "0"));
            timePrimaryDate.setMinutes(parseInt(time?.split(":")[1] ?? "0"));
            const timePrimary = timePrimaryDate.toISOString();
            let result = {};
            result = { ...result, timePrimary, relation: timeRelation };
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
