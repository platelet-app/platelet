import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {
    addDeliverableRequest,
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
import { v4 as uuidv4 } from 'uuid';


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


export default function DeliverableGridSelect(props) {
    const dispatch = useDispatch();
    const availableDeliverables = useSelector(state => state.availableDeliverables.deliverables);
    const deliverables = useSelector(state => state.deliverables.deliverables);
    const postingSelector = createPostingSelector(["ADD_DELIVERABLE"]);
    const isPosting = useSelector(state => postingSelector(state));
    const loadingSelector = createLoadingSelector(["GET_DELIVERABLES"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const classes = useStyles();
    const cardClasses = dialogCardStyles();

    let emptyDeliverable = {
        task_uuid: props.taskUUID,
        uuid: uuidv4()
    };

    const deliverablesList = Object.values(deliverables);

    const onAddNewDeliverable = (deliverable) => {
        let newDeliverable = {...emptyDeliverable, count: 1, type_id: deliverable.id, type: deliverable.label};
        dispatch(addDeliverableRequest(newDeliverable));
        deliverablesList.push(newDeliverable);
    };

    const onChange = (deliverableType, count) => {
        const existing = deliverablesList.find(d => d.type_id === deliverableType.id);
        if (existing) {
            dispatch(updateDeliverableRequest(existing.uuid, {count}));
        } else {
            onAddNewDeliverable(deliverableType);
        }

    }


    React.useEffect(() => {
        if (availableDeliverables.length > 0)
            dispatch(getDeliverablesRequest(props.taskUUID));
    }, [availableDeliverables, props.taskUUID]);

    if (isFetching) {
        return <DeliverablesSkeleton/>
    } else {
        return (
            <Paper className={cardClasses.root}>
                <Grid container
                      spacing={1}
                      className={classes.root}
                      direction={"column"}
                >
                    {Object.values(availableDeliverables).map(deliverable => {
                        const existing = deliverablesList.find(d => d.type_id === deliverable.id);
                        return (
                            <Grid item key={deliverable.uuid}>
                                <DeliverableBox>
                                    <Grid container direction={"row"} justify={"space-between"} alignItems={"center"}>
                                        <Grid item>
                                            <DeliverableCard
                                                size={"compact"}
                                                label={deliverable.label}
                                                typeID={deliverable.id}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <IncreaseDecreaseCounter
                                                value={existing ? existing.count || 0 : 0}
                                                onChange={(count) => onChange(deliverable, count)}
                                                disabled={isPosting}
                                            />
                                        </Grid>
                                    </Grid>
                                </DeliverableBox>
                            </Grid>
                        )
                    })
                    }
                </Grid>
            </Paper>
        )
    }
}
