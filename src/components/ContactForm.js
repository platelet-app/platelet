import React from "react";
import { makeStyles } from 'tss-react/mui';
import { TextFieldUncontrolled } from "./TextFields";

const useStyles = makeStyles()((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        alignItems: "center",
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: "100%",
    },
}));

const fields = { name: "Name", telephoneNumber: "Telephone" };

export const ContactForm = ({ values, onChange, italicTel }) => {
    const { classes } = useStyles();

    return (
        <form className={classes.root} noValidate autoComplete="off">
            {Object.entries(fields).map(([key, value]) => (
                <TextFieldUncontrolled
                    key={key}
                    InputProps={{
                        sx: {
                            fontStyle:
                                italicTel && key === "telephoneNumber"
                                    ? "italic"
                                    : "normal",
                        },
                    }}
                    id={key}
                    fullWidth
                    tel={key === "telephoneNumber"}
                    label={value}
                    value={values[key]}
                    onChange={(e) => onChange({ [key]: e.target.value })}
                    variant="outlined"
                />
            ))}
        </form>
    );
};
