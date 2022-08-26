import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import PropTypes from "prop-types";
import * as queries from "../../graphql/queries";
import { API, graphqlOperation } from "aws-amplify";

function UserFeedbackDialog({ open, fullScreen, onClose }) {
    const [state, setState] = React.useState({
        email: "",
        body: "",
    });

    const sendFeedback = React.useCallback((emailAddress, body) => {
        const input = {
            emailAddress,
            body,
        };
        API.graphql(graphqlOperation(queries.sendUserFeedback, input));
    }, []);

    return (
        <Dialog open={open} fullScreen={fullScreen} onClose={onClose}>
            <DialogTitle>Send feedback</DialogTitle>
            <DialogContent>
                <Stack>
                    <TextField
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
                    <Button aria-label="Cancel" onClick={onClose} autoFocus>
                        Cancel
                    </Button>
                    <IconButton
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
