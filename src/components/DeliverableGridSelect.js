import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {StyledAddCircleOutlineSmall} from "../css/common";
import DeliverableDropSelect from "./DeliverableDropSelect";
import {addDeliverable, getDeliverables, updateDeliverable, getAvailableDeliverables} from "../redux/Actions";
import {connect, useDispatch, useSelector} from "react-redux"


export default function DeliverableGridSelect(props) {
    const dispatch = useDispatch();
    const availableDeliverables = useSelector(state => state.availableDeliverables);
    const deliverables = useSelector(state => state.deliverables);

    const onSelectDeliverable = (uuid, type_id) => {
        dispatch(updateDeliverable({"deliverableUUID": uuid, "payload": {"type_id": type_id}}));
    };

    const onDeliverableNote = (uuid, value) => {
        props.apiControl.notes.updateNote(uuid, {"body": value});
    };

    let emptyDeliverable = {
        task_uuid: props.taskUUID,
        timestamp: new Date().toISOString(),
        desc_note_id: null
    };

    React.useEffect(() => {
        if (availableDeliverables.length > 0)
            dispatch(getDeliverables(props.taskUUID))

    }, [availableDeliverables]);

    const circleAdd =
        <StyledAddCircleOutlineSmall
            onClick={() => {
                let newDeliverable = {...emptyDeliverable};
                dispatch(addDeliverable(newDeliverable))
            }
            }
        />;


    return (
        <Grid container
              spacing={0}
              direction={"column"}
              justify={"flex-start"}
              alignItems={"flex-start"}
        >
            <Grid item>
                {circleAdd}
            </Grid>
            {deliverables.map(deliverable => {
                return <><Grid item>
                    <DeliverableDropSelect key={deliverable.uuid}
                                           availableDeliverables={availableDeliverables}
                                           deliverable={deliverable}
                                           onSelect={onSelectDeliverable}
                                           onNoteChange={props.onNoteChange}
                                           uuid={deliverable.uuid}/>
                </Grid></>

            })
            }
        </Grid>
    )

}

