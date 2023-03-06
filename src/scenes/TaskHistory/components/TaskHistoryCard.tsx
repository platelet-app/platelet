import { Task } from "../../../API";
import { Box, Chip, Grid, Paper, Stack } from "@mui/material";
import TaskStatusChip from "./TaskStatusChip";
import UserChip from "../../../components/UserChip";
import TaskHistoryCardLocationDetail from "./TaskHistoryCardLocationDetail";

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
                    <Grid direction="row" container spacing={1}>
                        <Grid item>
                            <TaskStatusChip status={task.status} />
                        </Grid>
                        {task.priority && (
                            <Grid item>
                                <Chip size="small" label={task.priority} />
                            </Grid>
                        )}
                        {task.riderResponsibility && (
                            <Grid item>
                                <Chip
                                    size="small"
                                    label={task.riderResponsibility}
                                />
                            </Grid>
                        )}
                        {task.assignees?.items?.map((assignment) => {
                            if (assignment?.assignee) {
                                return (
                                    <Grid item>
                                        <UserChip
                                            size="small"
                                            user={assignment?.assignee}
                                        />
                                    </Grid>
                                );
                            } else {
                                return <></>;
                            }
                        })}
                    </Grid>
                    <TaskHistoryCardLocationDetail
                        location={task.pickUpLocation}
                    />
                    <TaskHistoryCardLocationDetail
                        location={task.dropOffLocation}
                    />
                </Box>
            </Stack>
        </Paper>
    );
};

export default TaskHistoryCard;
