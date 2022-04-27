import { Paper, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import PropTypes from "prop-types";
import CommentAuthor from "./CommentAuthor";

function EditCommentDialog(props) {
    const [state, setState] = useState("");
    useEffect(() => {
        setState(props.value);
    }, [props.value]);
    return (
        <ConfirmationDialog
            open={props.open}
            onClose={props.onClose}
            onConfirmation={() => {
                props.onConfirm(state);
            }}
        >
            <Paper sx={{ padding: 2 }} elevation={10}>
                <Stack
                    direction="column"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={1}
                >
                    <CommentAuthor
                        disableLink
                        uuid={props.author && props.author.id}
                        displayName={props.author && props.author.displayName}
                        thumbnailKey={
                            props.author && props.author.profilePictureThumbnail
                                ? props.author.profilePictureThumbnail.key
                                : null
                        }
                    />
                    <TextField
                        aria-label="edit-comment"
                        multiline
                        inputProps={{ "data-testid": "edit-comment-textbox" }}
                        value={state}
                        onChange={(e) => {
                            setState(e.target.value);
                        }}
                    />
                </Stack>
            </Paper>
        </ConfirmationDialog>
    );
}

EditCommentDialog.propTypes = {
    value: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default EditCommentDialog;
