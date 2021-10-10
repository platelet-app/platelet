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
        telephone_number: "",
        email_address: "",
        name: "",
    },
};

function LocationDetailAndSelector(props) {
    const classes = useStyles();
    const [state, setState] = useState(initialState);
    const [protectedLocation, setProtectedLocation] = useState(false);
    const [presetMode, setPresetMode] = useState(false);
    const { show, hide } = showHide();

    function updateStateFromProps() {
        if (props.location) {
            let result = { ...initialState };
            if (props.location.address) {
                result = {
                    ...result,
                    address: { ...result.address, ...props.location.address },
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
            console.log(result);
            setState(result);
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
        props.onEditPreset(state);
    }
    function onClickClearButton() {
        props.onClear();
    }

    const presetName =
        props.location && props.location.name ? props.location.name : "";
    const locationLink =
        props.location && props.location.uuid
            ? `/location/${encodeUUID(props.location.uuid)}`
            : "";

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
                        <ThemedLink to={locationLink}>
                            <Typography noWrap className={classes.label}>
                                {presetName}
                            </Typography>
                        </ThemedLink>
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
                                props.location && props.location.protected
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
                    <LabelItemPair label={"w3w"}>
                        <ClickableTextField
                            label={"w3w"}
                            disabled={protectedLocation}
                            onFinished={(v) => {
                                const result = {
                                    ...state,
                                    address: {
                                        ...state.address,
                                        what3words: v,
                                    },
                                };
                                setState(result);
                                props.onChange(result);
                            }}
                            value={state.address.what3words}
                        />
                    </LabelItemPair>
                    <LabelItemPair label={"Ward"}>
                        <ClickableTextField
                            label="ward"
                            disabled={protectedLocation}
                            onFinished={(v) => {
                                const result = {
                                    ...state,
                                    address: { ...state.address, ward: v },
                                };
                                setState(result);
                                props.onChange(result);
                            }}
                            value={state.address.ward}
                        />
                    </LabelItemPair>
                    <LabelItemPair label={"Line1"}>
                        <ClickableTextField
                            label={"line1"}
                            disabled={protectedLocation}
                            onFinished={(v) => {
                                const result = {
                                    ...state,
                                    address: { ...state.address, line1: v },
                                };
                                setState(result);
                                props.onChange(result);
                            }}
                            value={state.address.line1}
                        />
                    </LabelItemPair>
                    <LabelItemPair label={"Line2"}>
                        <ClickableTextField
                            label={"line2"}
                            disabled={protectedLocation}
                            onFinished={(v) => {
                                const result = {
                                    ...state,
                                    address: { ...state.address, line2: v },
                                };
                                setState(result);
                                props.onChange(result);
                            }}
                            value={state.address.line2}
                        />
                    </LabelItemPair>
                    <LabelItemPair label={"Town"}>
                        <ClickableTextField
                            label={"town"}
                            disabled={protectedLocation}
                            onFinished={(v) => {
                                const result = {
                                    ...state,
                                    address: { ...state.address, town: v },
                                };
                                setState(result);
                                props.onChange(result);
                            }}
                            value={state.address.town}
                        />
                    </LabelItemPair>
                    <LabelItemPair label={"County"}>
                        <ClickableTextField
                            label={"county"}
                            disabled={protectedLocation}
                            onFinished={(v) => {
                                const result = {
                                    ...state,
                                    address: { ...state.address, county: v },
                                };
                                setState(result);
                                props.onChange(result);
                            }}
                            value={state.address.county}
                        />
                    </LabelItemPair>
                    <LabelItemPair label={"Postcode"}>
                        <ClickableTextField
                            label={"postcode"}
                            disabled={protectedLocation}
                            onFinished={(v) => {
                                const result = {
                                    ...state,
                                    address: { ...state.address, postcode: v },
                                };
                                setState(result);
                                props.onChange(result);
                            }}
                            value={state.address.postcode}
                        />
                    </LabelItemPair>
                    <div className={classes.separator} />
                    <div className={props.showContact ? show : hide}>
                        <LabelItemPair label={"Name"}>
                            <ClickableTextField
                                disabled={protectedLocation}
                                onFinished={(v) => {
                                    const result = {
                                        ...state,
                                        contact: { ...state.contact, name: v },
                                    };
                                    setState(result);
                                    props.onChange(result);
                                }}
                                value={state.contact.name}
                            />
                        </LabelItemPair>
                        <LabelItemPair label={"Telephone"}>
                            <ClickableTextField
                                disabled={protectedLocation}
                                tel
                                onFinished={(v) => {
                                    const result = {
                                        ...state,
                                        contact: {
                                            ...state.contact,
                                            telephone_number: v,
                                        },
                                    };
                                    setState(result);
                                    props.onChange(result);
                                }}
                                value={state.contact.telephone_number}
                            />
                        </LabelItemPair>
                    </div>
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
    location: {
        address: {
            what3words: null,
            ward: null,
            line1: null,
            line2: null,
            town: null,
            county: null,
            postcode: null,
        },
        contact: {
            name: null,
            telephone_number: null,
            email_address: null,
        },
    },
    onSelectPreset: () => {},
    onChange: () => {},
    onClear: () => {},
    onEditPreset: () => {},
    showContact: false,
};

export default LocationDetailAndSelector;
