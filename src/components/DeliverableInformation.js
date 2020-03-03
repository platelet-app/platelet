import React, {useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import DialogContentText from '@material-ui/core/DialogContentText';
import {useDispatch, useSelector} from "react-redux";
import {getDeliverables} from "../redux/Actions";


export default function DeliverableInformation(props) {
    const dispatch = useDispatch();
    const deliverables = useSelector(state => state.deliverables);
    function componentDidMount() {
        dispatch(getDeliverables(props.taskUUID));

    }

    useEffect(componentDidMount, []);

    return (
        <Grid container
              spacing={0}
              direction={"column"}
              justify={"flex-start"}
              alignItems={"flex-start"}
        >
            {deliverables.map(deliverable => {
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
