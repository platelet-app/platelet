import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    useMediaQuery,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import PropTypes from "prop-types";
import * as queries from "../../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";
import { useTheme } from "@mui/styles";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../redux/notifications/NotificationsActions";
import { useDispatch } from "react-redux";
import { useCordovaBackButton } from "../../hooks/useCordovaBackButton";

const initialState = {
    email: "",
    body: "",
};

function UserFeedbackDialog({ open, onClose }) {
    const [state, setState] = React.useState(initialState);
    const [isPosting, setIsPosting] = React.useState(false);

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const dispatch = useDispatch();

    const handleFinished = React.useCallback(() => {
        setState((prevState) => ({ ...prevState, body: "" }));
        onClose();
    }, [onClose]);

    useCordovaBackButton(handleFinished, open);

    const sendFeedback = React.useCallback(
        (emailAddress, body) => {
            setIsPosting(true);
            emailAddress = emailAddress || null;
            const input = {
                emailAddress,
                body,
            };
            API.graphql(graphqlOperation(queries.sendUserFeedback, input))
                .then(() => {
                    dispatch(
                        displayInfoNotification("Thanks for your feedback!")
                    );
                    setIsPosting(false);
                    handleFinished();
                })
                .catch((e) => {
                    console.log("Failed to send feedback:", e);
                    dispatch(
                        displayErrorNotification("Sorry, something went wrong")
                    );
                    setIsPosting(false);
                });
        },
        [dispatch, handleFinished]
    );

    return (
        <Dialog open={open} fullScreen={isSm} onClose={onClose}>
            <DialogTitle>Send feedback</DialogTitle>
            <DialogContent>
                <Stack
                    sx={{ minWidth: !isSm ? 400 : 0, marginTop: 1 }}
                    spacing={3}
                >
                    <TextField
                        fullWidth
                        label="Email (optional)"
                        onChange={(e) => {
                            const { value } = e.target;
                            setState((prevState) => ({
                                ...prevState,
                                email: value,
                            }));
                        }}
                        inputProps={{
                            "aria-label": "email address",
                        }}
                        value={state.email}
                    />
                    <TextField
                        fullWidth
                        label="Body"
                        onChange={(e) => {
                            const { value } = e.target;
                            setState((prevState) => ({
                                ...prevState,
                                body: value,
                            }));
                        }}
                        inputProps={{
                            "aria-label": "feedback body",
                        }}
                        value={state.body}
                        multiline
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack
                    direction="row"
                    sx={{ width: "100%" }}
                    justifyContent="space-between"
                >
                    <Button
                        aria-label="Cancel"
                        onClick={handleFinished}
                        autoFocus
                    >
                        Cancel
                    </Button>
                    <IconButton
                        disabled={isPosting || !!!state.body}
                        onClick={() => sendFeedback(state.email, state.body)}
                        aria-label="send feedback"
                    >
                        <SendIcon />
                    </IconButton>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}

UserFeedbackDialog.propTypes = {
    open: PropTypes.bool,
    fullScreen: PropTypes.bool,
    onClose: PropTypes.func,
};
UserFeedbackDialog.defaultProps = {
    open: false,
    fullScreen: false,
    onClose: () => {},
};

export default UserFeedbackDialog;
