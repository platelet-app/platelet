import React from "react";
import { API } from "aws-amplify";
import * as models from "../../../models";
import { Box, Button, Tooltip } from "@mui/material";
import * as mutations from "../../../graphql/mutations";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { useDispatch, useSelector } from "react-redux";
import { getWhoami } from "../../../redux/Selectors";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

type EnableDisableUserProps = {
    user: models.User;
};

enum Action {
    ENABLE,
    DISABLE,
}

const EnableDisableUser: React.FC<EnableDisableUserProps> = ({ user }) => {
    const dispatch = useDispatch();
    const [isPosting, setIsPosting] = React.useState(false);
    const [action, setAction] = React.useState<Action | null>(null);
    const whoami = useSelector(getWhoami);
    const isAdmin = whoami?.roles.includes(models.Role.ADMIN);
    const errorMessage = "Sorry, something went wrong";

    const handleConfirm = React.useCallback(async () => {
        setIsPosting(true);
        setAction(null);
        try {
            if (action === Action.DISABLE) {
                await API.graphql({
                    query: mutations.disableUser,
                    variables: {
                        userId: user.id,
                    },
                });
            } else if (action === Action.ENABLE) {
                await API.graphql({
                    query: mutations.enableUser,
                    variables: {
                        userId: user.id,
                    },
                });
            }
        } catch (error) {
            dispatch(displayErrorNotification(errorMessage));
            console.log(error);
        } finally {
            setIsPosting(false);
        }
    }, [dispatch, user.id, action]);

    const confirmationDialog = (
        <ConfirmationDialog
            onCancel={() => setAction(null)}
            open={action !== null}
            onConfirmation={handleConfirm}
        >
            Are you sure you want to{" "}
            {action === Action.ENABLE ? "enable" : "disable"} this user?
        </ConfirmationDialog>
    );

    const handleEnable = () => {
        setAction(Action.ENABLE);
    };

    const handleDisable = () => {
        setAction(Action.DISABLE);
    };

    if (!isAdmin) {
        return null;
    } else if (user.disabled === 1) {
        return (
            <>
                <Box>
                    <Tooltip title="Enable this user">
                        <Button
                            variant="outlined"
                            disabled={isPosting}
                            onClick={handleEnable}
                            color="success"
                        >
                            Enable
                        </Button>
                    </Tooltip>
                </Box>
                {confirmationDialog}
            </>
        );
    } else {
        return (
            <>
                <Box>
                    <Tooltip title="Disable this user">
                        <Button
                            variant="outlined"
                            disabled={isPosting}
                            onClick={handleDisable}
                            color="error"
                        >
                            Disable
                        </Button>
                    </Tooltip>
                </Box>
                {confirmationDialog}
            </>
        );
    }
};

export default EnableDisableUser;
