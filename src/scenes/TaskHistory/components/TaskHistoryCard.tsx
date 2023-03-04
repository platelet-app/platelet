import { Task } from "../../../API";
import { Box, Chip, Grid, Paper, Stack } from "@mui/material";

type TaskHistoryCardProps = {
    task: Task;
};

const TaskHistoryCard: React.FC<TaskHistoryCardProps> = ({ task }) => {
    return (
        <Paper
            sx={{ padding: 2, minHeight: 100, maxWidth: 800, borderRadius: 4 }}
        >
            <Stack spacing={1}>
                <Box>
                    <Grid direction="row" container spacing={2}>
                        <Grid item>
                            <Chip label={task.status} />
                        </Grid>
                        {task.priority && (
                            <Grid item>
                                <Chip label={task.priority} />
                            </Grid>
                        )}
                        {task.riderResponsibility && (
                            <Grid item>
                                <Chip label={task.riderResponsibility} />
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Stack>
        </Paper>
    );
};

export default TaskHistoryCard;
