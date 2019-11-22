import React from "react";
import Grid from "@material-ui/core/Grid";
import {StyledAddCircleOutlineSmall} from "../css/common";
import DeliverableDropSelect from "./DeliverableDropSelect";
import update from 'immutability-helper';
import {Typography} from "@material-ui/core";
import DialogContentText from '@material-ui/core/DialogContentText';


export default class DeliverableInformation extends React.Component {

    componentDidMount() {
        this.props.apiControl.tasks.getTask(this.props.taskId).then((data) => {
            this.setState({
                    deliverables: data.deliverables
                }

            )
        })
    }

    state = {
        deliverables: []
    };

    render() {
        return (
            <Grid container
                  spacing={0}
                  direction={"column"}
                  justify={"flex-start"}
                  alignItems={"flex-start"}
            >
                {this.state.deliverables.map(deliverable => {
                    return <><Grid item>
                        <DialogContentText>
                            {deliverable.type ? deliverable.type : "Unknown deliverable type."} {deliverable.notes.length && deliverable.notes[0].body ? "|" : ""} {deliverable.notes.length ? deliverable.notes[0].body : ""}
                        </DialogContentText>
                    </Grid></>

                })
                }
            </Grid>
        )

    }
}
