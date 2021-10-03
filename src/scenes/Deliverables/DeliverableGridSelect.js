import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import {
    addDeliverableRequest,
    deleteDeliverableRequest,
    getDeliverablesRequest,
    updateDeliverableRequest,
} from "../../redux/deliverables/DeliverablesActions";
import { useDispatch, useSelector } from "react-redux";
import {
    createDeletingSelector,
    createLoadingSelector,
    createPostingSelector,
} from "../../redux/LoadingSelectors";
import DeliverableCard from "./components/DeliverableCard";
import DeliverablesSkeleton from "./components/DeliverablesSkeleton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import styled from "@material-ui/core/styles/styled";
import Box from "@material-ui/core/Box";
import { Paper } from "@material-ui/core";
import { dialogCardStyles } from "../Task/styles/DialogCompactStyles";
import IncreaseDecreaseCounter from "../../components/IncreaseDecreaseCounter";
import { v4 as uuidv4 } from "uuid";
import { SmallCirclePlusButton } from "../../components/Buttons";
import Typography from "@material-ui/core/Typography";
import { showHide } from "../../styles/common";
import Link from "@material-ui/core/Link";
import { DataStore, Predicates, SortDirection } from "aws-amplify";
import * as models from "../../models/index";
import { dataStoreReadyStatusSelector } from "../../redux/Selectors";
import { convertListDataToObject, sortByCreatedTime } from "../../utilities";

const useStyles = makeStyles({
    root: {
        width: "100%",
        maxWidth: 350,
    },
    truncate: {
        maxHeight: 410,
    },
});

const DeliverableBox = styled(Box)({
    backgroundColor: "rgba(180, 180, 180, 0.1)",
    paddingLeft: 10,
});

const EditableDeliverable = (props) => {
    const deliverable = props.deliverable;
    const postingSelector = createPostingSelector(["ADD_DELIVERABLE"]);
    const isPosting = useSelector((state) => postingSelector(state));
    const deletingSelector = createDeletingSelector(["DELETE_DELIVERABLE"]);
    const isDeleting = useSelector((state) => deletingSelector(state));
    const dispatch = useDispatch();

    const addCounter =
        deliverable.count > 0 ? (
            <IncreaseDecreaseCounter
                value={deliverable.count || 0}
                disabled={isDeleting}
                onChange={(count) => props.onChange(deliverable, count)}
                onDelete={() => {
                    if (deliverable.uuid) {
                        dispatch(deleteDeliverableRequest(deliverable.uuid));
                    }
                }}
            />
        ) : (
            <SmallCirclePlusButton
                onClick={() => props.onChange(deliverable, 1)}
                disabled={isPosting}
            />
        );

    return (
        <DeliverableBox>
            <DeliverableCard
                compact
                label={
                    deliverable.deliverableType
                        ? deliverable.deliverableType.label
                        : deliverable.label
                }
                typeID={deliverable.id || deliverable.deliverableType.id}
            >
                {addCounter}
            </DeliverableCard>
        </DeliverableBox>
    );
};

const initialDeliverablesSortedState = {
    deliverables: [],
    defaults: [],
};

export default function DeliverableGridSelect(props) {
    const dispatch = useDispatch();
    const [deliverablesSorted, setDeliverablesSorted] = useState(
        initialDeliverablesSortedState
    );
    const [truncated, setTruncated] = useState(false);
    const [availableDeliverables, setAvailableDeliverables] = useState([]);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [deliverables, setDeliverables] = useState({});
    const [isFetching, setIsFetching] = useState(false);
    const classes = useStyles();
    const cardClasses = dialogCardStyles();
    console.log(deliverables);
    console.log(deliverablesSorted);

    function sortDeliverables() {
        const result = {
            deliverables: [],
            defaults: [],
        };
        for (const i of availableDeliverables) {
            const value = Object.values(deliverables).find(
                (d) => d.deliverableType && d.deliverableType.id === i.id
            );
            console.log(value);
            if (value) {
                console.log("found it");
                result.deliverables.push(value);
            } else {
                result.defaults.push(i);
            }
        }
        result["deliverables"] = sortByCreatedTime(
            result["deliverables"],
            "oldest"
        );
        setDeliverablesSorted(result);
    }
    useEffect(sortDeliverables, [availableDeliverables, deliverables]);

    async function getAvailableDeliverables() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            const availableDeliverablesResult = await DataStore.query(
                models.DeliverableType,
                Predicates.ALL,
                {
                    sort: (s) => s.createdAt(SortDirection.ASCENDING),
                }
            );
            setAvailableDeliverables(availableDeliverablesResult);
            setIsFetching(false);
        }
    }

    useEffect(() => getAvailableDeliverables(), []);

    async function getDeliverables() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            const deliverablesResult = await DataStore.query(
                models.Deliverable,
                (deliverable) =>
                    deliverable.taskDeliverablesId("eq", props.taskUUID)
            );
            setDeliverables(convertListDataToObject(deliverablesResult));
        }
    }
    useEffect(() => getDeliverables(), [props.taskUUID]);

    async function onAddNewDeliverable(deliverable) {
        let newDeliverable = {
            count: 1,
            deliverableTypeDeliverableTypeId: deliverable.id,
            taskDeliverableId: props.taskUUID,
        };
        const newDeliverableResult = await DataStore.save(
            new models.Deliverable(newDeliverable)
        );
        const newDeliverableType = await DataStore.query(
            models.DeliverableType,
            deliverable.id
        );
        setDeliverables((prevState) => ({
            ...prevState,
            [newDeliverableResult.id]: {
                ...newDeliverableResult,
                deliverableType: newDeliverableType,
            },
        }));
    }

    const onChange = (deliverable, count) => {
        if (deliverable.uuid) {
            dispatch(updateDeliverableRequest(deliverable.uuid, { count }));
        } else if (deliverable.id) {
            onAddNewDeliverable(deliverable);
        }
    };

    useEffect(
        () => setTruncated(availableDeliverables.length > 6),
        [availableDeliverables]
    );

    if (isFetching) {
        return <DeliverablesSkeleton />;
    } else {
        let count = 0;
        return (
            <Paper className={cardClasses.root}>
                <Grid container justify={"space-between"} direction={"column"}>
                    {Object.keys(deliverablesSorted).map((key) => {
                        return (
                            <Grid key={key} item>
                                <Grid
                                    container
                                    spacing={1}
                                    className={classes.root}
                                    direction={"column"}
                                >
                                    {deliverablesSorted[key].map(
                                        (deliverable) => {
                                            count++;
                                            return (
                                                <Grid
                                                    item
                                                    key={
                                                        deliverable.id ||
                                                        deliverable.uuid
                                                    }
                                                >
                                                    {count > 5 && truncated ? (
                                                        <></>
                                                    ) : (
                                                        <EditableDeliverable
                                                            onChange={onChange}
                                                            deliverable={
                                                                deliverable
                                                            }
                                                        />
                                                    )}
                                                </Grid>
                                            );
                                        }
                                    )}
                                </Grid>
                            </Grid>
                        );
                    })}
                    <Grid item>
                        <Link
                            href="#"
                            onClick={(e) => {
                                setTruncated(!truncated);
                                e.preventDefault();
                            }}
                            color="inherit"
                        >
                            {truncated ? "More..." : "Less..."}
                        </Link>
                        <Typography></Typography>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}
