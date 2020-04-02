import {TextFieldControlled} from "../TextFieldControlled";
import React from "react";

export default function TaskModalNameAndContactNumber(props) {
    return (
        <>
        <TextFieldControlled
            value={props.contactName}
            label={"Contact Name"}
            id={"contact-name"}
            onSelect={props.onSelectName}/>
        <TextFieldControlled
    label={"Contact Number"}
    id={"contact-number"}
    value={props.contactNumber}
    onSelect={props.onSelectContactNumber}/>
    </>

    )
}

