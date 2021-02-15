import React from 'react';
import PropTypes from 'prop-types';
import {Autocomplete} from "@material-ui/lab";
import {useSelector} from "react-redux";
import TextField from "@material-ui/core/TextField";
import CompactUserCard from "../../../components/CompactUserCard";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import DeliverableCard from "./DeliverableCard";

function DeliverablesSelect(props) {
    const availableDeliverables = useSelector(state => state.availableDeliverables.deliverables)

    const onSelect = (event, selectedItem) => {
        if (selectedItem)
            props.onSelect(selectedItem);
    };

    return (
        <Autocomplete
            size={"small"}
            renderInput={(params) => (
                <TextField autoFocus {...params} variant="outlined" margin="none"/>
            )}
            onChange={onSelect}
            style={{width: 350}}
            getOptionLabel={(option) => option.label}
            renderOption={(option, {inputValue}) => {
                return (
                    <div style={{width: "100%"}}>
                        <DeliverableCard label={option.label} typeID={option.id} size={"compact"}/>
                        <Divider/>
                    </div>
                )
            }
            }
            options={availableDeliverables}/>
    )

}

DeliverablesSelect.protoTypes = {
    onSelect: PropTypes.func,

}

export default DeliverablesSelect;
