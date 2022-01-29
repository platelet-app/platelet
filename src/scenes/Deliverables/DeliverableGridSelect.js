import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import DeliverablesSkeleton from "./components/DeliverablesSkeleton";
import { Chip, Grid, Stack } from "@mui/material";
import Link from "@mui/material/Link";
import { DataStore, Predicates, SortDirection } from "aws-amplify";
import * as models from "../../models/index";
import { dataStoreReadyStatusSelector } from "../../redux/Selectors";
import { convertListDataToObject } from "../../utilities";
import PropTypes from "prop-types";
import EditableDeliverable from "./components/EditableDeliverable";
import AddableDeliverable from "./components/AddableDeliverable";
import _ from "lodash";
import GetError from "../../ErrorComponents/GetError";

const initialDeliverablesSortedState = {
    deliverables: [],
    defaults: [],
};

const tagsReducer = (previousValue, currentValue = []) => {
    const filtered = currentValue.filter((t) => !previousValue.includes(t));
    return [...previousValue, ...filtered];
};

function DeliverableGridSelect(props) {
    const [deliverablesSorted, setDeliverablesSorted] = useState(
        initialDeliverablesSortedState
    );
    const [state, setState] = useState({});
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState(null);
    const [errorState, setErrorState] = useState(null);
    const [truncated, setTruncated] = useState(true);
    const [availableDeliverables, setAvailableDeliverables] = useState({});
    const [suggestedDeliverables, setSuggestedDeliverables] = useState([]);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [isFetching, setIsFetching] = useState(false);

    async function calculateTags() {
        const existingTags = Object.values(availableDeliverables).map(
            (deliverableType) => deliverableType.tags
        );
        const suggestions = existingTags.reduce(tagsReducer, []);
        setTags(suggestions);
    }

    useEffect(() => {
        calculateTags();
    }, [availableDeliverables]);

    function convertExistingDeliverablesToState() {
        const result = {};
        for (const d of props.deliverables) {
            const deliverableType = availableDeliverables[d.deliverableType.id];
            result[d.deliverableType.id] = {
                count: d.count,
                id: d.deliverableType.id,
                label: deliverableType ? deliverableType.label : "",
                createdAt: d.createdAt,
                unit: d.unit,
                orderInGrid: d.orderInGrid,
                icon: deliverableType ? deliverableType.icon : "",
            };
        }
        setState(result);
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
            const value = state[i.id];
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
    }
    useEffect(sortDeliverables, [availableDeliverables, state]);

    async function getAvailableDeliverables() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
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
            } catch (e) {
                setErrorState(e);
                console.log(e);
            }
        }
    }

    useEffect(() => getAvailableDeliverables(), []);

    function tagFilterAvailableDeliverables() {
        let result = [];
        if (currentTag) {
            console.log(currentTag);
            for (const i of Object.values(availableDeliverables)) {
                if (i && i.tags && i.tags.includes(currentTag)) {
                    result.push(i.id);
                }
            }
            console.log(result);
        } else {
            result = Object.values(availableDeliverables).map((d) => d.id);
        }
        setSuggestedDeliverables(result);
    }
    useEffect(tagFilterAvailableDeliverables, [
        currentTag,
        availableDeliverables,
    ]);

    function onAddNewDeliverable(deliverable) {
        let orderInGrid = 0;
        for (const d of Object.values(state)) {
            if (d.orderInGrid > orderInGrid);
            orderInGrid = parseInt(d.orderInGrid) + 1;
        }
        setState((prevState) => ({
            ...prevState,
            [deliverable.id]: {
                ...deliverable,
                orderInGrid,
            },
        }));
        const {
            createdAt,
            updatedAt,
            icon,
            _lastChangedAt,
            _deleted,
            _version,
            ...rest
        } = deliverable;
        props.onChange({ ...rest, orderInGrid });
    }

    function onChangeUnit(deliverableId, unit) {
        const existing = state[deliverableId];
        if (existing) {
            setState((prevState) => ({
                ...prevState,
                [deliverableId]: { ...prevState[deliverableId], unit },
            }));
        }
        props.onChange({ id: deliverableId, unit });
    }

    function onChangeCount(deliverableId, count) {
        const existing = state[deliverableId];
        if (existing) {
            setState((prevState) => ({
                ...prevState,
                [deliverableId]: { ...prevState[deliverableId], count },
            }));
        }
        props.onChange({ id: deliverableId, count });
    }

    function onDelete(deliverableId) {
        setState((prevState) => _.omit(prevState, deliverableId));
        props.onDelete(deliverableId);
    }

    useEffect(
        () => setTruncated(Object.values(availableDeliverables).length > 5),
        [availableDeliverables]
    );

    if (!!errorState) {
        return <GetError />;
    } else if (isFetching) {
        return <DeliverablesSkeleton />;
    } else {
        let count = 0;
        return (
            <Stack
                spacing={
                    deliverablesSorted.deliverables.length > 0 &&
                    deliverablesSorted.defaults.length > 0
                        ? 5
                        : 0
                }
                justifyContent={"flex-start"}
                direction={"column"}
            >
                <Stack
                    sx={{ marginBottom: 1 }}
                    spacing={1}
                    direction={"column"}
                >
                    <Grid container spacing={1} direction="row">
                        <Grid key={"all"} item>
                            <Chip
                                label={"All"}
                                onClick={() => {
                                    setCurrentTag(null);
                                }}
                                variant={currentTag ? "outlined" : "filled"}
                            />
                        </Grid>
                        {tags.map((tag) => (
                            <Grid key={tag} item>
                                <Chip
                                    label={tag}
                                    onClick={() => {
                                        if (tag === currentTag) {
                                            setCurrentTag(null);
                                        } else {
                                            setCurrentTag(tag);
                                        }
                                    }}
                                    variant={
                                        currentTag === tag
                                            ? "filled"
                                            : "outlined"
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>
                    {deliverablesSorted.deliverables.map((deliverable) => {
                        if (suggestedDeliverables.includes(deliverable.id)) {
                            count++;
                            if (!currentTag && count > 5 && truncated) {
                                return (
                                    <React.Fragment
                                        key={deliverable.id}
                                    ></React.Fragment>
                                );
                            } else {
                                return (
                                    <EditableDeliverable
                                        key={deliverable.id}
                                        disabled={props.disabled}
                                        onChangeCount={onChangeCount}
                                        onChangeUnit={onChangeUnit}
                                        onDelete={onDelete}
                                        deliverable={deliverable}
                                    />
                                );
                            }
                        } else {
                            return <></>;
                        }
                    })}
                </Stack>
                <Stack spacing={1} direction={"column"}>
                    {deliverablesSorted.defaults.map((deliverableType) => {
                        if (
                            suggestedDeliverables.includes(deliverableType.id)
                        ) {
                            count++;
                            if (count > 5 && truncated) {
                                return (
                                    <React.Fragment
                                        key={deliverableType.id}
                                    ></React.Fragment>
                                );
                            } else {
                                return (
                                    <AddableDeliverable
                                        disabled={props.disabled}
                                        key={deliverableType.id}
                                        onAdd={onAddNewDeliverable}
                                        deliverableType={deliverableType}
                                    />
                                );
                            }
                        } else {
                            return <></>;
                        }
                    })}
                </Stack>
                <Link
                    href="#"
                    onClick={(e) => {
                        setTruncated((prevState) => !prevState);
                        e.preventDefault();
                    }}
                    color="inherit"
                >
                    {!currentTag && (truncated ? "More..." : "Less...")}
                </Link>
            </Stack>
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
