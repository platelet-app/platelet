import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { updateDeliverableRequest } from "../../redux/deliverables/DeliverablesActions";
import { useDispatch, useSelector } from "react-redux";
import DeliverablesSkeleton from "./components/DeliverablesSkeleton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Paper } from "@material-ui/core";
import { dialogCardStyles } from "../Task/styles/DialogCompactStyles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { DataStore, Predicates, SortDirection } from "aws-amplify";
import * as models from "../../models/index";
import { dataStoreReadyStatusSelector } from "../../redux/Selectors";
import { convertListDataToObject, sortByCreatedTime } from "../../utilities";
import PropTypes from "prop-types";
import EditableDeliverable from "./components/EditableDeliverable";
import AddableDeliverable from "./components/AddableDeliverable";
import _ from "lodash";

const useStyles = makeStyles({
    root: {
        width: "100%",
        maxWidth: 350,
    },
    truncate: {
        maxHeight: 410,
    },
});

const initialDeliverablesSortedState = {
    deliverables: [],
    defaults: [],
};

function DeliverableGridSelect(props) {
    const [deliverablesSorted, setDeliverablesSorted] = useState(
        initialDeliverablesSortedState
    );
    const [deliverables, setDeliverables] = useState({});
    const [truncated, setTruncated] = useState(false);
    const [availableDeliverables, setAvailableDeliverables] = useState({});
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [isFetching, setIsFetching] = useState(false);
    const classes = useStyles();
    const cardClasses = dialogCardStyles();

    function convertExistingDeliverablesToState() {
        const result = {};
        for (const d of props.deliverables) {
            const deliverableType =
                availableDeliverables[d.deliverableTypeDeliverableTypeId];
            result[d.deliverableTypeDeliverableTypeId] = {
                count: d.count,
                id: d.deliverableTypeDeliverableTypeId,
                label: deliverableType ? deliverableType.label : "",
                createdAt: d.createdAt,
                orderInGrid: d.orderInGrid,
            };
        }
        setDeliverables(result);
    }
    useEffect(convertExistingDeliverablesToState, [
        props.deliverables,
        availableDeliverables,
    ]);

    function sortDeliverables() {
        const result = {
            deliverables: [],
            defaults: [],
        };
        for (const i of Object.values(availableDeliverables)) {
            const value = deliverables[i.id];
            if (value) {
                result.deliverables.push(value);
            } else {
                result.defaults.push(i);
            }
        }
        result.deliverables = result.deliverables.sort(
            (a, b) => parseInt(a.orderInGrid) - parseInt(b.orderInGrid)
        );
        setDeliverablesSorted(result);
        console.log(result);
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
            setAvailableDeliverables(
                convertListDataToObject(availableDeliverablesResult)
            );
            setIsFetching(false);
        }
    }

    useEffect(() => getAvailableDeliverables(), []);

    function onAddNewDeliverable(deliverable) {
        let orderInGrid = 0;
        for (const d of Object.values(deliverables)) {
            if (d.orderInGrid > orderInGrid);
            orderInGrid = parseInt(d.orderInGrid) + 1;
        }
        setDeliverables((prevState) => ({
            ...prevState,
            [deliverable.id]: {
                ...deliverable,
                orderInGrid,
                createdAt: new Date().toISOString(),
            },
        }));
        props.onChange({ ...deliverable, orderInGrid });
    }

    const onChangeCount = (deliverableId, count) => {
        const existing = deliverables[deliverableId];
        if (existing) {
            setDeliverables((prevState) => ({
                ...prevState,
                [deliverableId]: { ...prevState[deliverableId], count },
            }));
        }
        props.onChange({ id: deliverableId, count });
    };

    function onDelete(deliverableId) {
        setDeliverables((prevState) => _.omit(prevState, deliverableId));
        props.onDelete(deliverableId);
    }

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
                <Grid
                    container
                    spacing={2}
                    justify={"flex-start"}
                    direction={"column"}
                >
                    <Grid item>
                        <Grid
                            container
                            spacing={1}
                            className={classes.root}
                            direction={"column"}
                        >
                            {deliverablesSorted.deliverables.map(
                                (deliverable) => {
                                    count++;
                                    return (
                                        <Grid item key={deliverable.id}>
                                            {count > 5 && truncated ? (
                                                <></>
                                            ) : (
                                                <EditableDeliverable
                                                    onChangeCount={
                                                        onChangeCount
                                                    }
                                                    onDelete={onDelete}
                                                    deliverable={deliverable}
                                                />
                                            )}
                                        </Grid>
                                    );
                                }
                            )}
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid
                            container
                            spacing={1}
                            className={classes.root}
                            direction={"column"}
                        >
                            {deliverablesSorted.defaults.map(
                                (deliverableType) => {
                                    count++;
                                    return (
                                        <Grid item key={deliverableType.id}>
                                            {count > 5 && truncated ? (
                                                <></>
                                            ) : (
                                                <AddableDeliverable
                                                    onAdd={onAddNewDeliverable}
                                                    deliverableType={
                                                        deliverableType
                                                    }
                                                />
                                            )}
                                        </Grid>
                                    );
                                }
                            )}
                        </Grid>
                    </Grid>
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

DeliverableGridSelect.propTypes = {
    deliverables: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
};
DeliverableGridSelect.defaultProps = {
    deliverables: [],
    onChange: () => {},
    onDelete: () => {},
};

export default DeliverableGridSelect;
