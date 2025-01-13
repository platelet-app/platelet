import * as React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import {
    Button,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import TimeRelationPicker from "./TimeRelationPicker";
import ScheduledDatePicker from "./ScheduledDatePicker";
import { useTheme } from "@mui/material/styles";
import * as models from "../../models";
import ConfirmationDialog from "../../components/ConfirmationDialog";

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

const isValidTime = (time: string) => {
    const [hours, minutes] = time.split(":").map((value) => parseInt(value));
    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
};

export type Schedule = {
    selectionState?: ScheduledDatePickerOption | null;
    timeRelation: models.TimeRelation;
    time?: string;
    customDate?: Date | null;
};

const humanReadableSchedule = (schedule: Schedule) => {
    let result = "";
    switch (schedule.selectionState) {
        case ScheduledDatePickerOption.TODAY:
            result = "Today";
            break;
        case ScheduledDatePickerOption.TOMORROW:
            result = "Tomorrow";
            break;
        case ScheduledDatePickerOption.CUSTOM:
            result = schedule.customDate?.toDateString() ?? "";
            break;
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
    }
    if (schedule.timeRelation !== models.TimeRelation.ANYTIME) {
        result += ` ${schedule.time}`;
    }
    result += ".";
    return result;
};

const PickUpAndDeliverSchedule: React.FC<PickUpAndDeliverScheduleProps> = ({
    title,
    onConfirm,
    initialSchedule = null,
    open,
    handleClose,
    handleOpen,
}) => {
    const [state, setState] = React.useState<Schedule | null>(initialSchedule);

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
            time: value,
            timeRelation:
                prevState?.timeRelation || models.TimeRelation.ANYTIME,
        }));
    };

    const handleSetCustomDate = (date: Date | null) => {
        setState((prevState) => ({
            ...prevState,
            customDate: date,
            timeRelation:
                prevState?.timeRelation || models.TimeRelation.ANYTIME,
        }));
    };

    const handleSetSelectionState = (selection: ScheduledDatePickerOption) => {
        if (state?.selectionState === selection) {
            setState(null);
        } else {
            const currentHour = new Date().getHours();
            const currentMinute = new Date().getMinutes();
            let defaultTime = "10:00";
            if (currentMinute > 30) {
                const paddedHour = (currentHour + 1)
                    .toString()
                    .padStart(2, "0");
                defaultTime = `${paddedHour}:00`;
            } else if (currentMinute > 0) {
                const paddedHour = currentHour.toString().padStart(2, "0");
                defaultTime = `${paddedHour}:30`;
            }
            setState((prevState) => ({
                ...prevState,
                timeRelation:
                    prevState?.timeRelation || models.TimeRelation.ANYTIME,
                customDate: prevState?.customDate || new Date(),
                time: prevState?.time || defaultTime,
                selectionState: selection,
            }));
        }
    };

    //
    // return (
    //     <Stack spacing={2}>
    //         <ScheduledDatePicker
    //             onSelectOption={onSelect}
    //             option={selectionState}
    //             onSelectCustomDate={(date) => onSetCustomDate(date)}
    //             customDate={customDate}
    //         />
    //         {selectionState && (
    //             <TimeRelationPicker
    //                 time={time ?? ""}
    //                 relation={timeRelation ?? models.TimeRelation.ANYTIME}
    //                 isValid={isValidTime(time ?? "")}
    //                 handleChange={(event) => onTimeRelationChange(event)}
    //                 handleChangeTime={(time) => onChangeTime(time)}
    //             />
    //         )}
    //     </Stack>
    // );

    const showOnlyTodayTimes =
        state?.selectionState === ScheduledDatePickerOption.TODAY ||
        state?.customDate?.getDate() === new Date().getDate();

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
                    <ScheduledDatePicker
                        onSelectOption={handleSetSelectionState}
                        option={state?.selectionState ?? null}
                        onSelectCustomDate={(date) => handleSetCustomDate(date)}
                        customDate={state?.customDate}
                    />
                    {state?.selectionState && (
                        <TimeRelationPicker
                            showOnlyTodayTimes={showOnlyTodayTimes}
                            time={state?.time ?? ""}
                            relation={
                                state?.timeRelation ??
                                models.TimeRelation.ANYTIME
                            }
                            isValid={isValidTime(state?.time ?? "")}
                            handleChange={(event) =>
                                handleTimeRelationChange(event)
                            }
                            handleChangeTime={(time) => handleChangeTime(time)}
                        />
                    )}
                </Stack>
            </ConfirmationDialog>
        </>
    );
};

export default PickUpAndDeliverSchedule;
