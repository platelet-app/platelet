import React from "react";
import { Button, Divider, Paper, Stack } from "@mui/material";
import ScheduledTaskCallerDetails from "./ScheduledTaskCallerDetails";
import * as models from "../../../models";
import { PaddedPaper } from "../../../styles/common";
import ScheduledTaskPickUpAndDropOffDetails from "./ScheduledTaskPickUpAndDropOffDetails";

const initialState = {
    contact: {
        name: "",
        telephoneNumber: "",
    },
    establishment: null,
};

type StateType = {
    contact: {
        name: string;
        telephoneNumber: string;
    };
    establishment: models.Location | null;
};

export type LocationsType = {
    pickUpLocation: models.Location | null;
    dropOffLocation: models.Location | null;
};

const AdminAddScheduledTask: React.FC = () => {
    const [state, setState] = React.useState<StateType>(initialState);
    const onChangeContact = (value: StateType["contact"]) => {
        setState((prevState) => ({
            ...prevState,
            contact: value,
        }));
    };
    const onChangeEstablishment = (value: StateType["establishment"]) => {
        setState((prevState) => ({
            ...prevState,
            establishment: value,
        }));
    };

    const locations = React.useRef<LocationsType>({
        pickUpLocation: null,
        dropOffLocation: null,
    });

    const handleLocationChange = (
        key: keyof LocationsType,
        value: models.Location | null
    ) => {
        locations.current[key] = value;
    };

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
                    onChange={handleLocationChange}
                />
            </Stack>
        </PaddedPaper>
    );
};

export default AdminAddScheduledTask;
