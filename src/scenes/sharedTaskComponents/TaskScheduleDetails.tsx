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
import { Schedule } from "./PickUpAndDeliverSchedule";
import { convertScheduleToTaskData } from "../../utilities/convertScheduleToTaskData";
import useIsPaidSubscription from "../../hooks/useIsPaidSubscription";

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

const TaskScheduleDetails: React.FC<TaskScheduleDetailsProps> = ({
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
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        let defaultTime = "10:00";
        let defaultSecondTime = "10:30";
        if (currentMinute > 30) {
            const paddedHour = (currentHour + 1).toString().padStart(2, "0");
            defaultTime = `${paddedHour}:00`;
            defaultSecondTime = `${paddedHour}:30`;
        } else if (currentMinute > 0) {
            const paddedHour = currentHour.toString().padStart(2, "0");
            const secondPaddedHour = new Date(new Date().getTime() + 30 * 60000)
                .getHours()
                .toString()
                .padStart(2, "0");
            defaultTime = `${paddedHour}:30`;
            defaultSecondTime = `${secondPaddedHour}:00`;
        }

        if (schedule) {
            setScheduleState({
                timePrimary:
                    moment(schedule?.timePrimary).format("HH:mm") ||
                    defaultTime,
                timeSecondary:
                    moment(schedule?.timeSecondary).format("HH:mm") ||
                    defaultSecondTime,
                timeRelation:
                    (schedule?.relation as models.TimeRelation | null) ??
                    models.TimeRelation.ANYTIME,
                date: new Date(schedule?.timePrimary ?? ""),
            });
        } else {
            let date = new Date();
            if (hideDate) {
                date = new Date("2099-01-01");
            }
            setScheduleState({
                timePrimary: defaultTime,
                timeSecondary: defaultSecondTime,
                timeRelation: models.TimeRelation.ANYTIME,
                date,
            });
        }
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

export default TaskScheduleDetails;
