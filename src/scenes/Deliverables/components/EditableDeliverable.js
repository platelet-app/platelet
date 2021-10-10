import React, { useState } from "react";
import PropTypes from "prop-types";
import DeliverableCard from "./DeliverableCard";
import styled from "@material-ui/core/styles/styled";
import Box from "@material-ui/core/Box";
import IncreaseDecreaseCounter from "../../../components/IncreaseDecreaseCounter";
import UnitSelector from "../../../components/UnitSelector";
import { showHide } from "../../../styles/common";
import {
    ClickAwayListener,
    Grid,
    IconButton,
    makeStyles,
    Tooltip,
} from "@material-ui/core";
import ArchitectureIcon from "@mui/icons-material/Architecture";

const DeliverableBox = styled(Box)({
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    paddingLeft: 10,
});
const useStyles = makeStyles((theme) => ({
    button: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    iconButton: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
}));

function EditableDeliverable(props) {
    const deliverable = props.deliverable;
    const [showUnit, setShowUnit] = useState(false);
    const classes = useStyles();
    const { show, hide } = showHide();
    function handleCloseUnit() {
        setShowUnit((prevState) => !prevState);
    }
    return (
        <ClickAwayListener
            mouseEvent={"onMouseUp"}
            onClickAway={() => setShowUnit(false)}
        >
            <DeliverableBox>
                <DeliverableCard
                    compact
                    label={deliverable.label}
                    icon={deliverable.icon}
                >
                    <Grid container direction={"column"}>
                        <Grid item>
                            <Grid container direction={"row"}>
                                <Grid item>
                                    <Tooltip
                                        title={`${deliverable.unit}. Click to change`}
                                    >
                                        <IconButton
                                            onClick={handleCloseUnit}
                                            className={classes.iconButton}
                                        >
                                            <ArchitectureIcon
                                                className={classes.button}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <IncreaseDecreaseCounter
                                        value={deliverable.count || 0}
                                        disabled={props.isDeleting}
                                        onChange={(count) =>
                                            props.onChangeCount(
                                                deliverable.id,
                                                count
                                            )
                                        }
                                        onDelete={() =>
                                            props.onDelete(deliverable.id)
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid className={showUnit ? show : hide} item>
                            <UnitSelector
                                value={deliverable.unit}
                                onChange={(unit) =>
                                    props.onChangeUnit(
                                        deliverable.id,
                                        unit.target.value
                                    )
                                }
                            />
                        </Grid>
                    </Grid>
                </DeliverableCard>
            </DeliverableBox>
        </ClickAwayListener>
    );
}

EditableDeliverable.propTypes = {
    deliverable: PropTypes.object,
    onChangeCount: PropTypes.func,
    isDeleting: PropTypes.bool,
    isPosting: PropTypes.bool,
    onDelete: PropTypes.func,
};

EditableDeliverable.defaultProps = {
    onChangeCount: () => {},
    isDeleting: false,
    isPosting: false,
    deliverable: { id: "", label: "None", deliverableType: { icon: "" } },
    onDelete: () => {},
};

export default EditableDeliverable;
