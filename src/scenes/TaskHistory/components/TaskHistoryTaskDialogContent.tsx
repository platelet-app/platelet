import { Task } from "../../../API";
import TaskHistoryTimeline from "./TaskHistoryTimeline";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TaskHistoryTaskDialogSummary from "./TaskHistoryTaskDialogSummary";
import TaskHistoryTaskDialogRequesterContact from "./TaskHistoryTaskDialogRequesterContact";
import { Paper, Stack } from "@mui/material";
import TaskHistoryTaskDialogLocation from "./TaskHistoryTaskDialogLocation";

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "1em",
}));

type TaskHistoryTaskDialogContentProps = {
    task: Task;
};

const TaskHistoryTaskDialogContent: React.FC<
    TaskHistoryTaskDialogContentProps
> = ({ task }) => {
    const { requesterContact } = task;
    return (
        <Stack spacing={2}>
            <TaskHistoryTaskDialogSummary task={task} />
            {requesterContact && (
                <TaskHistoryTaskDialogRequesterContact
                    requesterContact={requesterContact}
                    establishment={task.establishmentLocation}
                />
            )}
            <Paper sx={{ borderRadius: "1em", padding: 1 }}>
                <TaskHistoryTimeline task={task} />
            </Paper>
            {task.pickUpLocation && (
                <TaskHistoryTaskDialogLocation
                    location={task.pickUpLocation}
                    title="Collect from"
                />
            )}
            {task.dropOffLocation && (
                <TaskHistoryTaskDialogLocation
                    location={task.dropOffLocation}
                    title="Deliver to"
                />
            )}
        </Stack>
    );
};

export default TaskHistoryTaskDialogContent;
