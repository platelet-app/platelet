import React from "react";
import {
    Chip,
    Grid,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import { ModelSortDirection } from "../../../API";
import DaysSelection, { Days } from "../../../components/DaysSelection";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { DateRangePicker, DateRange } from "@mui/lab";

type TaskHistoryControlsProps = {
    sortDirection: ModelSortDirection;
    setSortDirection: (sortDirection: ModelSortDirection) => void;
    setDateRange(startDate: Date, endDate: Date): void;
    isFetching: boolean;
};

const TaskHistoryControls: React.FC<TaskHistoryControlsProps> = ({
    sortDirection,
    setSortDirection,
    setDateRange,
    isFetching,
}) => {
    const [days, setDays] = React.useState<Days | null>(null);
    const [customRange, setCustomRange] = React.useState(false);
    const [customDaysRange, setCustomDaysRange] = React.useState<
        DateRange<Date>
    >([new Date(), new Date()]);

    const handleChangeDays = (newDays: Days) => {
        if (days === newDays) {
            setDays(null);
            setDateRange(new Date("2000-01-01"), new Date());
        } else {
            setDays(newDays);
            const startDate = new Date("2000-01-01");
            const endDate = new Date();
            endDate.setDate(endDate.getDate() - newDays);
            setDateRange(startDate, endDate);
        }
    };

    const handleDateChange = (newDateRange: DateRange<Date>) => {
        setCustomDaysRange(newDateRange);
        if (newDateRange[0] && newDateRange[1]) {
            setDateRange(newDateRange[0], newDateRange[1]);
        }
    };

    const handleChangeToCustom = () => {
        setDays(null);
        if (customRange) {
            setCustomRange(false);
            setDateRange(new Date("2000-01-01"), new Date());
        } else {
            setCustomRange(true);
            setCustomDaysRange([new Date(), new Date()]);
            setDateRange(new Date(), new Date());
        }
    };

    return (
        <Paper
            sx={{
                borderRadius: 4,
                maxWidth: 1200,
                padding: 1,
            }}
        >
            <Stack
                sx={{ minHeight: 80 }}
                direction="row"
                alignItems="center"
                spacing={1}
            >
                <Select
                    sx={{
                        width: 200,
                        borderRadius: 2,
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "orange",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "orange",
                        },
                    }}
                    size="small"
                    value={sortDirection}
                >
                    <MenuItem
                        value="DESC"
                        onClick={() => {
                            setSortDirection(ModelSortDirection.DESC);
                        }}
                    >
                        Newest
                    </MenuItem>
                    <MenuItem
                        value="ASC"
                        onClick={() => {
                            setSortDirection(ModelSortDirection.ASC);
                        }}
                    >
                        Oldest
                    </MenuItem>
                </Select>
                <Grid container direction="row" alignItems="center" spacing={1}>
                    {!customRange && (
                        <Grid item>
                            <DaysSelection
                                value={days}
                                onChange={handleChangeDays}
                            />
                        </Grid>
                    )}
                    {customRange && (
                        <Grid item>
                            <DateRangePicker
                                startText="From"
                                endText="To"
                                value={customDaysRange}
                                onChange={handleDateChange}
                                renderInput={(startProps, endProps) => (
                                    <Stack spacing={1} direction="row">
                                        <TextField {...startProps} />
                                        <TextField {...endProps} />
                                    </Stack>
                                )}
                            />
                        </Grid>
                    )}
                    <Grid item>
                        <Chip
                            label={"Custom"}
                            variant={customRange ? "filled" : "outlined"}
                            color={customRange ? "primary" : "default"}
                            onClick={handleChangeToCustom}
                        />
                    </Grid>
                </Grid>
                {isFetching && <LoadingSpinner delay={800} progress={0} />}
            </Stack>
        </Paper>
    );
};

export default TaskHistoryControls;
