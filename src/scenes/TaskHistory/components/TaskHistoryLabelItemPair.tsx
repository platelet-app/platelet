import { Stack, Typography } from "@mui/material";

type TaskHistoryLabelItemPairProps = {
    label: string;
    children: React.ReactNode;
};

const TaskHistoryLabelItemPair: React.FC<TaskHistoryLabelItemPairProps> = ({
    label,
    children,
}) => {
    return (
        <Stack direction="row" justifySelf="center" alignItems="space-between">
            <Typography>{label}</Typography>
            {children}
        </Stack>
    );
};

export default TaskHistoryLabelItemPair;
