import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import LabelItemPair from "../../../components/LabelItemPair";
import ClickableTextField from "../../../components/ClickableTextField";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import { Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { showHide, ThemedLink } from "../../../styles/common";
import { encodeUUID } from "../../../utilities";
import ClearButtonWithConfirmation from "./ClearButtonWithConfirmation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "@material-ui/core/Link";

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
    const [presetMode, setPresetMode] = useState(false);
    const { show, hide } = showHide();
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

    function onFieldFinished() {
        props.onChange(state);
    }

    function onSelectPreset(value) {
        props.onSelectPreset(value);
        setPresetMode(false);
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
    if (props.location && props.location.listed) {
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

    const presetSelect = props.displayPresets ? (
        <Grid item>
            <Grid
                container
                spacing={1}
                justify={"space-between"}
                alignItems={"center"}
                direction={"row"}
            >
                <Grid item>
                    {presetMode ? (
                        <FavouriteLocationsSelect
                            label={props.label}
                            onSelect={onSelectPreset}
                        />
                    ) : (
                        locationTitle
                    )}
                </Grid>
                <Grid item>
                    <Grid
                        container
                        direction={"row"}
                        justify={"flex-end"}
                        alignItems={"center"}
                    >
                        <Grid
                            className={
                                props.location && props.location.listed
                                    ? show
                                    : hide
                            }
                            item
                        >
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
                        </Grid>
                        <Grid
                            className={
                                props.location && !props.disableClear
                                    ? show
                                    : hide
                            }
                            item
                        >
                            <ClearButtonWithConfirmation
                                label={props.label}
                                disabled={props.disabled}
                                onClear={onClickClearButton}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid className={!!!props.location ? show : hide} item>
                    <Button
                        onClick={() => {
                            setPresetMode(!presetMode);
                        }}
                        variant={"contained"}
                        color={"primary"}
                    >
                        {presetMode ? "Cancel" : "Search"}
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    ) : (
        <></>
    );

    const collapsedShowFields = ["ward", "what3words", "postcode", "line1"];

    return (
        <div className={classes.root}>
            <Grid
                container
                spacing={1}
                className={props.className}
                direction={"column"}
            >
                <Grid item>
                    <Grid container direction={"row"} justify={"space-between"}>
                        <Grid item>
                            <Typography variant={"h6"}>
                                {props.label}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Divider />
                </Grid>
                {presetSelect}
                <Grid item>
                    {Object.entries(addressFields).map(([key, label]) => {
                        if (collapsedShowFields.includes(key) || !collapsed) {
                            return (
                                <LabelItemPair label={label}>
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
                            return <></>;
                        }
                    })}

                    <div className={classes.separator} />
                    <div className={props.showContact ? show : hide}>
                        {Object.entries(contactFields).map(([key, label]) => {
                            if (!collapsed) {
                                return (
                                    <LabelItemPair label={label}>
                                        <ClickableTextField
                                            label={label}
                                            disabled={protectedLocation}
                                            onFinished={(v) => {
                                                setState((prevState) => ({
                                                    ...prevState,
                                                    contact: {
                                                        ...state.contact,
                                                        [key]: v,
                                                    },
                                                }));
                                                props.onChange({ [key]: v });
                                            }}
                                            value={state.contact[key]}
                                        />
                                    </LabelItemPair>
                                );
                            } else {
                                return <></>;
                            }
                        })}
                    </div>
                </Grid>
                <Grid item>
                    <Divider />
                </Grid>
                <Grid item>
                    <Grid
                        container
                        alignItems={"center"}
                        justify={"flex-start"}
                        direction={"row"}
                    >
                        <Grid item>
                            <IconButton
                                onClick={() =>
                                    setCollapsed((prevState) => !prevState)
                                }
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Link
                                href="#"
                                onClick={(e) => {
                                    setCollapsed((prevState) => !prevState);
                                    e.preventDefault();
                                }}
                                color="inherit"
                            >
                                {collapsed ? "Expand to see more" : "Show less"}
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

LocationDetailAndSelector.propTypes = {
    label: PropTypes.string,
    location: PropTypes.object,
    onSelectPreset: PropTypes.func,
    className: PropTypes.string,
    displayPresets: PropTypes.bool,
    onChange: PropTypes.func,
    disableClear: PropTypes.bool,
    onClear: PropTypes.func,
    onEditPreset: PropTypes.func,
    showContact: PropTypes.bool,
};

LocationDetailAndSelector.defaultProps = {
    label: "",
    displayPresets: true,
    disableClear: false,
    location: null,
    onSelectPreset: () => {},
    onChange: () => {},
    onClear: () => {},
    onEditPreset: () => {},
    showContact: false,
};

export default LocationDetailAndSelector;
