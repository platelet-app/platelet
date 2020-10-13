import React, {useEffect, useRef, useState} from "react";
import {TextFieldUncontrolled} from "../../../components/TextFields";
import Grid from "@material-ui/core/Grid";
import {parsePhoneNumberFromString} from "libphonenumber-js";

export default function TaskModalNameAndContactNumber(props) {
    const [name, setName] = useState(props.contactName)
    const [telephoneNumber, setTelephoneNumber] = useState(props.contactNumber)
    const [errorState, setErrorState] = useState(false);
    const firstUpdate = useRef(true);

    function validateNumber() {
        if (typeof(telephoneNumber) === "string") {
            const parsedNumber = parsePhoneNumberFromString(telephoneNumber, "GB")
            if (parsedNumber)
                setErrorState(!parsedNumber.isValid())
        }
    }
    useEffect(validateNumber, [telephoneNumber])

    function onChange() {
        if (firstUpdate.current)
            firstUpdate.current = false;
        else
            props.onSelect({name, telephone_number: telephoneNumber})
    }
    useEffect(onChange, [name, telephoneNumber])


    return (
        <Grid container direction={"column"}>
            <Grid item>
            <TextFieldUncontrolled
                value={name}
                label={"Name"}
                id={"contact-name"}
                onChange={(e) => setName(e.target.value)}/>
            </Grid>
            <Grid item>
            <TextFieldUncontrolled
                label={"Telephone"}
                error={errorState}
                helperText={errorState ? "Not a valid telephone number" : ""}
                id={"contact-number"}
                value={telephoneNumber}
                onChange={(e) => setTelephoneNumber(e.target.value)}/>
            </Grid>
        </Grid>

    )
}
