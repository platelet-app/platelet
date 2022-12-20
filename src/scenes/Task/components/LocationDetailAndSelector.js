import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import LabelItemPair from "../../../components/LabelItemPair";
import ClickableTextField from "../../../components/ClickableTextField";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";
import makeStyles from "@mui/styles/makeStyles";
import Divider from "@mui/material/Divider";
import { Box, Stack, Tooltip } from "@mui/material";
import { ThemedLink } from "../../../styles/common";
import { encodeUUID } from "../../../utilities";
import ClearButtonWithConfirmation from "../../../components/ClearButtonWithConfirmation";
import CollapsibleToggle from "../../../components/CollapsibleToggle";

const useStyles = makeStyles((theme) => ({
    root: {},
    label: {
        width: "90%",
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

const initialState = {
    address: {
        what3words: "",
        ward: "",
        line1: "",
        line2: "",
        town: "",
        county: "",
        postcode: "",
    },
    contact: {
        telephoneNumber: "",
        emailAddress: "",
        name: "",
    },
};

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

function LocationDetailAndSelector(props) {
    const classes = useStyles();
    const [state, setState] = useState(initialState);
    const [collapsed, setCollapsed] = useState(true);

    function updateStateFromProps() {
        if (props.location) {
            let result = { ...initialState };
            if (props.location) {
                result = {
                    ...result,
                    address: { ...props.location },
                };
            }
            if (props.location.contact) {
                result = {
                    ...result,
                    contact: { ...result.contact, ...props.location.contact },
                };
            }
            setState(result);
        } else {
            setState(initialState);
        }
    }

    useEffect(updateStateFromProps, [props.location]);

    const presetName =
        props.location && props.location.name ? props.location.name : "";
    const locationLink =
        props.location && props.location.id
            ? `/location/${encodeUUID(props.location.id)}`
            : "";

    let locationTitle = <></>;
    if (props.location && !props.noLink && !!props.location.listed) {
        locationTitle = (
            <ThemedLink to={locationLink}>
                <Typography noWrap className={classes.label}>
                    {presetName}
                </Typography>
            </ThemedLink>
        );
    } else if (props.location && (props.noLink || !!!props.location.listed)) {
        locationTitle = (
            <Typography noWrap className={classes.label}>
                {presetName}
            </Typography>
        );
    }

    if (presetName.length > 35) {
        locationTitle = <Tooltip title={presetName}>{locationTitle}</Tooltip>;
    }

    const presetSelect = props.displayPresets ? (
        <Stack
            justifyContent={"space-between"}
            alignItems={"center"}
            direction={"row"}
        >
            {!props.location || props.editMode ? (
                <FavouriteLocationsSelect onSelect={props.onSelectPreset} />
            ) : (
                locationTitle
            )}
        </Stack>
    ) : (
        <></>
    );

    const collapsedShowFields = ["ward", "postcode", "line1"];
    const collapsedShowContactFields = ["telephoneNumber"];

    return (
        <Box className={classes.root}>
            <Stack spacing={1} className={props.className} direction={"column"}>
                {!!!props.location && (
                    <Typography className={classes.hint}>
                        Search the directory or click a field to enter manually
                    </Typography>
                )}
                {presetSelect}
                <Stack direction={"column"}>
                    {Object.entries(addressFields).map(([key, label]) => {
                        return (
                            (collapsedShowFields.includes(key) ||
                                !collapsed) && (
                                <LabelItemPair
                                    key={key}
                                    label={
                                        collapsed || props.editMode ? label : ""
                                    }
                                >
                                    <ClickableTextField
                                        label={label}
                                        disabled={!props.editMode}
                                        onFinished={(v) => {
                                            setState((prevState) => ({
                                                ...prevState,
                                                address: {
                                                    ...state.address,
                                                    [key]: v,
                                                },
                                            }));
                                            props.onChange({ [key]: v });
                                        }}
                                        value={state.address[key]}
                                    />
                                </LabelItemPair>
                            )
                        );
                    })}

                    {!collapsed && <Box className={classes.separator} />}
                    <Box>
                        {Object.entries(contactFields).map(([key, label]) => {
                            return (
                                (collapsedShowContactFields.includes(key) ||
                                    !collapsed) && (
                                    <LabelItemPair key={key} label={label}>
                                        <ClickableTextField
                                            label={label}
                                            tel={key === "telephoneNumber"}
                                            disabled={!props.editMode}
                                            onFinished={(v) => {
                                                setState((prevState) => ({
                                                    ...prevState,
                                                    contact: {
                                                        ...state.contact,
                                                        [key]: v,
                                                    },
                                                }));
                                                props.onChangeContact({
                                                    [key]: v,
                                                });
                                            }}
                                            value={state.contact[key]}
                                        />
                                    </LabelItemPair>
                                )
                            );
                        })}
                    </Box>
                </Stack>
                <Divider />
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <CollapsibleToggle
                        onClick={() => setCollapsed((prevState) => !prevState)}
                        value={collapsed}
                    />
                    {props.location && !props.disableClear && props.editMode && (
                        <ClearButtonWithConfirmation
                            disabled={props.disabled}
                            onClear={props.onClear}
                        >
                            <Typography>
                                Are you sure you want to clear the {props.label}{" "}
                                location?
                            </Typography>
                        </ClearButtonWithConfirmation>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
}

LocationDetailAndSelector.propTypes = {
    label: PropTypes.string,
    location: PropTypes.object,
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

LocationDetailAndSelector.defaultProps = {
    label: "Search locations",
    displayPresets: true,
    disableClear: false,
    location: null,
    onSelectPreset: () => {},
    onChange: () => {},
    onChangeContact: () => {},
    onClear: () => {},
    onEdit: () => {},
    showContact: true,
    noLink: false,
};

export default LocationDetailAndSelector;
