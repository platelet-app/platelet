import React from "react";
import { Button, Divider, Paper, Stack } from "@mui/material";
import ScheduledTaskCallerDetails from "./ScheduledTaskCallerDetails";
import * as models from "../../../models";
import { PaddedPaper } from "../../../styles/common";
import ScheduledTaskPickUpAndDropOffDetails from "./ScheduledTaskPickUpAndDropOffDetails";
import _ from "lodash";
import ScheduledTaskDeliverables from "./ScheduledTasksDeliverables";
import ScheduledTaskPriority from "./ScheduledTaskPriority";
import { useDispatch, useSelector } from "react-redux";
import { tenantIdSelector } from "../../../redux/Selectors";
import { DataStore } from "aws-amplify";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
import { encodeUUID } from "../../../utilities";

const initialState = {
    contact: {
        name: "",
        telephoneNumber: "",
    },
    establishment: null,
    priority: null,
    pickUpLocation: null,
    dropOffLocation: null,
};

type StateType = {
    contact: {
        name: string;
        telephoneNumber: string;
    };
    establishment: models.Location | null;
    priority: models.Priority | null;
    pickUpLocation: models.Location | null;
    dropOffLocation: models.Location | null;
};

const AdminAddScheduledTask: React.FC = () => {
    const [state, setState] = React.useState<StateType>(initialState);
    const [isPosting, setIsPosting] = React.useState(false);
    const [inputVerified, setInputVerified] = React.useState(false);
    const deliverables = React.useRef<Record<string, models.Deliverable>>({});
    const tenantId = useSelector(tenantIdSelector);
    const dispatch = useDispatch();
    const [resetForms, setResetForms] = React.useState(false);

    const onChangeContact = (value: StateType["contact"]) => {
        setState((prevState) => ({
            ...prevState,
            contact: { ...prevState.contact, ...value },
        }));
    };
    const onChangeEstablishment = (value: StateType["establishment"]) => {
        setState((prevState) => ({
            ...prevState,
            establishment: value,
        }));
    };

    const handleDeliverablesChange = (value: any) => {
        if (!value || !value.id) {
            return;
        }
        if (deliverables.current[value.id]) {
            deliverables.current = {
                ...deliverables.current,
                [value.id]: {
                    ...deliverables.current[value.id],
                    ...value,
                },
            };
        } else {
            deliverables.current = {
                ...deliverables.current,
                [value.id]: value,
            };
        }
    };

    const handleDeliverablesDelete = (value: string) => {
        if (!value) {
            return;
        }
        deliverables.current = _.omit(deliverables.current, value);
    };

    const handleLocationChange = (
        key: "pickUpLocation" | "dropOffLocation",
        value: models.Location | null
    ) => {
        setState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handlePriorityChange = (value: models.Priority | null) => {
        setState((prevState) => ({
            ...prevState,
            priority: value,
        }));
    };

    const addScheduledTask = async () => {
        try {
            setIsPosting(true);
            const newScheduledTask = new models.ScheduledTask({
                ...state,
                tenantId,
                cronExpression: "0 18 * * *",
            });
            const result = await DataStore.save(newScheduledTask);
            const deliverableModels = await Promise.all(
                Object.entries(deliverables.current).map(async ([id, d]) => {
                    const deliverableType = await DataStore.query(
                        models.DeliverableType,
                        id
                    );
                    return new models.Deliverable({
                        ...d,
                        deliverableType,
                        scheduledTask: result,
                    });
                })
            );
            await Promise.all(deliverableModels.map((d) => DataStore.save(d)));
            const base32 = encodeUUID(result.id);
            const viewLink = `/admin/scheduled-tasks/${base32}`;
            dispatch(
                displayInfoNotification(
                    "Scheduled task added",
                    undefined,
                    viewLink
                )
            );
            setState(initialState);
            setResetForms((prevState) => !prevState);
            deliverables.current = {};
        } catch (e) {
            console.error(e);
            dispatch(displayErrorNotification("Sorry, something went wrong"));
        } finally {
            setIsPosting(false);
        }
    };

    const verifyInput = () => {
        if (state.pickUpLocation && state.dropOffLocation) {
            setInputVerified(true);
        } else {
            setInputVerified(false);
        }
    };
    React.useEffect(verifyInput, [state.pickUpLocation, state.dropOffLocation]);

    return (
        <PaddedPaper maxWidth={800}>
            <Stack spacing={2} divider={<Divider />}>
                <ScheduledTaskCallerDetails
                    onChangeContact={onChangeContact}
                    onChangeEstablishment={onChangeEstablishment}
                    contact={state.contact}
                    establishment={state.establishment}
                />
                <ScheduledTaskPickUpAndDropOffDetails
                    reset={resetForms}
                    onChange={handleLocationChange}
                />
                <ScheduledTaskDeliverables
                    key={`${resetForms}deliverables`}
                    onChange={handleDeliverablesChange}
                    onDelete={handleDeliverablesDelete}
                />
                <ScheduledTaskPriority
                    onChange={handlePriorityChange}
                    value={state.priority}
                />
                <Button
                    disabled={!inputVerified || isPosting}
                    onClick={addScheduledTask}
                >
                    Add scheduled task
                </Button>
            </Stack>
        </PaddedPaper>
    );
};

export default AdminAddScheduledTask;
