import React from "react";
import { Button, Divider, Stack, Typography } from "@mui/material";
import ScheduledTaskCallerDetails from "./ScheduledTaskCallerDetails";
import * as models from "../../../models";
import { PaddedPaper } from "../../../styles/common";
import ScheduledTaskPickUpAndDropOffDetails from "./ScheduledTaskPickUpAndDropOffDetails";
import _ from "lodash";
import ScheduledTaskDeliverables from "./ScheduledTasksDeliverables";
import ScheduledTaskPriority from "./ScheduledTaskPriority";
import { useDispatch, useSelector } from "react-redux";
import { getWhoami, tenantIdSelector } from "../../../redux/Selectors";
import { DataStore } from "aws-amplify";
import {
    displayErrorNotification,
    displayInfoNotification,
} from "../../../redux/notifications/NotificationsActions";
import { encodeUUID } from "../../../utilities";
import Forbidden from "../../../ErrorComponents/Forbidden";

const initialState = {
    requesterContact: {
        name: "",
        telephoneNumber: "",
    },
    establishmentLocation: null,
    priority: null,
    pickUpLocation: null,
    dropOffLocation: null,
};

type StateType = {
    requesterContact: {
        name: string;
        telephoneNumber: string;
    };
    establishmentLocation: models.Location | null;
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
    const whoami = useSelector(getWhoami);

    const onChangeContact = (value: StateType["requesterContact"]) => {
        setState((prevState) => ({
            ...prevState,
            requesterContact: { ...prevState.requesterContact, ...value },
        }));
    };
    const onChangeEstablishment = (
        value: StateType["establishmentLocation"]
    ) => {
        setState((prevState) => ({
            ...prevState,
            establishmentLocation: value,
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
            const createdBy = await DataStore.query(models.User, whoami.id);
            let {
                pickUpLocation,
                dropOffLocation,
                establishmentLocation,
                ...rest
            } = state;
            if (pickUpLocation?.listed === 0) {
                pickUpLocation = await DataStore.save(
                    new models.Location({
                        ...pickUpLocation,
                        tenantId,
                    })
                );
            }
            if (dropOffLocation?.listed === 0) {
                dropOffLocation = await DataStore.save(
                    new models.Location({
                        ...dropOffLocation,
                        tenantId,
                    })
                );
            }
            if (establishmentLocation?.listed === 0) {
                establishmentLocation = await DataStore.save(
                    new models.Location({
                        ...establishmentLocation,
                        tenantId,
                    })
                );
            }
            const newScheduledTask = new models.ScheduledTask({
                ...rest,
                pickUpLocation,
                dropOffLocation,
                establishmentLocation,
                tenantId,
                createdBy,
                cronExpression: "0 18 * * *",
            });
            const result = await DataStore.save(newScheduledTask);
            const deliverableModels = await Promise.all(
                Object.entries(deliverables.current).map(async ([id, d]) => {
                    const deliverableType = await DataStore.query(
                        models.DeliverableType,
                        id
                    );
                    d = _.omit(d, "label");
                    return new models.Deliverable({
                        ...d,
                        deliverableType,
                        scheduledTask: result,
                    });
                })
            );
            await Promise.all(deliverableModels.map((d) => DataStore.save(d)));
            const base32 = encodeUUID(result.id);
            const viewLink = `/scheduled/${base32}`;
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
            console.log(e);
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

    if (!whoami.roles.includes(models.Role.ADMIN)) {
        return <Forbidden />;
    }

    return (
        <PaddedPaper maxWidth={800}>
            <Stack spacing={2} divider={<Divider />}>
                <ScheduledTaskCallerDetails
                    onChangeContact={onChangeContact}
                    onChangeEstablishment={onChangeEstablishment}
                    contact={state.requesterContact}
                    establishment={state.establishmentLocation}
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
