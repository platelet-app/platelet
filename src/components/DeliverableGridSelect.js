import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {StyledAddCircleOutlineSmall} from "../css/common";
import DeliverableDropSelect from "./DeliverableDropSelect";
import {addDeliverable, getDeliverables, updateDeliverable} from "../redux/Actions";
import {connect} from "react-redux"
import update from "immutability-helper";

const mapStateToProps = state => {
    return {
        deliverables: state.deliverables,
        availableDeliverables: state.availableDeliverables
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAddDeliverableClick: deliverable => dispatch(addDeliverable(deliverable)),
        getDeliverablesList: taskId => dispatch(getDeliverables(taskId)),
        onUpdateDeliverable: deliverableId => dispatch(updateDeliverable(deliverableId))
    }
};



function GridSelect(props) {
    const [availableDeliverables, setAvailableDeliverables] = React.useState([]);
    const [deliverables, setDeliverables] = useState([]);

    const onSelectDeliverable = (uuid, type_id) => {
        let result = deliverables.filter(deliverable => deliverable.uuid === uuid);
        if (result.length === 1) {
            const index = deliverables.indexOf(result[0]);
            const updated = update(deliverables, {[index]: {type_id: {$set: type_id}}});
            setDeliverables(updated)
        }
        props.apiControl.deliverables.updateDeliverable(uuid, {"type_id": type_id});
    };

    const onDeliverableNote = (uuid, value) => {
        props.apiControl.notes.updateNote(uuid, {"body": value});
    };

    let emptyDeliverable = {
        task_id: props.taskId,
        timestamp: new Date().toISOString(),
        desc_note_id: null
    };


    const setup = () => {
        props.apiControl.deliverables.getAvailableDeliverables()
            .then((data) => {
                setAvailableDeliverables(data);
                props.getDeliverablesList({"taskId": props.taskId})
            })
    };
    React.useEffect(setup, [])

    const circleAdd =
        <StyledAddCircleOutlineSmall
            onClick={() => {
                let newDeliverable = {...emptyDeliverable};
                props.onAddDeliverableClick(newDeliverable);

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

const DeliverableGridSelect = connect(
    mapStateToProps,
    mapDispatchToProps
)(GridSelect);

export default DeliverableGridSelect