import { Chip, Grid } from "@mui/material";

export enum TaskOverViewTabValues {
    OVERVIEW = "Overview",
    HANDOVERS = "Route/Handovers",
}

type TaskOverviewTabsProps = {
    selectedTab: TaskOverViewTabValues;
    onChange: (value: TaskOverViewTabValues) => void;
};

const TaskOverViewTabs: React.FC<TaskOverviewTabsProps> = ({
    selectedTab,
    onChange,
}) => {
    const handleClick = (value: TaskOverViewTabValues) => {
        onChange(value);
    };
    return (
        <Grid container direction="row" spacing={1}>
            {Object.values(TaskOverViewTabValues).map((tab) => (
                <Grid item key={tab}>
                    <Chip
                        variant={selectedTab === tab ? "filled" : "outlined"}
                        color={selectedTab === tab ? "primary" : "default"}
                        key={tab}
                        label={tab}
                        onClick={() => handleClick(tab)}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default TaskOverViewTabs;
