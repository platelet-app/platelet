import React from "react";
import { makeStyles } from "tss-react/mui";
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

type ValuesType = {
    name: string;
    telephoneNumber: string;
};

type ContactFormProps = {
    onChange: (contact: any) => void;
    values: ValuesType;
    italicTel: boolean;
};

export const ContactForm: React.FC<ContactFormProps> = ({
    values,
    onChange,
    italicTel,
}) => {
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
                    value={(values as any)[key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const { value } = e.target;
                        onChange({ [key]: value });
                    }}
                    variant="outlined"
                />
            ))}
        </form>
    );
};
