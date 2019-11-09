import React from "react";
import Grid from "@material-ui/core/Grid";
import {StyledAddCircleOutlineSmall} from "../css/common";
import DeliverableDropSelect from "./DeliverableDropSelect";
import update from 'immutability-helper';


export default class DeliverableGridSelect extends React.Component {
    constructor(props) {
        super(props);
        this.onSelectDeliverableType = this.onSelectDeliverableType.bind(this);
    }


    state = {
        deliverables: this.props.deliverables.reverse()
    };

    emptyDeliverable = {
        task_id: this.props.taskId,
        timestamp: new Date().toISOString(),
        desc_note_id: null
    };


    onSelectDeliverableType(uuid, deliverableType) {
        this.props.onSelect(uuid, deliverableType)
    }

    render() {
        const circleAdd =
            <StyledAddCircleOutlineSmall
                onClick={() => {
                    let newDeliverable = {...this.emptyDeliverable};
                    this.props.apiControl.deliverables.createDeliverable(newDeliverable).then((data) => {
                        newDeliverable.uuid = data.uuid;
                        this.props.apiControl.notes.createNote({"deliverable_id": data.uuid}).then((data) => {
                            newDeliverable.desc_note_id = data.uuid;

                            this.props.onNew(newDeliverable);

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
                {this.props.deliverables.map(deliverable => {
                    return <><Grid item>
                        <DeliverableDropSelect key={deliverable.uuid}
                                               availableDeliverables={this.props.availableDeliverables}
                                               deliverable={deliverable}
                                               onSelect={this.props.onSelect}
                                               onNoteChange={this.props.onNoteChange}
                                               uuid={deliverable.uuid}/>
                    </Grid></>

                })
                }
            </Grid>
        )

    }
}