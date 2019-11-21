import React from "react";
import Grid from "@material-ui/core/Grid";
import {StyledAddCircleOutlineSmall} from "../css/common";
import DeliverableDropSelect from "./DeliverableDropSelect";
import {addDeliverable, getDeliverables} from "../redux/Actions";
import { connect } from "react-redux"

const mapStateToProps = state => {
    return {
        deliverables: state.deliverables
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddDeliverableClick: deliverable => dispatch(addDeliverable(deliverable)),
        getDeliverablesList: taskId => dispatch(getDeliverables(taskId)),
    }
};

function GridSelect(props) {

   let emptyDeliverable = {
        task_id: props.taskId,
        timestamp: new Date().toISOString(),
        desc_note_id: null
    };


    function onSelectDeliverableType(uuid, deliverableType) {
        props.onSelect(uuid, deliverableType)
    }
    const setup = () => {
        console.log("AAAAAAAAA")
        console.log(props.taskId)
        props.getDeliverablesList({"taskId": props.taskId})
    };
    React.useEffect(setup, [])

    const circleAdd =
        <StyledAddCircleOutlineSmall
            onClick={() => {
                let newDeliverable = {...emptyDeliverable};
                props.onAddDeliverableClick(newDeliverable);
               // props.apiControl.deliverables.createDeliverable(newDeliverable).then((data) => {
               //     newDeliverable.uuid = data.uuid;
               //     props.apiControl.notes.createNote({"deliverable_id": data.uuid}).then((data) => {
               //         newDeliverable.desc_note_id = data.uuid;

               //         props.onNew(newDeliverable);

               //     })

               // })

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

const DeliverableGridSelect = connect(
    mapStateToProps,
    mapDispatchToProps
)(GridSelect)

export default DeliverableGridSelect