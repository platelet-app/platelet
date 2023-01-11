import React from "react";
import PropTypes from "prop-types";
import { Stack, Chip } from "@mui/material";
import * as models from "../models";

function CommentVisibilitySelector(props) {
    return (
        <Stack direction="row" spacing={1}>
            <Chip
                variant={
                    props.value === models.CommentVisibility.EVERYONE
                        ? "default"
                        : "outlined"
                }
                color={
                    props.value === models.CommentVisibility.EVERYONE
                        ? "primary"
                        : "default"
                }
                onClick={() =>
                    props.onChange(models.CommentVisibility.EVERYONE)
                }
                label={"EVERYONE"}
            />
            <Chip
                variant={
                    props.value === models.CommentVisibility.ME
                        ? "default"
                        : "outlined"
                }
                color={
                    props.value === models.CommentVisibility.ME
                        ? "primary"
                        : "default"
                }
                onClick={() => props.onChange(models.CommentVisibility.ME)}
                label={"ONLY ME"}
            />
        </Stack>
    );
}

CommentVisibilitySelector.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default CommentVisibilitySelector;
