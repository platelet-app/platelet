import React from "react";
import * as models from "../../../models";
import { Box, Button, Tooltip } from "@mui/material";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { useDispatch, useSelector } from "react-redux";
import { getWhoami } from "../../../redux/Selectors";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { DataStore } from "aws-amplify";

type EnableDisableLocationProps = {
    location: models.Location;
};

enum Action {
    ENABLE,
    DISABLE,
}

const EnableDisableLocation: React.FC<EnableDisableLocationProps> = ({
    location,
}) => {
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
            const existingLocation = await DataStore.query(
                models.Location,
                location.id
            );
            if (!existingLocation) {
                throw new Error("Location not found");
            }
            const value = action === Action.ENABLE ? 0 : 1;
            await DataStore.save(
                models.Location.copyOf(existingLocation, (updated) => {
                    updated.disabled = value;
                })
            );
        } catch (error) {
            dispatch(displayErrorNotification(errorMessage));
            console.log(error);
        } finally {
            setIsPosting(false);
        }
    }, [dispatch, location.id, action]);

    const confirmationDialog = (
        <ConfirmationDialog
            onCancel={() => setAction(null)}
            open={action !== null}
            onConfirmation={handleConfirm}
        >
            Are you sure you want to{" "}
            {action === Action.ENABLE ? "enable" : "disable"} this location?
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
    } else if (location.disabled === 1) {
        return (
            <>
                <Box>
                    <Tooltip title="Enable this location">
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
                    <Tooltip title="Disable this location">
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

export default EnableDisableLocation;
