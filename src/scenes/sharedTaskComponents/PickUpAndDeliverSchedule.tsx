import * as React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import {
    Button,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import TimeRelationPicker from "./TimeRelationPicker";
import { useTheme } from "@mui/material/styles";
import * as models from "../../models";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { calculateBetweenIsOneDay } from "../../utilities/calculateBetweenIsOneDay";
import { DatePicker } from "@mui/lab";
import moment from "moment";

export enum ScheduledDatePickerOption {
    TODAY = "Today",
    TOMORROW = "Tomorrow",
    CUSTOM = "Custom",
}

type PickUpAndDeliverScheduleProps = {
    title?: string;
    onConfirm: (value: Schedule | null) => void;
    initialSchedule?: Schedule | null;
    open?: boolean;
    handleClose?: () => void;
    handleOpen?: () => void;
};

const isValidTime = (time?: string | null) => {
    if (!time) return false;
    const [hours, minutes] = time.split(":").map((value) => parseInt(value));
    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
};

export type Schedule = {
    timeRelation: models.TimeRelation;
    timePrimary?: string;
    timeSecondary?: string | null;
    date?: Date | null;
};

const calculateDefaultTimes = () => {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    let defaultTime = "10:00";
    let defaultSecondTime = "10:00";
    if (currentMinute > 30) {
        const paddedHour = (currentHour + 1).toString().padStart(2, "0");
        defaultTime = `${paddedHour}:00`;
        defaultSecondTime = `${paddedHour}:30`;
    } else if (currentMinute > 0) {
        const paddedHour = currentHour.toString().padStart(2, "0");
        const secondPaddedHour = new Date(new Date().getTime() + 60 * 60000)
            .getHours()
            .toString()
            .padStart(2, "0");
        defaultTime = `${paddedHour}:30`;
        defaultSecondTime = `${secondPaddedHour}:00`;
    }
    return {
        timePrimary: defaultTime,
        timeSecondary: defaultSecondTime,
    };
};

const humanReadableSchedule = (schedule: Schedule) => {
    let result = "";
    if (schedule.date) {
        result = moment(schedule.date).calendar(null, {
            sameDay: "[Today]",
            nextDay: "[Tomorrow]",
            nextWeek: "dddd",
            lastDay: "[Yesterday]",
            lastWeek: "[Last] dddd",
            sameElse: "DD/MM/YYYY",
        });
    }
    switch (schedule.timeRelation) {
        case models.TimeRelation.ANYTIME:
            result += " at any time";
            break;
        case models.TimeRelation.BEFORE:
            result += " before";
            break;
        case models.TimeRelation.AFTER:
            result += " after";
            break;
        case models.TimeRelation.AT:
            result += " at";
            break;
        case models.TimeRelation.BETWEEN:
            result += " between";
            break;
    }
    if (
        schedule.timePrimary &&
        ![models.TimeRelation.ANYTIME, models.TimeRelation.BETWEEN].includes(
            schedule.timeRelation
        )
    ) {
        result += ` ${schedule.timePrimary}`;
    }
    if (
        schedule.timeSecondary &&
        schedule.timePrimary &&
        schedule.timeRelation === models.TimeRelation.BETWEEN
    ) {
        result += ` ${schedule.timePrimary}`;
        result += ` and ${schedule.timeSecondary}`;
    }
    return result + ".";
};

const PickUpAndDeliverSchedule: React.FC<PickUpAndDeliverScheduleProps> = ({
    title,
    onConfirm,
    initialSchedule = null,
    open,
    handleClose,
    handleOpen,
}) => {
    const defaultTimes = calculateDefaultTimes();
    const [state, setState] = React.useState<Schedule | null>(
        initialSchedule || {
            date: new Date(),
            timeRelation: models.TimeRelation.ANYTIME,
            timePrimary: defaultTimes.timePrimary,
            timeSecondary: defaultTimes.timeSecondary,
        }
    );

    const handleConfirm = () => {
        onConfirm(state);
        handleClose && handleClose();
    };

    const handleClear = () => {
        onConfirm(null);
    };

    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.down("md"));

    const handleTimeRelationChange = (value: models.TimeRelation) => {
        setState((prevState) => ({
            ...prevState,
            timeRelation: value,
        }));
    };

    const handleChangeTime = (value: string) => {
        setState((prevState) => ({
            ...prevState,
            timePrimary: value,
            timeRelation:
                prevState?.timeRelation || models.TimeRelation.ANYTIME,
        }));
    };

    const handleChangeSecondaryTime = (value: string) => {
        setState((prevState) => ({
            ...prevState,
            timeSecondary: value,
            timeRelation:
                prevState?.timeRelation || models.TimeRelation.ANYTIME,
        }));
    };

    const handleSetCustomDate = (date: Date | null) => {
        setState((prevState) => ({
            ...prevState,
            date: date,
            timeRelation:
                prevState?.timeRelation || models.TimeRelation.ANYTIME,
        }));
    };

    const showOnlyTodayTimes = state?.date?.getDate() === new Date().getDate();

    return (
        <>
            <Stack
                direction="row"
                sx={{ width: "100%" }}
                justifyContent="space-between"
                alignItems="center"
            >
                {!initialSchedule && (
                    <>
                        <Typography>No scheduled set.</Typography>
                        <Button onClick={handleOpen}>Add schedule</Button>
                    </>
                )}
                {initialSchedule && (
                    <>
                        <Typography>
                            {humanReadableSchedule(initialSchedule)}
                            {initialSchedule.timeRelation ===
                                models.TimeRelation.BETWEEN &&
                                calculateBetweenIsOneDay(
                                    initialSchedule.timePrimary,
                                    initialSchedule.timeSecondary
                                ) && (
                                    <span style={{ color: "grey" }}>
                                        {" "}
                                        +1 day
                                    </span>
                                )}
                        </Typography>
                        <Stack direction="row">
                            <Tooltip title={"Clear schedule"}>
                                <IconButton onClick={handleClear}>
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={"Edit schedule"}>
                                <IconButton onClick={handleOpen}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </>
                )}
            </Stack>
            <ConfirmationDialog
                fullScreen={isMd}
                open={open}
                onConfirmation={handleConfirm}
                onCancel={handleClose}
                dialogTitle={title}
            >
                <Stack sx={{ minWidth: 500 }} spacing={2}>
                    <DatePicker
                        inputFormat={"dd/MM/yyyy"}
                        disablePast
                        value={state?.date}
                        onChange={(date) => handleSetCustomDate(date ?? null)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <TimeRelationPicker
                        showOnlyTodayTimes={showOnlyTodayTimes}
                        timePrimary={state?.timePrimary ?? ""}
                        timeSecondary={state?.timeSecondary ?? ""}
                        relation={
                            state?.timeRelation ?? models.TimeRelation.ANYTIME
                        }
                        isValid={isValidTime(state?.timePrimary)}
                        isValidSecondary={isValidTime(state?.timeSecondary)}
                        handleChange={(event) =>
                            handleTimeRelationChange(event)
                        }
                        handleChangeTime={(time) => handleChangeTime(time)}
                        handleChangeSecondaryTime={(time) =>
                            handleChangeSecondaryTime(time)
                        }
                    />
                </Stack>
            </ConfirmationDialog>
        </>
    );
};

export default PickUpAndDeliverSchedule;
