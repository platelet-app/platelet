import React from "react";
import PropTypes from "prop-types";
import { commentVisibility } from "../apiConsts";
import { Stack, Chip } from "@mui/material";

function CommentVisibilitySelector(props) {
    return (
        <Stack direction="row" spacing={1}>
            <Chip
                variant={
                    props.value === commentVisibility.everyone
                        ? "default"
                        : "outlined"
                }
                color={
                    props.value === commentVisibility.everyone
                        ? "primary"
                        : "default"
                }
                onClick={() => props.onChange(commentVisibility.everyone)}
                label={"EVERYONE"}
            />
            <Chip
                variant={
                    props.value === commentVisibility.me
                        ? "default"
                        : "outlined"
                }
                color={
                    props.value === commentVisibility.me ? "primary" : "default"
                }
                onClick={() => props.onChange(commentVisibility.me)}
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
