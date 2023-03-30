import { Divider, Paper, Stack, Typography } from "@mui/material";
import { AddressAndContactDetails, Location } from "../../../API";
import TaskHistoryLabelItemPair from "./TaskHistoryLabelItemPair";

type TaskHistoryTaskDialogRequesterContactProps = {
    requesterContact: AddressAndContactDetails;
    establishment?: Location | null;
};

const TaskHistoryTaskDialogRequesterContact: React.FC<
    TaskHistoryTaskDialogRequesterContactProps
> = ({ requesterContact, establishment }) => {
    return (
        <Paper
            sx={{
                borderRadius: "1em",
                padding: 1,
            }}
        >
            <Stack direction="column" spacing={1}>
                <Typography variant="h5">Caller details</Typography>
                <Divider />
                {establishment && (
                    <TaskHistoryLabelItemPair label="Establishment">
                        <Typography noWrap>{establishment.name}</Typography>
                    </TaskHistoryLabelItemPair>
                )}
                <TaskHistoryLabelItemPair label="Name">
                    <Typography noWrap>
                        {requesterContact.name || ""}
                    </Typography>
                </TaskHistoryLabelItemPair>
                <TaskHistoryLabelItemPair label="Telephone">
                    <Typography noWrap>
                        {requesterContact.telephoneNumber || ""}
                    </Typography>
                </TaskHistoryLabelItemPair>
            </Stack>
        </Paper>
    );
};

export default TaskHistoryTaskDialogRequesterContact;
