import React from "react";
import Grid from "@material-ui/core/Grid";
import {StyledAddCircleOutlineSmall} from "../css/common";
import DeliverableDropSelect from "./DeliverableDropSelect";
import {Typography} from "@material-ui/core";
import update from 'immutability-helper';


export default class DeliverableGridSelect extends React.Component {
    constructor(props) {
        super(props);
        this.onSelectDeliverableType = this.onSelectDeliverableType.bind(this);
    }


    state = {
        deliverables: []
    };

    emptyDeliverable = {
        task_id: this.props.taskId,
        timestamp: new Date().toISOString(),
        desc_note_id: null
    };

    componentDidMount() {
        this.props.apiControl.tasks.getTask(this.props.taskId).then((data) => {
            this.setState({
                deliverables: data.deliverables
                }

            )
        })
    }

    onSelectDeliverableType(uuid, deliverableType) {
        let result = this.state.deliverables.filter(deliverable => deliverable.uuid === uuid);
        if (result.length === 1) {
            const index = this.state.tasks.indexOf(result[0]);
            const updated = update(this.state.deliverables, {[index]: {$set: {deliverableType: deliverableType}}});
            this.setState({
                deliverables: updated
            });
        }
        this.props.onSelect(uuid, deliverableType, "lol")
    }

    render() {
        const circleAdd =
            <StyledAddCircleOutlineSmall
                onClick={() => {
                    let newDeliverable = {...this.emptyDeliverable};
                    console.log(newDeliverable);
                    this.props.apiControl.deliverables.createDeliverable(newDeliverable).then((data) => {
                        newDeliverable.uuid = data.uuid;
                        this.props.apiControl.notes.createNote({"deliverable": data.uuid}).then((data) => {
                            newDeliverable.desc_note_id = data.uuid
                            this.setState({
                                deliverables: [newDeliverable, ...this.state.deliverables]
                            })

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
                {this.state.deliverables.map(deliverable => {
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