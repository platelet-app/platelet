import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DeliverablesSkeleton from "./components/DeliverablesSkeleton";
import { Box, Stack, Typography } from "@mui/material";
import Link from "@mui/material/Link";
import { DataStore, Predicates, SortDirection } from "aws-amplify";
import * as models from "../../models/index";
import { dataStoreModelSyncedStatusSelector } from "../../redux/Selectors";
import EditableDeliverable from "./components/EditableDeliverable";
import AddableDeliverable from "./components/AddableDeliverable";
import _ from "lodash";
import GetError from "../../ErrorComponents/GetError";
import DeliverableTags from "./DeliverableTags";
import { makeStyles } from "tss-react/mui";
import convertModelsToObject from "../../utilities/convertModelsToObject";

const initialDeliverablesSortedState = {
    deliverables: [],
    defaults: [],
};

const tagsReducer = (
    previousValue: (string | null)[],
    currentValue: (string | null)[] = []
) => {
    if (!currentValue) {
        return previousValue;
    }
    const filtered = currentValue.filter((t) => !previousValue.includes(t));
    return [...previousValue, ...filtered];
};
const useStyles = makeStyles()((theme) => ({
    hint: {
        fontStyle: "italic",
        fontSize: 15,
        color: "gray",
        "&:hover": {
            color: theme.palette.text.primary,
        },
    },
}));

type DeliverableGridSelectProps = {
    deliverables?: models.Deliverable[];
    onChange: (...args: any[]) => any;
    onDelete: (id: string) => any;
    disabled?: boolean;
};

export type BasicDeliverableType = {
    count: number;
    id: string;
    label: string;
    unit: models.DeliverableUnit;
    orderInGrid: number;
    icon: models.DeliverableTypeIcon;
};

type DeliverablesSortedStateType = {
    deliverables: BasicDeliverableType[];
    defaults: models.DeliverableType[];
};

type StateType = {
    [key: string]: BasicDeliverableType;
};

type AvailableDeliverablesType = {
    [key: string]: models.DeliverableType;
};

const DeliverableGridSelect: React.FC<DeliverableGridSelectProps> = ({
    deliverables = [],
    onChange,
    onDelete,
    disabled,
}) => {
    const [deliverablesSorted, setDeliverablesSorted] =
        useState<DeliverablesSortedStateType>(initialDeliverablesSortedState);
    const [state, setState] = useState<StateType>({});
    const [tags, setTags] = useState<(string | null)[]>([]);
    const [currentTag, setCurrentTag] = useState<string | null>(null);
    const [errorState, setErrorState] = useState<Error | null>(null);
    const [truncated, setTruncated] = useState(true);
    const [availableDeliverables, setAvailableDeliverables] =
        useState<AvailableDeliverablesType>({});
    const [suggestedDeliverables, setSuggestedDeliverables] = useState<
        string[]
    >([]);
    const availableDeliverableModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).DeliverableType;
    const [isFetching, setIsFetching] = useState(false);
    const { classes } = useStyles();

    const calculateTags = React.useCallback(() => {
        const existingTags = Object.values(deliverablesSorted.defaults).map(
            (deliverableType) => deliverableType.tags || []
        );
        const suggestions = existingTags.reduce(tagsReducer, []);
        if (!suggestions.includes(currentTag)) setCurrentTag(null);
        const filtered = suggestions.filter((t) => t !== null);
        setTags(filtered);
    }, [currentTag, deliverablesSorted.defaults]);

    useEffect(() => {
        calculateTags();
    }, [calculateTags]);

    function convertExistingDeliverablesToState() {
        const result: StateType = {};
        for (const d of deliverables) {
            const deliverableType =
                availableDeliverables[
                    d.deliverableType?.id as keyof models.DeliverableType
                ];
            result[d.deliverableType?.id as keyof models.DeliverableType] = {
                count: d.count || 0,
                id: d.deliverableType?.id || "",
                label: deliverableType ? deliverableType.label : "",
                unit:
                    (d.unit as models.DeliverableUnit) ||
                    (models.DeliverableUnit.NONE as models.DeliverableUnit),
                orderInGrid: d.orderInGrid || 0,
                icon: deliverableType
                    ? (deliverableType.icon as models.DeliverableTypeIcon)
                    : models.DeliverableTypeIcon.OTHER,
            };
        }
        setState(result);
    }

    // prevent infinite loop
    const deliverablesJSON = JSON.stringify(deliverables);
    useEffect(convertExistingDeliverablesToState, [
        availableDeliverables,
        deliverablesJSON,
    ]);

    function sortDeliverables() {
        const result: DeliverablesSortedStateType = {
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
            (a, b) => a.orderInGrid - b.orderInGrid
        );
        setDeliverablesSorted(result);
    }

    useEffect(sortDeliverables, [availableDeliverables, state]);

    async function getAvailableDeliverables() {
        try {
            const availableDeliverablesResult = await DataStore.query(
                models.DeliverableType,
                Predicates.ALL,
                {
                    sort: (s) => s.createdAt(SortDirection.ASCENDING),
                }
            );
            setAvailableDeliverables(
                convertModelsToObject<models.DeliverableType>(
                    availableDeliverablesResult
                )
            );
            setIsFetching(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorState(error);
            }
            console.log(error);
        }
    }
    useEffect(() => {
        getAvailableDeliverables();
    }, [availableDeliverableModelSynced]);

    function tagFilterAvailableDeliverables() {
        let result = [];
        if (currentTag) {
            for (const i of Object.values(availableDeliverables)) {
                if (i && i.tags && i.tags.includes(currentTag)) {
                    result.push(i.id);
                }
            }
        } else {
            result = Object.values(availableDeliverables).map((d) => d.id);
        }
        setSuggestedDeliverables(result);
    }
    useEffect(tagFilterAvailableDeliverables, [
        currentTag,
        availableDeliverables,
    ]);
    function onAddNewDeliverable(
        deliverable: models.Deliverable & models.DeliverableType
    ) {
        let orderInGrid = 0;
        for (const d of Object.values(state)) {
            if (d.orderInGrid >= orderInGrid) orderInGrid = d.orderInGrid + 1;
        }
        setState((prevState) => ({
            ...prevState,
            [deliverable.id]: {
                id: deliverable.id,
                count: 1,
                label: deliverable.label,
                unit: deliverable.unit as models.DeliverableUnit,
                icon: deliverable.icon as models.DeliverableTypeIcon,
                orderInGrid,
            },
        }));
        const { createdAt, updatedAt, icon, ...rest } = deliverable;
        onChange({ ...rest, orderInGrid });
    }
    function onChangeUnit(deliverableId: string, unit: models.DeliverableUnit) {
        const existing = state[deliverableId];
        if (existing) {
            setState((prevState) => ({
                ...prevState,
                [deliverableId]: { ...prevState[deliverableId], unit },
            }));
        }
        onChange({ id: deliverableId, unit });
    }
    function onChangeCount(deliverableId: string, count: number) {
        const existing = state[deliverableId];
        if (existing) {
            setState((prevState) => ({
                ...prevState,
                [deliverableId]: { ...prevState[deliverableId], count },
            }));
        }
        onChange({ id: deliverableId, count });
    }
    function onDeleteDeliverable(deliverableId: string) {
        setState((prevState) => _.omit(prevState, deliverableId));
        onDelete(deliverableId);
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
            <Box>
                <Typography className={classes.hint}>
                    Select a tag to find an item quickly
                </Typography>
                <DeliverableTags
                    onSelect={(value) => setCurrentTag(value)}
                    tags={tags}
                    value={currentTag}
                />
                <Box sx={{ marginBottom: 1 }} />
                <Stack
                    spacing={
                        deliverablesSorted.deliverables.length > 0 &&
                        deliverablesSorted.defaults.length > 0
                            ? 3
                            : 1
                    }
                    justifyContent={"flex-start"}
                    direction={"column"}
                >
                    <Stack spacing={1} direction={"column"}>
                        {deliverablesSorted.deliverables.map((deliverable) => {
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
                                        disabled={disabled}
                                        onChangeCount={onChangeCount}
                                        onChangeUnit={onChangeUnit}
                                        onDelete={onDeleteDeliverable}
                                        deliverable={deliverable}
                                    />
                                );
                            }
                        })}
                    </Stack>
                    <Stack spacing={1} direction={"column"}>
                        {deliverablesSorted.defaults.map((deliverableType) => {
                            if (
                                suggestedDeliverables.includes(
                                    deliverableType.id
                                )
                            ) {
                                count++;
                                if (!currentTag && count > 5 && truncated) {
                                    return (
                                        <React.Fragment
                                            key={deliverableType.id}
                                        ></React.Fragment>
                                    );
                                } else {
                                    return (
                                        <AddableDeliverable
                                            disabled={disabled}
                                            key={deliverableType.id}
                                            onAdd={onAddNewDeliverable}
                                            deliverableType={deliverableType}
                                        />
                                    );
                                }
                            } else {
                                return (
                                    <React.Fragment
                                        key={deliverableType.id}
                                    ></React.Fragment>
                                );
                            }
                        })}
                    </Stack>
                    {Object.values(availableDeliverables).length > 5 && (
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
                    )}
                </Stack>
            </Box>
        );
    }
};

export default DeliverableGridSelect;
