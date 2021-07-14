import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {
    addDeliverableRequest, deleteDeliverableRequest,
    getDeliverablesRequest, updateDeliverableRequest,
} from "../../redux/deliverables/DeliverablesActions";
import {useDispatch, useSelector} from "react-redux"
import {createLoadingSelector, createPostingSelector} from "../../redux/selectors";
import DeliverableCard from "./components/DeliverableCard";
import DeliverablesSkeleton from "./components/DeliverablesSkeleton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import styled from "@material-ui/core/styles/styled";
import Box from "@material-ui/core/Box";
import {Paper} from "@material-ui/core";
import {dialogCardStyles} from "../Task/styles/DialogCompactStyles";
import IncreaseDecreaseCounter from "../../components/IncreaseDecreaseCounter";
import {v4 as uuidv4} from 'uuid';
import {SmallCirclePlusButton} from "../../components/Buttons";


const useStyles = makeStyles(({
    root: {
        width: "100%",
        maxWidth: 350
    }
}))

const DeliverableBox = styled(Box)({
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    paddingLeft: 10
});

const EditableDeliverable = props => {
    const deliverable = props.deliverable;
    const postingSelector = createPostingSelector(["ADD_DELIVERABLE"]);
    const isPosting = useSelector(state => postingSelector(state));

    const addCounter = deliverable.count > 0 ?
        <IncreaseDecreaseCounter
            value={deliverable.count || 0}
            onChange={(count) => props.onChange(deliverable, count)}
        /> :
        <SmallCirclePlusButton
            onClick={() => props.onChange(deliverable, 1)}
            disabled={isPosting}
        />

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
    )
}

export default function DeliverableGridSelect(props) {
    const dispatch = useDispatch();
    const availableDeliverables = useSelector(state => state.availableDeliverables.deliverables);
    const deliverables = useSelector(state => state.deliverables.deliverables);
    const loadingSelector = createLoadingSelector(["GET_DELIVERABLES"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const classes = useStyles();
    const cardClasses = dialogCardStyles();

    let emptyDeliverable = {
        task_uuid: props.taskUUID,
        uuid: uuidv4()
    };

    const onAddNewDeliverable = (deliverable) => {
        let newDeliverable = {...emptyDeliverable, count: 1, type_id: deliverable.id, type: deliverable.label};
        dispatch(addDeliverableRequest(newDeliverable));
    };

    const onChange = (deliverable, count) => {
        if (deliverable.uuid) {
            if (count === 0) {
                dispatch(deleteDeliverableRequest(deliverable.uuid));
            } else {
                dispatch(updateDeliverableRequest(deliverable.uuid, {count}));
            }
        } else if (deliverable.id) {
            onAddNewDeliverable(deliverable);
        }

    }

    React.useEffect(() => {
        if (Object.values(availableDeliverables).length > 0)
            dispatch(getDeliverablesRequest(props.taskUUID));
    }, [availableDeliverables, props.taskUUID]);

    if (isFetching) {
        return <DeliverablesSkeleton/>
    } else {
        return (
            <Paper className={cardClasses.root}>
                <Grid container spacing={3} justify={"space-between"} direction={"column"}>
                    <Grid item>
                        <Grid container
                              spacing={1}
                              className={classes.root}
                              direction={"column"}
                        >
                            {Object.values(availableDeliverables).map(deliverable => {
                                const value = Object.values(deliverables).find(d => d.type_id === deliverable.id)
                                return (
                                    <Grid item key={deliverable.id}>
                                        <EditableDeliverable onChange={onChange} deliverable={value || deliverable}/>
                                    </Grid>
                                )
                            })
                            }
                            <Grid/>
                        </Grid>
                    </Grid>
                </Grid>

            </Paper>
        )
    }
}
