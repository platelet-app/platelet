import React from "react";
import { Stack, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ClickableTextField from "../../../components/ClickableTextField";
import LabelItemPair from "../../../components/LabelItemPair";
import PropTypes from "prop-types";

function RequesterContact(props) {
    const [editMode, setEditMode] = React.useState(false);
    function onChange(value) {
        props.onChange(value);
    }
    return (
        <Stack>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography>Requester contact:</Typography>
                <IconButton
                    onClick={() => setEditMode((prevState) => !prevState)}
                >
                    <EditIcon color={editMode ? "secondary" : "inherit"} />
                </IconButton>
            </Stack>
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
