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
import { useDispatch } from "react-redux";
import { User } from "@platelet-app/models";
import { styled } from "@mui/styles";

type TakeOutUserDataProps = {
    user: User;
};

const RoundedDialog = styled(Dialog)(({ fullScreen }) => ({
    "& .MuiDialog-paper": {
        borderRadius: fullScreen ? "0em" : "1em",
    },
}));

const TakeOutUserData: React.FC<TakeOutUserDataProps> = ({ user }) => {
    const [isPosting, setIsPosting] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const dispatch = useDispatch();

    const handleTakeOutData = async () => {
        try {
            setIsPosting(true);
            const variables = { userId: user.id };
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
                    <Typography>
                        You can receive a copy of your data stored on the
                        system.
                    </Typography>
                    <Typography>
                        It will be sent to your registered email address.
                    </Typography>
                    <Typography>
                        Please allow up to one hour for your data to arrive.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isPosting} onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleTakeOutData}>Send my data</Button>
                </DialogActions>
            </RoundedDialog>
        </>
    );
};

export default TakeOutUserData;
