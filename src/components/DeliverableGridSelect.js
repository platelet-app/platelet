import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {addDeliverable, getDeliverables, updateDeliverable} from "../redux/deliverables/DeliverablesActions";
import {useDispatch, useSelector} from "react-redux"
import {createLoadingSelector, createPostingSelector} from "../redux/selectors";
import Button from "@material-ui/core/Button";
import DeliverableCard from "./DeliverableCard";
import DeliverablesSelect from "./DeliverableSelect";
import DeliverablesSkeleton from "../loadingComponents/DeliverablesSkeleton";


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
        let newDeliverable = {...emptyDeliverable, ...deliverable};
        dispatch(addDeliverable(newDeliverable))
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
            dispatch(getDeliverables(props.taskUUID))

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
                dispatch(addDeliverable(newDeliverable))
            }}
        >
            {addMode ? "Cancel" : "Add a deliverable"}
        </Button>

    if (isFetching) {
        return <DeliverablesSkeleton/>
    } else {
        return (
            <Grid container
                  spacing={2}
                  direction={"column"}
                  justify={"flex-start"}
                  alignItems={"flex-start"}
            >
                {deliverables.map(deliverable => {
                    return (
                        <Grid item key={deliverable.uuid}>
                            <DeliverableCard deliverable={deliverable}/>
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
