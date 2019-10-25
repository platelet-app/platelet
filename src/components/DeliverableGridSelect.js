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
    };

    componentDidMount() {
        this.props.apiControl.tasks.getTask(this.props.taskId).then((data) => {
            this.setState({
                deliverables: data.deliverables
                }

            )
        })
    }

    onSelectDeliverableType(deliverableType) {
        this.props.onSelect(deliverableType, "lol")
    }

    render() {
        const deliverableSelectRow =
            <DeliverableDropSelect availableDeliverables={this.props.availableDeliverables} deliverableType={1} onSelect={this.props.onSelect}/>;
        const circleAdd =
            <StyledAddCircleOutlineSmall
                onClick={() => {
                    let newDeliverable = {...this.emptyDeliverable};
                    console.log(newDeliverable)
                    this.props.apiControl.deliverables.createDeliverable(newDeliverable).then((data) => {
                        newDeliverable.uuid = data.uuid;
                        this.setState({
                            deliverables: [newDeliverable, ...this.state.deliverables]
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
                    return <><Grid item>{deliverableSelectRow}</Grid></>
                })
                }
            </Grid>
        )

    }
}