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
        <>
            <TaskHistoryTaskDialogSummary task={task} />
            {requesterContact && (
                <TaskHistoryTaskDialogRequesterContact
                    requesterContact={requesterContact}
                />
            )}
            <Accordion>
                <AccordionSummary
                    sx={{
                        "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                    }}
                    expandIcon={<ExpandCircleDownIcon />}
                >
                    <Typography>Timeline/Comments</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TaskHistoryTimeline task={task} />
                </AccordionDetails>
            </Accordion>
        </>
    );
};

export default TaskHistoryTaskDialogContent;
