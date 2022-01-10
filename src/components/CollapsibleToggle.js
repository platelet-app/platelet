import React from "react";
import { IconButton, Link, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PropTypes from "prop-types";

function CollapsibleToggle(props) {
    return (
        <Stack
            alignItems={"center"}
            justifyContent={"flex-start"}
            direction={"row"}
        >
            <IconButton onClick={props.onClick} size="large">
                {props.value ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
            <Link
                href="#"
                onClick={(e) => {
                    props.onClick(e);
                    e.preventDefault();
                }}
                color="inherit"
            >
                {props.value ? "Expand to see more" : "Show less"}
            </Link>
        </Stack>
    );
}

CollapsibleToggle.propTypes = {
    value: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
};

CollapsibleToggle.defaultProps = { onClick: () => {} };

export default CollapsibleToggle;
