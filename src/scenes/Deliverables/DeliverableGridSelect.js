import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {
    addDeliverableRequest,
    deleteDeliverableRequest,
    getDeliverablesRequest,
} from "../../redux/deliverables/DeliverablesActions";
import {useDispatch, useSelector} from "react-redux"
import {createLoadingSelector, createPostingSelector} from "../../redux/selectors";
import Button from "@material-ui/core/Button";
import DeliverableCard from "./components/DeliverableCard";
import DeliverablesSelect from "./components/DeliverableSelect";
import DeliverablesSkeleton from "./components/DeliverablesSkeleton";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";


export default function DeliverableGridSelect(props) {
    const dispatch = useDispatch();
    const availableDeliverables = useSelector(state => state.availableDeliverables.deliverables);
    const deliverables = useSelector(state => state.deliverables.deliverables);
    const postingSelector = createPostingSelector(["ADD_DELIVERABLE"]);
    const isPosting = useSelector(state => postingSelector(state));
    const loadingSelector = createLoadingSelector(["GET_DELIVERABLES"]);
    const isFetching = useSelector(state => loadingSelector(state));
    const [addMode, setAddMode] = useState(false);

    let emptyDeliverable = {
        task_uuid: props.taskUUID,
    };

    const onSelectDeliverable = (deliverable) => {
        let newDeliverable = {...emptyDeliverable, type_id: deliverable.id, type: deliverable.label};
        dispatch(addDeliverableRequest(newDeliverable))
        setAddMode(false);
    };

    const deliverablesSelect = addMode ?
        <DeliverablesSelect
            id="deliverableSelect"
            onSelect={onSelectDeliverable}
            label={"deliverables"}
        /> : <></>

    React.useEffect(() => {
        if (availableDeliverables.length > 0)
            dispatch(getDeliverablesRequest(props.taskUUID))

    }, [availableDeliverables]);

    const addButton =
        <Button
            variant={"contained"}
            color={"primary"}
            disabled={isPosting}
            onClick={() => {
                setAddMode(!addMode)
                return
                let newDeliverable = {...emptyDeliverable};
                dispatch(addDeliverableRequest(newDeliverable))
            }}
        >
            {addMode ? "Cancel" : "Add a deliverable"}
        </Button>

    if (isFetching) {
        return <DeliverablesSkeleton/>
    } else {
        return (
            <Grid container
                  spacing={1}
                  direction={"column"}
            >
                {Object.values(deliverables).map(deliverable => {
                    return (
                        <Grid item key={deliverable.uuid}>
                            <Grid container direction={"row"} justify={"space-between"} alignItems={"center"}>
                                <Grid item>
                            <DeliverableCard
                                size={"compact"}
                                label={deliverable.type}
                                typeID={deliverable.type_id}
                            />
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        color={"inherit"}
                                        onClick={() => dispatch(deleteDeliverableRequest(deliverable.uuid))}
                                    >
                                        <ClearIcon/>
                                    </IconButton>

                                </Grid>
                            </Grid>
                        </Grid>
                    )

                })
                }
                <Grid item>
                    {deliverablesSelect}
                </Grid>
                <Grid item>
                    {addButton}
                </Grid>
            </Grid>
        )
    }

}
