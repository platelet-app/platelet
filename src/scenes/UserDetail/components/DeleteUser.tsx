import React from "react";
import { API } from "aws-amplify";
import * as models from "../../../models";
import { Button, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { mutations } from "@platelet-app/graphql";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { Redirect } from "react-router";
import { useDispatch } from "react-redux";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";

type DeleteUserProps = {
    user: models.User;
};
const DeleteUser: React.FC<DeleteUserProps> = ({ user }) => {
    const [confirmationDialogOpen, setConfirmationDialogOpen] =
        React.useState(false);
    const [confirmText, setConfirmText] = React.useState("");
    const [userDeleted, setUserDeleted] = React.useState(false);
    const [isPosting, setIsPosting] = React.useState(false);
    const dispatch = useDispatch();

    const disabled = user.disabled === 1;

    const confirmDisabled = confirmText !== "delete" || isPosting;

    const handlerDeleteUser = async () => {
        try {
            setIsPosting(true);
            const variables = { userId: user.id };
            await API.graphql({
                query: mutations.adminDeleteUser,
                variables,
            });
            dispatch(displayInfoNotification("User deleted."));
            setUserDeleted(true);
        } catch {
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        } finally {
            setIsPosting(false);
        }
    };

    const handleOpenConfirmation = () => {
        setConfirmationDialogOpen(true);
    };

    const handleChangeConfirmText = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = event.target;
        setConfirmText(value);
    };

    if (userDeleted) {
        return <Redirect to="/users" />;
    }

    const tooltipMessage = !disabled ? "User must be disabled first" : "";

    return (
        <>
            <Tooltip title={tooltipMessage}>
                <span>
                    <Button
                        variant="outlined"
                        color="error"
                        disabled={!disabled}
                        onClick={handleOpenConfirmation}
                    >
                        Delete User
                    </Button>
                </span>
            </Tooltip>
            <ConfirmationDialog
                disabled={confirmDisabled}
                onCancel={() => setConfirmationDialogOpen(false)}
                onConfirmation={handlerDeleteUser}
                open={confirmationDialogOpen}
                dialogTitle="Please read this carefully!"
            >
                <Stack spacing={3}>
                    <Stack spacing={1}>
                        <Typography sx={{ fontWeight: "bold" }}>
                            Deleting this user will remove:
                        </Typography>
                        <Typography>
                            - All task assignments for this user
                        </Typography>
                        <Typography>- All comments by this user</Typography>
                        <Typography>- All vehicle assignments</Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                            It may take a few minutes before the user is fully
                            removed.
                        </Typography>
                        <Typography variant="h6">
                            This cannot be undone!
                        </Typography>
                    </Stack>
                    <Stack spacing={1}>
                        <Typography>
                            To confirm enter{" "}
                            {
                                <span
                                    style={{
                                        fontStyle: "italic",
                                        fontWeight: "bold",
                                    }}
                                >
                                    delete
                                </span>
                            }{" "}
                            into the box.
                        </Typography>
                        <TextField
                            disabled={isPosting}
                            placeholder="delete"
                            value={confirmText}
                            onChange={handleChangeConfirmText}
                        />
                    </Stack>
                </Stack>
            </ConfirmationDialog>
        </>
    );
};

export default DeleteUser;
