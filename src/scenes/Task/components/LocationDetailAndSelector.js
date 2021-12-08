import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import LabelItemPair from "../../../components/LabelItemPair";
import ClickableTextField from "../../../components/ClickableTextField";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";
import makeStyles from "@mui/styles/makeStyles";
import Divider from "@mui/material/Divider";
import { Box, Stack, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { ThemedLink } from "../../../styles/common";
import { encodeUUID } from "../../../utilities";
import ClearButtonWithConfirmation from "./ClearButtonWithConfirmation";
import CollapsibleToggle from "../../../components/CollapsibleToggle";

const useStyles = makeStyles({
    root: {
        maxWidth: "350px",
    },
    button: {
        height: 9,
    },
    label: {
        maxWidth: "250px",
    },
    separator: {
        height: 10,
    },
});

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
    telephoneNumber: "Tel",
    emailAddress: "Email",
    name: "Name",
};

function LocationDetailAndSelector(props) {
    const classes = useStyles();
    const [state, setState] = useState(initialState);
    const [protectedLocation, setProtectedLocation] = useState(false);
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
            setProtectedLocation(
                props.location ? props.location.protected : false
            );
            if (props.location.contact) {
                result = {
                    ...result,
                    contact: { ...result.contact, ...props.location.contact },
                };
            }
            setState(result);
            setProtectedLocation(!!props.location.listed);
        } else {
            setState(initialState);
            setProtectedLocation(false);
        }
    }

    useEffect(updateStateFromProps, [props.location]);

    function onSelectPreset(value) {
        props.onSelectPreset(value);
    }

    function onClickEditButton() {
        props.onEditPreset({ ...state.address, contact: state.contact });
    }
    function onClickClearButton() {
        props.onClear();
    }

    const presetName =
        props.location && props.location.name ? props.location.name : "";
    const locationLink =
        props.location && props.location.id
            ? `/location/${encodeUUID(props.location.id)}`
            : "";

    let locationTitle = <></>;
    if (props.location && !!props.location.listed) {
        locationTitle = (
            <ThemedLink to={locationLink}>
                <Typography noWrap className={classes.label}>
                    {presetName}
                </Typography>
            </ThemedLink>
        );
    } else if (props.location && !!!props.location.listed) {
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
            {!props.location ? (
                <FavouriteLocationsSelect onSelect={onSelectPreset} />
            ) : (
                locationTitle
            )}
            <Stack
                direction={"row"}
                justifyContent={"flex-end"}
                alignItems={"center"}
            >
                {props.location && props.location.listed ? (
                    <Tooltip title={"Edit"}>
                        <IconButton
                            className={classes.button}
                            edge={"end"}
                            disabled={props.disabled}
                            onClick={onClickEditButton}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <></>
                )}
                {props.location && !props.disableClear ? (
                    <ClearButtonWithConfirmation
                        label={props.label}
                        disabled={props.disabled}
                        onClear={onClickClearButton}
                    />
                ) : (
                    <></>
                )}
            </Stack>
        </Stack>
    ) : (
        <></>
    );

    const collapsedShowFields = ["ward", "what3words", "postcode", "line1"];

    return (
        <Box className={classes.root}>
            <Stack spacing={1} className={props.className} direction={"column"}>
                {presetSelect}
                <Stack direction={"column"}>
                    {Object.entries(addressFields).map(([key, label]) => {
                        if (collapsedShowFields.includes(key) || !collapsed) {
                            return (
                                <LabelItemPair
                                    key={key}
                                    label={collapsed ? label : ""}
                                >
                                    <ClickableTextField
                                        label={label}
                                        disabled={protectedLocation}
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
                            );
                        } else {
                            return <React.Fragment key={key}></React.Fragment>;
                        }
                    })}

                    <Box className={classes.separator} />
                    {props.showContact ? (
                        <Box>
                            {Object.entries(contactFields).map(
                                ([key, label]) => {
                                    if (!collapsed) {
                                        return (
                                            <LabelItemPair
                                                key={key}
                                                label={label}
                                            >
                                                <ClickableTextField
                                                    label={label}
                                                    tel={
                                                        key ===
                                                        "telephoneNumber"
                                                    }
                                                    disabled={protectedLocation}
                                                    onFinished={(v) => {
                                                        setState(
                                                            (prevState) => ({
                                                                ...prevState,
                                                                contact: {
                                                                    ...state.contact,
                                                                    [key]: v,
                                                                },
                                                            })
                                                        );
                                                        props.onChangeContact({
                                                            [key]: v,
                                                        });
                                                    }}
                                                    value={state.contact[key]}
                                                />
                                            </LabelItemPair>
                                        );
                                    } else {
                                        return (
                                            <React.Fragment
                                                key={key}
                                            ></React.Fragment>
                                        );
                                    }
                                }
                            )}
                        </Box>
                    ) : (
                        <></>
                    )}
                </Stack>
                <Divider />
                <CollapsibleToggle
                    onClick={() => setCollapsed((prevState) => !prevState)}
                    value={collapsed}
                />
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
    onEditPreset: PropTypes.func,
    showContact: PropTypes.bool,
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
    onEditPreset: () => {},
    showContact: false,
};

export default LocationDetailAndSelector;
