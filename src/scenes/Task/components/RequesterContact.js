import React, { useEffect, useState } from "react";
import {
    useMediaQuery,
    Stack,
    IconButton,
    Typography,
    Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ClickableTextField from "../../../components/ClickableTextField";
import LabelItemPair from "../../../components/LabelItemPair";
import PropTypes from "prop-types";
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/styles';
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { TextFieldControlled } from "../../../components/TextFields";

const useStyles = makeStyles()({
    inset: {
        marginLeft: 20,
    },
});

const fields = {
    name: "Name",
    telephoneNumber: "Telephone",
};

function RequesterContact(props) {
    const [editMode, setEditMode] = React.useState(false);
    const [state, setState] = useState({
        name: props.name,
        telephoneNumber: props.telephoneNumber,
    });
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        setState({
            name: props.name,
            telephoneNumber: props.telephoneNumber,
        });
    }, [props]);

    const onCancelDialog = () => {
        setEditMode(false);
        setState({
            name: props.name,
            telephoneNumber: props.telephoneNumber,
        });
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
                {!props.hideEditIcon && (
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
                            onFinished={(value) =>
                                props.onChange({
                                    [key]: value,
                                })
                            }
                            label={label}
                            value={props[key]}
                        />
                    </LabelItemPair>
                </div>
            ))}
            {isSm && (
                <ConfirmationDialog
                    onCancel={onCancelDialog}
                    onConfirmation={() => {
                        props.onChange(state);
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
                                value={state[key]}
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
}

RequesterContact.propTypes = {
    name: PropTypes.string,
    telephoneNumber: PropTypes.string,
    onChange: PropTypes.func,
    hideEditIcon: PropTypes.bool,
};

RequesterContact.defaultProps = {
    name: "",
    telephoneNumber: "",
    onChange: () => {},
    hideEditIcon: false,
};

export default RequesterContact;
