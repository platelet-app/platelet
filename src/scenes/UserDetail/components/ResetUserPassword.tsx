import React from "react";
import * as models from "../../../models";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { API } from "aws-amplify";
import * as mutations from "../../../graphql/mutations";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";

type ResetUserPasswordProps = {
    user: models.User;
};

const ResetUserPassword: React.FC<ResetUserPasswordProps> = ({ user }) => {
    const dispatch = useDispatch();
    const [isPosting, setIsPosting] = React.useState(false);
    const [confirmation, setConfirmation] = React.useState(false);
    const errorMessage = "Sorry, something went wrong";

    const onClick = async () => {
        setConfirmation(true);
    };

    const onConfirm = async () => {
        setConfirmation(false);
        setIsPosting(true);
        try {
            await API.graphql({
                query: mutations.resetUserPassword,
                variables: {
                    userId: user.id,
                },
            });
            setIsPosting(false);
            setConfirmation(false);
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <Box>
            <Button
                disabled={isPosting || user.disabled === 1}
                variant="outlined"
                color="error"
                onClick={onClick}
            >
                Reset Password
            </Button>
            <ConfirmationDialog
                dialogTitle="Reset Password?"
                onConfirmation={onConfirm}
                onCancel={() => setConfirmation(false)}
                open={confirmation}
            >
                <Stack spacing={1}>
                    <Typography>
                        Are you sure you want to reset the password for{" "}
                        {user.displayName} and send them a new welcome email?
                    </Typography>
                    <Typography fontWeight="bold">
                        This should only be used when a user has an expired
                        password.
                    </Typography>
                    <Typography>
                        Normal password reset should be done through the
                        forgotten password link on the login page.
                    </Typography>
                </Stack>
            </ConfirmationDialog>
        </Box>
    );
};

export default ResetUserPassword;
