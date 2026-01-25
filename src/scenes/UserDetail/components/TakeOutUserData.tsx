import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import { API } from "aws-amplify";
import { queries } from "@platelet-app/graphql";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
import { useDispatch, useSelector } from "react-redux";
import { User } from "@platelet-app/models";
import { styled } from "@mui/styles";
import { getWhoami } from "../../../redux/Selectors";

type TakeOutUserDataProps = {
    user?: User | null;
};

const RoundedDialog = styled(Dialog)(({ fullScreen }) => ({
    "& .MuiDialog-paper": {
        borderRadius: fullScreen ? "0em" : "1em",
    },
}));

const TakeOutUserData: React.FC<TakeOutUserDataProps> = ({ user }) => {
    const [isPosting, setIsPosting] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const whoami = useSelector(getWhoami);
    const dispatch = useDispatch();

    const notSelf = whoami?.id !== user?.id;

    console.log(whoami?.id, user?.id);

    const handleTakeOutData = async () => {
        if (!user) return;
        try {
            setIsPosting(true);
            const variables = { userId: user?.id };
            await API.graphql({
                query: queries.userTakeOutData,
                variables,
            });
            dispatch(displayInfoNotification("Request successful."));
            setDialogOpen(false);
        } catch {
            dispatch(displayErrorNotification("Sorry, something went wrong."));
        } finally {
            setIsPosting(false);
        }
    };

    const handleCancel = () => {
        setDialogOpen(false);
    };

    if (!user) {
        return null;
    }

    let message = `You can request a copy of your data stored on the
system.

It will be sent to your registered email address.

Please allow up to one hour for your data to arrive.
`;

    if (notSelf) {
        message = `If a user has requested to take out their data, you can have their data sent to them.

It will be sent to the registered email address on their account.

It could take up to an hour to arrive.
`;
    }

    return (
        <>
            <Button
                variant="outlined"
                disabled={isPosting}
                onClick={() => {
                    setDialogOpen(true);
                }}
            >
                Take out data
            </Button>
            <RoundedDialog open={dialogOpen}>
                <DialogTitle>Take out your data</DialogTitle>
                <DialogContent>
                    <Typography whiteSpace="pre-line">{message}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button disabled={isPosting} onClick={handleTakeOutData}>
                        Send my data
                    </Button>
                </DialogActions>
            </RoundedDialog>
        </>
    );
};

export default TakeOutUserData;
