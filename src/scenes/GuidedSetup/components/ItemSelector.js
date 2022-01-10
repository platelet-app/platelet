import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import {
    createDeletingSelector,
    createLoadingSelector,
    createPostingSelector,
} from "../../../redux/LoadingSelectors";
import DeliverableCard from "../../../scenes/Deliverables/components/DeliverableCard";
import DeliverablesSkeleton from "../../../scenes/Deliverables/components/DeliverablesSkeleton";
import { styled } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";
import { Paper } from "@mui/material";
import { dialogCardStyles } from "../../Task/styles/DialogCompactStyles";
import IncreaseDecreaseCounter from "../../../components/IncreaseDecreaseCounter";
import { v4 as uuidv4 } from "uuid";
import { SmallCirclePlusButton } from "../../../components/Buttons";
import Typography from "@mui/material/Typography";
import { showHide } from "../../../styles/common";
import Link from "@mui/material/Link";

const useStyles = makeStyles({
    root: {
        width: "100%",
        maxWidth: 350,
    },
    truncate: {
        maxHeight: 410,
    },
});

const DeliverableBox = styled(Box)({
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    paddingLeft: 10,
});

const EditableDeliverable = (props) => {
    const deliverable = props.deliverable;
    const postingSelector = createPostingSelector(["ADD_DELIVERABLE"]);
    const isPosting = useSelector((state) => postingSelector(state));
    const deletingSelector = createDeletingSelector(["DELETE_DELIVERABLE"]);
    const isDeleting = useSelector((state) => deletingSelector(state));
    const dispatch = useDispatch();

    const addCounter =
        deliverable.count > 0 ? (
            <IncreaseDecreaseCounter
                value={deliverable.count || 0}
                disabled={isDeleting}
                onChange={(count) => props.onChange(deliverable, count)}
                onDelete={() => {
                    if (deliverable.uuid) {
                    }
                }}
            />
        ) : (
            <SmallCirclePlusButton
                onClick={() => props.onChange(deliverable, 1)}
                disabled={isPosting}
            />
        );

    return (
        <DeliverableBox>
            <DeliverableCard
                compact
                label={deliverable.label || deliverable.type}
                typeID={deliverable.id || deliverable.type_id}
            >
                {addCounter}
            </DeliverableCard>
        </DeliverableBox>
    );
};

export default function ItemSelector(props) {
    const deliverablesSorted = useSelector((state) => state.deliverablesSorted);
    const loadingSelector = createLoadingSelector(["GET_DELIVERABLES"]);
    const [truncated, setTruncated] = useState(false);
    const isFetching = useSelector((state) => loadingSelector(state));
    const classes = useStyles();
    const cardClasses = dialogCardStyles();

    function onChange() {}

    if (isFetching) {
        return <DeliverablesSkeleton />;
    } else {
        return (
            <Paper className={cardClasses.root}>
                <Grid
                    container
                    justifyContent={"space-between"}
                    direction={"column"}
                >
                    {Object.keys(deliverablesSorted).map((key) => {
                        return (
                            <Grid key={key} item>
                                <Grid
                                    container
                                    spacing={1}
                                    className={classes.root}
                                    direction={"column"}
                                >
                                    {deliverablesSorted[key].map(
                                        (deliverable) => {
                                            return (
                                                <Grid
                                                    item
                                                    key={
                                                        deliverable.id ||
                                                        deliverable.uuid
                                                    }
                                                >
                                                    <EditableDeliverable
                                                        onChange={onChange}
                                                        deliverable={
                                                            deliverable
                                                        }
                                                    />
                                                </Grid>
                                            );
                                        }
                                    )}
                                </Grid>
                            </Grid>
                        );
                    })}
                </Grid>
            </Paper>
        );
    }
}
