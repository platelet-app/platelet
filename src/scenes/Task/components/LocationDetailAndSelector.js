import React, { useEffect, useRef, useState } from "react";
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

const useStyles = makeStyles((theme) => ({
    root: {},
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
    const [editMode, setEditMode] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const initialSetEdit = useRef(false);

    useEffect(() => {
        if (!initialSetEdit.current) {
            initialSetEdit.current = true;
            setEditMode(!!!props.location);
        }
    }, [props.location]);

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

    function onSelectPreset(value) {
        props.onSelectPreset(value);
        setEditMode(false);
    }

    function onClickClearButton() {
        props.onClear();
        setEditMode(true);
    }

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
                {!!props.location && (
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
                {!!!props.location && (
                    <Typography className={classes.hint}>
                        Search the directory or click a field to enter manually
                    </Typography>
                )}
                {presetSelect}
                <Stack direction={"column"}>
                    {Object.entries(addressFields).map(([key, label]) => {
                        if (collapsedShowFields.includes(key) || !collapsed) {
                            return (
                                <LabelItemPair
                                    key={key}
                                    label={collapsed || editMode ? label : ""}
                                >
                                    <ClickableTextField
                                        label={label}
                                        disabled={!editMode}
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
                    <Box>
                        {Object.entries(contactFields).map(([key, label]) => {
                            if (!collapsed) {
                                return (
                                    <LabelItemPair key={key} label={label}>
                                        <ClickableTextField
                                            label={label}
                                            tel={key === "telephoneNumber"}
                                            disabled={!editMode}
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
                                );
                            } else {
                                return (
                                    <React.Fragment key={key}></React.Fragment>
                                );
                            }
                        })}
                    </Box>
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
