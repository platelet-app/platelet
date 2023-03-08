import React from "react";
import { MenuItem, Paper, Select, Stack } from "@mui/material";
import { ModelSortDirection } from "../../../API";
import DaysSelection, { Days } from "../../../components/DaysSelection";
import LoadingSpinner from "../../../components/LoadingSpinner";

type TaskHistoryControlsProps = {
    sortDirection: "DESC" | "ASC";
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
    const [days, setDays] = React.useState<Days | null>(Days.THREE_DAYS);
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
    return (
        <Paper
            sx={{
                borderRadius: 4,
                maxWidth: 1200,
                padding: 1,
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1}>
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
                <DaysSelection value={days} onChange={handleChangeDays} />
                {isFetching && <LoadingSpinner delay={800} progress={0} />}
            </Stack>
        </Paper>
    );
};

export default TaskHistoryControls;
