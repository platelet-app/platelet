import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LabelItemPair from "../../../components/LabelItemPair";
import ClickableTextField from "../../../components/ClickableTextField";
import { makeStyles } from 'tss-react/mui';
import Divider from "@mui/material/Divider";

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

const useStyles = makeStyles()({
    root: {
        width: "100%",
        padding: "0 5px 30px 5px",
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


export const ManualAddress = (props) => {
    const { classes } = useStyles();
    
    const [state, setState] = useState(initialState);
    const [protectedLocation, setProtectedLocation] = useState(false);

    const updateStateFromProps = () => {
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
            setState(result);
        } else {
            setState(initialState);
            setProtectedLocation(false);
        }
    }

    useEffect(updateStateFromProps, [props.location]);

    return (
        <div className={classes.root}>
        <Grid
            container
            spacing={1}
            className={props.className}
            direction={"column"}
        >
            <Grid item>
                <Grid container direction={"row"} justifyContent={"space-between"}>
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

                {/* why do we need this showContact */}

                {/* <div className={classes.separator} /> */}
                {/* <div className={props.showContact ? show : hide}>
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
                </div> */}
            </Grid>
        </Grid>
    </div>
    );
}
