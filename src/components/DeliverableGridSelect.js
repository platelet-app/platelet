import React from "react";
import Grid from "@material-ui/core/Grid";
import {StyledAddCircleOutlineSmall} from "../css/common";
import DeliverableDropSelect from "./DeliverableDropSelect";
import update from 'immutability-helper';


export default function DeliverableGridSelect(props) {

   let emptyDeliverable = {
        task_id: props.taskId,
        timestamp: new Date().toISOString(),
        desc_note_id: null
    };


    function onSelectDeliverableType(uuid, deliverableType) {
        props.onSelect(uuid, deliverableType)
    }

    const circleAdd =
        <StyledAddCircleOutlineSmall
            onClick={() => {
                let newDeliverable = {...emptyDeliverable};
                props.apiControl.deliverables.createDeliverable(newDeliverable).then((data) => {
                    newDeliverable.uuid = data.uuid;
                    props.apiControl.notes.createNote({"deliverable_id": data.uuid}).then((data) => {
                        newDeliverable.desc_note_id = data.uuid;

                        props.onNew(newDeliverable);

                    })

                })

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
                {props.deliverables.map(deliverable => {
                    return <><Grid item>
                        <DeliverableDropSelect key={deliverable.uuid}
                                               availableDeliverables={props.availableDeliverables}
                                               deliverable={deliverable}
                                               onSelect={props.onSelect}
                                               onNoteChange={props.onNoteChange}
                                               uuid={deliverable.uuid}/>
                    </Grid></>

                })
                }
            </Grid>
        )

}