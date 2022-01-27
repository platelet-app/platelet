import React from "react";
import { Stack, IconButton, Typography, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ClickableTextField from "../../../components/ClickableTextField";
import LabelItemPair from "../../../components/LabelItemPair";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    inset: {
        marginLeft: 20,
    },
});

function RequesterContact(props) {
    const [editMode, setEditMode] = React.useState(false);
    function onChange(value) {
        props.onChange(value);
    }
    const classes = useStyles();
    return (
        <Stack>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography>Requester contact</Typography>
                <Tooltip title={editMode ? "Finish" : "Edit"}>
                    <IconButton
                        onClick={() => setEditMode((prevState) => !prevState)}
                        size={"small"}
                    >
                        <EditIcon color={editMode ? "secondary" : "inherit"} />
                    </IconButton>
                </Tooltip>
            </Stack>
            <div className={classes.inset}>
                <LabelItemPair label={"Name"}>
                    <ClickableTextField
                        disabled={!editMode}
                        onFinished={(value) =>
                            onChange({
                                name: value,
                            })
                        }
                        label={"Name"}
                        value={props.name}
                    />
                </LabelItemPair>
            </div>
            <div className={classes.inset}>
                <LabelItemPair label={"Telephone"}>
                    <ClickableTextField
                        tel
                        disabled={!editMode}
                        onFinished={(value) =>
                            onChange({
                                telephoneNumber: value,
                            })
                        }
                        value={props.telephoneNumber}
                        label={"Telephone"}
                    />
                </LabelItemPair>
            </div>
        </Stack>
    );
}

RequesterContact.propTypes = {
    name: PropTypes.string,
    telephoneNumber: PropTypes.string,
    onChange: PropTypes.func,
};

RequesterContact.defaultProps = {
    name: "",
    telephoneNumber: "",
    onChange: () => {},
};

export default RequesterContact;
