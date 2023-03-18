import { Paper, Stack, Typography } from "@mui/material";
import { AddressAndContactDetails } from "../../../API";
import TaskHistoryLabelItemPair from "./TaskHistoryLabelItemPair";

type TaskHistoryTaskDialogRequesterContactProps = {
    requesterContact: AddressAndContactDetails;
};

const TaskHistoryTaskDialogRequesterContact: React.FC<
    TaskHistoryTaskDialogRequesterContactProps
> = ({ requesterContact }) => {
    return (
        <Paper>
            <Stack direction="column" spacing={1}>
                <TaskHistoryLabelItemPair label="Name">
                    <Typography>{requesterContact.name || ""}</Typography>
                </TaskHistoryLabelItemPair>
                <TaskHistoryLabelItemPair label="telephoneNumber">
                    <Typography>
                        {requesterContact.telephoneNumber || ""}
                    </Typography>
                </TaskHistoryLabelItemPair>
            </Stack>
        </Paper>
    );
};

export default TaskHistoryTaskDialogRequesterContact;
