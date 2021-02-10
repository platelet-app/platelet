import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types"
import LabelItemPair from "../../../components/LabelItemPair";
import ClickableTextField from "../../../components/ClickableTextField";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";


function LocationDetailAndSelector(props) {
    const [state, setState] = useState({
        what3words: "",
        ward: "",
        line1: "",
        line2: "",
        town: "",
        county: "",
        postcode: ""
    })
    const [protectedLocation, setProtectedLocation] = useState(false)
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
        }
    }
    useEffect(updateStateFromProps, [props.location])

    function onFieldFinished() {
        props.onChange(state);
    }

    return (

        <Grid container className={props.className} direction={"column"}>
            <Grid item>
                <Grid container direction={"row"} justify={"space-between"}>
                    <Grid item>
                        <Typography>{props.label}</Typography>
                    </Grid>
                    <Grid item>
                        {props.displayPresets ? <FavouriteLocationsSelect label={props.label} onSelect={props.onSelectPreset}/> : <></>}
                    </Grid>
                </Grid>
            </Grid>
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
    )

}

LocationDetailAndSelector.propTypes = {
    label: PropTypes.string,
    location: PropTypes.object,
    onSelectPreset: PropTypes.func,
    className: PropTypes.string,
    displayPresets: PropTypes.bool,
    onChange: PropTypes.func
}

LocationDetailAndSelector.propDefaults = {
    label: "",
    displayPresets: true,
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
    onSelectPreset: () => {},
    onChange: () => {}
}

export default LocationDetailAndSelector;
