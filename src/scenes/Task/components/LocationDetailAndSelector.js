import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types"
import LabelItemPair from "../../../components/LabelItemPair";
import ClickableTextField from "../../../components/ClickableTextField";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import {Tooltip} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import {showHide, ThemedLink} from "../../../styles/common";
import {encodeUUID} from "../../../utilities";


const useStyles = makeStyles({
    root: {
        maxWidth: "350px",
    },
    button: {
        height: 9,
    },
    label: {
        maxWidth: "250px"
    }
})

const initialState = {
    what3words: "",
    ward: "",
    line1: "",
    line2: "",
    town: "",
    county: "",
    postcode: ""
}

function LocationDetailAndSelector(props) {
    const classes = useStyles();
    const [state, setState] = useState(initialState);
    const [protectedLocation, setProtectedLocation] = useState(false)
    const [presetMode, setPresetMode] = useState(false);
    const {show, hide} = showHide();

    function updateStateFromProps() {
        if (props.location) {
            if (props.location.address) {
                const {
                    what3words,
                    ward,
                    line1,
                    line2,
                    town,
                    county,
                    postcode
                } = props.location.address
                setState({what3words, ward, line1, line2, town, county, postcode})
            }
            setProtectedLocation(props.location ? props.location.protected : false);
        } else {
            setState(initialState);
            setProtectedLocation(false);

        }
    }

    useEffect(updateStateFromProps, [props.location])

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

    const presetName = (props.location && props.location.name) ? props.location.name : ""
    const locationLink = props.location && props.location.uuid ? `/location/${encodeUUID(props.location.uuid)}` : "";

    const presetSelect = props.displayPresets ?
        <Grid item>
            <Grid container spacing={1} justify={"space-between"} alignItems={"center"} direction={"row"}>
                <Grid item>
                    {presetMode ? <FavouriteLocationsSelect
                        label={props.label}
                        onSelect={onSelectPreset}
                    /> : <ThemedLink to={locationLink}><Typography noWrap className={classes.label}>{presetName}</Typography></ThemedLink>}
                </Grid>
                <Grid item>
                    <Grid container direction={"row"} justify={"flex-end"} alignItems={"center"}>
                        <Grid className={(props.location && props.location.protected) ? show : hide} item>
                            <Tooltip title={"Edit"}>
                                <IconButton
                                    className={classes.button}
                                    edge={"end"}
                                    disabled={props.disabled}
                                    onClick={onClickEditButton}>
                                    <EditIcon/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid  className={(props.location && !props.disableClear) ? show : hide} item>
                            <Tooltip title={"Clear"}>
                                <IconButton
                                    className={classes.button}
                                    edge={"end"}
                                    disabled={props.disabled}
                                    onClick={onClickClearButton}>
                                    <CancelIcon/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid className={!!!props.location ? show : hide} item>
                    <Button
                            onClick={() => {
                                setPresetMode(!presetMode)
                            }}
                            variant={"contained"}
                            color={"primary"}
                    >
                        {presetMode ? "Cancel" : "Search"}
                    </Button>
                </Grid>

            </Grid>
        </Grid>
        : <></>

    return (

        <div className={classes.root}>
            <Grid container spacing={2} className={props.className} direction={"column"}>
                <Grid item>
                    <Grid container direction={"row"} justify={"space-between"}>
                        <Grid item>
                            <Typography variant={"h6"}>{props.label}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Divider/>
                </Grid>
                {presetSelect}

                <Grid item>
                    <LabelItemPair label={"w3w"}>
                        <ClickableTextField
                            label={"w3w"}
                            disabled={protectedLocation}
                            onChange={v => setState({...state, what3words: v})}
                            onFinished={onFieldFinished}
                            value={state.what3words}/>
                    </LabelItemPair>
                    <LabelItemPair label={"Ward"}>
                        <ClickableTextField
                            label="ward"
                            disabled={protectedLocation}
                            onChange={v => setState({...state, ward: v})}
                            onFinished={onFieldFinished}
                            value={state.ward}/>
                    </LabelItemPair>
                    <LabelItemPair label={"Line1"}>
                        <ClickableTextField
                            label={"line1"}
                            disabled={protectedLocation}
                            onChange={v => setState({...state, line1: v})}
                            onFinished={onFieldFinished}
                            value={state.line1}/>
                    </LabelItemPair>
                    <LabelItemPair label={"Line2"}>
                        <ClickableTextField
                            label={"line2"}
                            disabled={protectedLocation}
                            onChange={v => setState({...state, line2: v})}
                            onFinished={onFieldFinished}
                            value={state.line2}/>
                    </LabelItemPair>
                    <LabelItemPair label={"Town"}>
                        <ClickableTextField
                            label={"town"}
                            disabled={protectedLocation}
                            onChange={v => setState({...state, town: v})}
                            onFinished={onFieldFinished}
                            value={state.town}/>
                    </LabelItemPair>
                    <LabelItemPair label={"County"}>
                        <ClickableTextField
                            label={"county"}
                            disabled={protectedLocation}
                            onChange={v => setState({...state, county: v})}
                            onFinished={onFieldFinished}
                            value={state.county}/>
                    </LabelItemPair>
                    <LabelItemPair label={"Postcode"}>
                        <ClickableTextField
                            label={"postcode"}
                            disabled={protectedLocation}
                            onChange={v => setState({...state, postcode: v})}
                            onFinished={onFieldFinished}
                            value={state.postcode}/>
                    </LabelItemPair>


                </Grid>
            </Grid>
        </div>
    )

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
    onEditPreset: PropTypes.func
}

LocationDetailAndSelector.propDefaults = {
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
            postcode: null
        }
    },
    onSelectPreset: () => {
    },
    onChange: () => {
    },
    onClear: () => {
    },
    onEditPreset: () => {
    }
}

export default LocationDetailAndSelector;
