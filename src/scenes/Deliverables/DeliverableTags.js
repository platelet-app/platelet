import React from "react";
import PropTypes from "prop-types";
import { Chip, Grid } from "@mui/material";

export default function DeliverableTags(props) {
    return (
        <Grid container spacing={1} direction="row">
            <Grid key={"all"} item>
                <Chip
                    label={"All"}
                    onClick={() => {
                        props.onSelect(null);
                    }}
                    variant={props.value ? "outlined" : "filled"}
                />
            </Grid>
            {props.tags.map((tag) => (
                <Grid key={tag} item>
                    <Chip
                        label={tag}
                        color={props.value === tag ? "primary" : "default"}
                        onClick={() => {
                            if (tag === props.value) {
                                props.onSelect(null);
                            } else {
                                props.onSelect(tag);
                            }
                        }}
                        variant={props.value === tag ? "filled" : "outlined"}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

DeliverableTags.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.string,
    onSelect: PropTypes.func,
};

DeliverableTags.defaultProps = {
    tags: [],
    value: null,
    onSelect: () => {},
};
