import React, {useEffect} from "react";
import Grid from "@mui/material/Grid";
import DialogContentText from '@mui/material/DialogContentText';
import {useDispatch, useSelector} from "react-redux";
import {getDeliverablesRequest} from "../../redux/deliverables/DeliverablesActions";


export default function DeliverableInformation(props) {
    const dispatch = useDispatch();
    const deliverables = useSelector(state => state.deliverables.deliverables);

    function componentDidMount() {
        dispatch(getDeliverablesRequest(props.taskUUID));

    }

    useEffect(componentDidMount, []);

    return (
        <Grid container
              spacing={0}
              direction={"column"}
              justifyContent={"flex-start"}
              alignItems={"center"}
        >
            {Object.values(deliverables).map(deliverable => {
                return (
                    <Grid item>
                        <DialogContentText>
                            {deliverable.type ? deliverable.type : "Unknown deliverable type."}
                        </DialogContentText>
                    </Grid>
                )

            })
            }
        </Grid>
    );
}
