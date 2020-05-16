import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import DeliverableDropSelect from "./DeliverableDropSelect";
import {addDeliverable, getDeliverables, updateDeliverable} from "../redux/deliverables/DeliverablesActions";
import {connect, useDispatch, useSelector} from "react-redux"
import {AddCircleButtonSmall} from "./Buttons";
import {createPostingSelector} from "../redux/selectors";
import Button from "@material-ui/core/Button";


export default function DeliverableGridSelect(props) {
    const dispatch = useDispatch();
    const availableDeliverables = useSelector(state => state.availableDeliverables.deliverables);
    const deliverables = useSelector(state => state.deliverables.deliverables);
    const postingSelector = createPostingSelector(["ADD_DELIVERABLE"]);
    const isPosting = useSelector(state => postingSelector(state));

    const onSelectDeliverable = (uuid, type_id) => {
        dispatch(updateDeliverable({"deliverableUUID": uuid, "payload": {"type_id": type_id}}));
    };

    let emptyDeliverable = {
        task_uuid: props.taskUUID,
    };

    React.useEffect(() => {
        if (availableDeliverables.length > 0)
            dispatch(getDeliverables(props.taskUUID))

    }, [availableDeliverables]);

    const circleAdd =
        <AddCircleButtonSmall
            disabled={isPosting}
            onClick={() => {
                let newDeliverable = {...emptyDeliverable};
                dispatch(addDeliverable(newDeliverable))
            }
            }
        />;

    const addButton =
        <Button
            variant={"contained"}
            color={"primary"}
            disabled={isPosting}
            onClick={() => {
                let newDeliverable = {...emptyDeliverable};
                dispatch(addDeliverable(newDeliverable))
            }}
        >
            Add a deliverable
        </Button>


    return (
        <Grid container
              spacing={2}
              direction={"column"}
              justify={"flex-start"}
              alignItems={"flex-start"}
        >
            {deliverables.map(deliverable => {
                return (
                    <Grid item key={deliverable.uuid}>
                        <DeliverableDropSelect key={deliverable.uuid}
                                               availableDeliverables={availableDeliverables}
                                               deliverable={deliverable}
                                               onSelect={onSelectDeliverable}
                                               onNoteChange={props.onNoteChange}
                                               uuid={deliverable.uuid}/>
                    </Grid>
                )

            })
            }
            <Grid item>
                {addButton}
            </Grid>
        </Grid>
    )

}

