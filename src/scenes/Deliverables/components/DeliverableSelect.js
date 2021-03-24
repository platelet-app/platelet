import React from 'react';
import PropTypes from 'prop-types';
import {Autocomplete} from "@material-ui/lab";
import {useSelector} from "react-redux";
import TextField from "@material-ui/core/TextField";
import CompactUserCard from "../../../components/CompactUserCard";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import DeliverableCard from "./DeliverableCard";
import FormControl from "@material-ui/core/FormControl";
import {InputLabel, MenuItem, Select} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        width: "100%",
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


function DeliverablesSelect(props) {
    const availableDeliverables = useSelector(state => state.availableDeliverables.deliverables)
    const classes = useStyles();

    const onSelect = (e) => {
        if (e.target.value)
            props.onSelect(e.target.value);
    };

    return (
        <FormControl className={classes.formControl}>
            <InputLabel id="select-deliver-item-label">Items</InputLabel>
            <Select
                disabled={props.disabled}
                labelId="select-deliver-item-label"
                id="select-deliver-item"
                value={null}
                onChange={onSelect}
            >
                {availableDeliverables.map(d => {
                    return (
                        <MenuItem value={d}>
                            {d.label}
                        </MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )

}

DeliverablesSelect.protoTypes = {
    onSelect: PropTypes.func,

}

export default DeliverablesSelect;
