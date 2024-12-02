import * as React from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import TimeRelationPicker from "./TimeRelationPicker";
import ScheduledDatePicker from "./ScheduledDatePicker";

export enum ScheduledDatePickerOption {
    TODAY = "Today",
    TOMORROW = "Tomorrow",
    CUSTOM = "Custom",
}

const PickUpAndDeliverSchedule = () => {
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const [selectionPickUpState, setSelectionPickUpState] =
        React.useState<ScheduledDatePickerOption | null>(null);
    const [customPickUpDate, setCustomPickUpDate] = React.useState<Date | null>(
        null
    );

    const handleSetPickUpState = (selection: ScheduledDatePickerOption) => {
        if (selectionPickUpState === selection) setSelectionPickUpState(null);
        else setSelectionPickUpState(selection);
        if (
            selection === ScheduledDatePickerOption.CUSTOM &&
            customPickUpDate === null
        )
            setCustomPickUpDate(new Date());
    };

    const [selectionDropOffState, setSelectionDropOffState] =
        React.useState<ScheduledDatePickerOption | null>(null);
    const [customDropOffDate, setCustomDropOffDate] =
        React.useState<Date | null>(null);

    const handleSetDropOffState = (selection: ScheduledDatePickerOption) => {
        if (selectionDropOffState === selection) setSelectionDropOffState(null);
        else setSelectionDropOffState(selection);
        if (
            selection === ScheduledDatePickerOption.CUSTOM &&
            customDropOffDate === null
        )
            setCustomDropOffDate(new Date());
    };

    return (
        <>
            <Stack
                direction="row"
                sx={{ width: "100%" }}
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography>No scheduled set.</Typography>
                <Button onClick={() => setDialogOpen(true)}>
                    Add schedule
                </Button>
            </Stack>
            <Dialog open={dialogOpen}>
                <DialogTitle>Add schedule</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <Paper
                            sx={{
                                display: "flex",
                                gap: 1,
                                flexDirection: "column",
                                padding: 2,
                                borderRadius: "1em",
                            }}
                        >
                            <Typography variant="h6">Pick up</Typography>
                            <ScheduledDatePicker
                                onSelectOption={handleSetPickUpState}
                                option={selectionPickUpState}
                                onSelectCustomDate={setCustomPickUpDate}
                                customDate={customPickUpDate}
                            />
                            {selectionPickUpState && <TimeRelationPicker />}
                        </Paper>
                        <Paper
                            sx={{
                                display: "flex",
                                gap: 1,
                                flexDirection: "column",
                                padding: 2,
                                borderRadius: "1em",
                            }}
                        >
                            <Typography variant="h6">Drop off</Typography>
                            <ScheduledDatePicker
                                onSelectOption={handleSetDropOffState}
                                option={selectionDropOffState}
                                onSelectCustomDate={setCustomDropOffDate}
                                customDate={customDropOffDate}
                            />
                            {selectionDropOffState && <TimeRelationPicker />}
                        </Paper>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => setDialogOpen(false)}>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PickUpAndDeliverSchedule;
