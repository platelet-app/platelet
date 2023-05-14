import React, { useEffect } from "react";
import * as models from "../../models";
import {
    useMediaQuery,
    Stack,
    IconButton,
    Typography,
    Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ClickableTextField from "../../components/ClickableTextField";
import LabelItemPair from "../../components/LabelItemPair";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/material/styles";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { TextFieldControlled } from "../../components/TextFields";
const useStyles = makeStyles()({
    inset: {
        marginLeft: 20,
    },
});

const fields = {
    name: "Name",
    telephoneNumber: "Telephone",
};

type RequesterContactProps = {
    contact: models.AddressAndContactDetails | null;
    onChange: (value: models.AddressAndContactDetails) => void;
    hideEditIcon?: boolean;
};

const initialState = new models.AddressAndContactDetails({
    name: "",
    telephoneNumber: "",
});

const RequesterContact: React.FC<RequesterContactProps> = ({
    contact,
    onChange,
    hideEditIcon = false,
}) => {
    const [editMode, setEditMode] = React.useState(false);
    const [state, setState] = React.useState<models.AddressAndContactDetails>(
        new models.AddressAndContactDetails(initialState)
    );
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        if (contact) setState(contact);
    }, [contact]);

    const onCancelDialog = () => {
        setEditMode(false);
        setState(contact || initialState);
    };

    const { classes } = useStyles();
    return (
        <Stack>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography>Caller details</Typography>
                {!hideEditIcon && (
                    <Tooltip title={editMode && !isSm ? "Finish" : "Edit"}>
                        <IconButton
                            onClick={() =>
                                setEditMode((prevState) => !prevState)
                            }
                            aria-label="edit caller details"
                            size={"small"}
                        >
                            <EditIcon
                                color={
                                    editMode && !isSm ? "secondary" : "inherit"
                                }
                            />
                        </IconButton>
                    </Tooltip>
                )}
            </Stack>
            {Object.entries(fields).map(([key, label]) => (
                <div key={key} className={classes.inset}>
                    <LabelItemPair label={label}>
                        <ClickableTextField
                            tel={key === "telephoneNumber"}
                            disabled={isSm || !editMode}
                            onFinished={(value) => {
                                const result = { ...state, [key]: value };
                                setState(result);
                                onChange(result);
                            }}
                            label={label}
                            value={
                                state[
                                    key as keyof models.AddressAndContactDetails
                                ]
                            }
                        />
                    </LabelItemPair>
                </div>
            ))}
            {isSm && (
                <ConfirmationDialog
                    onCancel={onCancelDialog}
                    onConfirmation={() => {
                        onChange(state);
                        setEditMode(false);
                    }}
                    fullScreen={isSm}
                    open={editMode}
                >
                    <Stack marginTop={1} spacing={2}>
                        {Object.entries(fields).map(([key, label]) => (
                            <TextFieldControlled
                                tel={key === "telephoneNumber"}
                                key={key}
                                label={label}
                                aria-label={label}
                                value={
                                    state[
                                        key as keyof models.AddressAndContactDetails
                                    ]
                                }
                                onChange={(event) =>
                                    setState({
                                        ...state,
                                        [key]: event.target.value,
                                    })
                                }
                            />
                        ))}
                    </Stack>
                </ConfirmationDialog>
            )}
        </Stack>
    );
};

export default RequesterContact;
