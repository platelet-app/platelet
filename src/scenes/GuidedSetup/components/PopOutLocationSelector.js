import React, { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import _ from "lodash";
import PropTypes from "prop-types";
import LabelItemPair from "../../../components/LabelItemPair";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";
import makeStyles from "@mui/styles/makeStyles";
import Divider from "@mui/material/Divider";
import { Box, Button, Stack, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ClearButtonWithConfirmation from "../../../components/ClearButtonWithConfirmation";
import CollapsibleToggle from "../../../components/CollapsibleToggle";
import PopOutLocationSelectorForm from "./PopoutLocationSelectorForm";
import { protectedFields } from "../../../apiConsts";

const useStyles = makeStyles((theme) => ({
    label: {
        maxWidth: "250px",
    },
    separator: {
        height: 10,
    },
    hint: {
        fontStyle: "italic",
        fontSize: 15,
        color: "gray",
        "&:hover": {
            color: theme.palette.text.primary,
        },
    },
}));

const addressFields = {
    what3words: "what3words",
    ward: "Ward",
    line1: "Line one",
    line2: "Line two",
    town: "Town",
    county: "County",
    country: "Country",
    postcode: "Postcode",
};

const contactFields = {
    name: "Name",
    telephoneNumber: "Telephone",
};

function PopOutLocationSelector(props) {
    const classes = useStyles();
    const [state, setState] = useState(null);
    const oldState = useRef(null);
    const [editMode, setEditMode] = useState(false);
    const [collapsed, setCollapsed] = useState(true);

    function onSelectPreset(value) {
        setState(value);
        props.onChange(value);
    }

    function onClickClearButton() {
        setState(null);
    }

    useEffect(() => {
        if (props.override) {
            setState((prevState) => {
                oldState.current = prevState;
                return props.override;
            });
        } else {
            setState(oldState.current);
        }
    }, [props.override]);

    function handleConfirmation(value) {
        if (_.isEqual(state, value)) {
            setEditMode(false);
            return;
        }
        if (!state) {
            setState(value);
            props.onChange(value);
        } else {
            let name = state.name;
            if (state.listed === 1) {
                name = `${name} (edited)`;
            }
            const result = _.omit(
                { ...value, name, listed: 0 },
                ...protectedFields
            );
            setState(result);
            props.onChange(result);
        }
        setEditMode(false);
    }

    const presetName = state && state.name ? state.name : "";

    let locationTitle = <></>;
    if (state) {
        locationTitle = (
            <Typography noWrap className={classes.label}>
                {presetName}
            </Typography>
        );
    }

    if (presetName.length > 30) {
        locationTitle = <Tooltip title={presetName}>{locationTitle}</Tooltip>;
    }

    const presetSelect = props.displayPresets ? (
        <Stack
            justifyContent={"space-between"}
            alignItems={"center"}
            direction={"row"}
        >
            {!state ? (
                <Stack
                    spacing={1}
                    alignItems="flex-end"
                    sx={{ width: "100%" }}
                    direction="column"
                >
                    <FavouriteLocationsSelect
                        size="large"
                        onSelect={onSelectPreset}
                    />
                    <Button
                        aria-label={`${props.label} not listed?`}
                        onClick={() => setEditMode(true)}
                    >
                        Not listed?
                    </Button>
                </Stack>
            ) : (
                locationTitle
            )}
            <Stack
                direction={"row"}
                justifyContent={"flex-end"}
                alignItems={"center"}
            >
                {state && (
                    <Tooltip title={"Edit"}>
                        <IconButton
                            aria-label={"Edit"}
                            size={"small"}
                            disabled={props.disabled}
                            onClick={() =>
                                setEditMode((prevState) => !prevState)
                            }
                        >
                            <EditIcon
                                color={editMode ? "secondary" : "inherit"}
                            />
                        </IconButton>
                    </Tooltip>
                )}
            </Stack>
        </Stack>
    ) : (
        <></>
    );

    const collapsedShowFields = ["ward", "postcode", "line1"];
    const collapsedShowContactFields = ["telephoneNumber"];

    return (
        <Box className={classes.root}>
            <Stack spacing={1} className={props.className} direction={"column"}>
                {!props.override && presetSelect}
                {state && (
                    <>
                        <Stack direction={"column"}>
                            {Object.entries(addressFields).map(
                                ([key, label]) => {
                                    return (
                                        (collapsedShowFields.includes(key) ||
                                            !collapsed) && (
                                            <LabelItemPair
                                                key={key}
                                                label={label}
                                            >
                                                <Typography>
                                                    {state && state[key]}
                                                </Typography>
                                            </LabelItemPair>
                                        )
                                    );
                                }
                            )}

                            {!collapsed && (
                                <Box className={classes.separator} />
                            )}
                            <Box>
                                {Object.entries(contactFields).map(
                                    ([key, label]) => {
                                        return (
                                            (collapsedShowContactFields.includes(
                                                key
                                            ) ||
                                                !collapsed) && (
                                                <LabelItemPair
                                                    key={key}
                                                    label={label}
                                                >
                                                    <Typography>
                                                        {state &&
                                                            state.contact &&
                                                            state.contact[key]}
                                                    </Typography>
                                                </LabelItemPair>
                                            )
                                        );
                                    }
                                )}
                            </Box>
                        </Stack>
                        <Divider />
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <CollapsibleToggle
                                onClick={() =>
                                    setCollapsed((prevState) => !prevState)
                                }
                                value={collapsed}
                            />
                            {state && !props.disableClear && !props.override && (
                                <ClearButtonWithConfirmation
                                    disabled={props.disabled}
                                    onClear={onClickClearButton}
                                >
                                    <Typography>
                                        Are you sure you want to clear the
                                        location?
                                    </Typography>
                                </ClearButtonWithConfirmation>
                            )}
                        </Stack>
                    </>
                )}
            </Stack>
            <PopOutLocationSelectorForm
                open={editMode}
                onConfirmation={handleConfirmation}
                label={`Enter ${props.label}`}
                location={state}
                onCancel={() => setEditMode(false)}
            />
        </Box>
    );
}

PopOutLocationSelector.propTypes = {
    label: PropTypes.string,
    override: PropTypes.object,
    onSelectPreset: PropTypes.func,
    className: PropTypes.string,
    displayPresets: PropTypes.bool,
    onChange: PropTypes.func,
    onChangeContact: PropTypes.func,
    disableClear: PropTypes.bool,
    onClear: PropTypes.func,
    onEdit: PropTypes.func,
    showContact: PropTypes.bool,
    noLink: PropTypes.bool,
};

PopOutLocationSelector.defaultProps = {
    label: "Search locations",
    displayPresets: true,
    disableClear: false,
    override: null,
    onSelectPreset: () => {},
    onChange: () => {},
    onChangeContact: () => {},
    onClear: () => {},
    onEdit: () => {},
    showContact: true,
    noLink: false,
};

export default PopOutLocationSelector;
