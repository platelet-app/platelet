import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CompactUserCard from "./CompactUserCard";
import { DataStore } from "aws-amplify";
import * as models from "../models/index";
import { Box } from "@mui/material";
import { matchSorter } from "match-sorter";

const filterOptions = (options: models.User[], input: any) => {
    const { inputValue } = input;
    return matchSorter(options, inputValue, { keys: ["displayName"] });
};

type RiderPickerProps = {
    onSelect: (selectedItem: models.User) => void;
    label?: string;
    exclude?: string[];
    size?: "small" | "medium";
};

const RiderPicker: React.FC<RiderPickerProps> = ({
    onSelect,
    label = "Search...",
    exclude = [],
    size = "small",
}) => {
    const [availableUsers, setAvailableUsers] = useState<models.User[]>([]);
    const [filteredRiderSuggestions, setFilteredRiderSuggestions] = useState<
        models.User[]
    >([]);
    const [reset, setReset] = useState(false);
    const onSelectUser = (event: any, selectedItem: models.User | null) => {
        if (selectedItem) onSelect(selectedItem);
        // toggle reset so that the key changes and the rider select re-renders
        setReset((prevState) => !prevState);
    };
    async function getRiders() {
        try {
            const users = await DataStore.query(models.User, (u) =>
                u.roles.contains(models.Role.RIDER)
            );
            setAvailableUsers(users);
        } catch (e) {
            console.log(e);
            setAvailableUsers([]);
        }
    }
    useEffect(() => {
        getRiders();
    }, []);

    useEffect(() => {
        const filteredSuggestions = availableUsers.filter(
            (u) => !exclude.includes(u.id)
        );
        // const vehicleUsers = filteredSuggestions.filter(
        //     (user) => user.assigned_vehicles.length !== 0
        // );
        // const noVehicleUsers = filteredSuggestions.filter(
        //     (user) => user.assigned_vehicles.length === 0
        // );
        //const reorderedUsers = vehicleUsers.concat(noVehicleUsers);
        setFilteredRiderSuggestions(filteredSuggestions);
    }, [availableUsers, JSON.stringify(exclude)]);

    return (
        <>
            <Autocomplete
                fullWidth
                key={reset ? "reset" : "not reset"}
                filterOptions={filterOptions}
                data-cy="combo-box-riders"
                options={filteredRiderSuggestions}
                getOptionLabel={(option) => option.displayName}
                size={size}
                onChange={onSelectUser}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        size={"small"}
                        variant="outlined"
                        margin="none"
                    />
                )}
                renderOption={(props, option) => {
                    //const vehicleName =
                    //    option.assigned_vehicles &&
                    //    option.assigned_vehicles.length > 0
                    //        ? option.assigned_vehicles[
                    //              option.assigned_vehicles.length - 1
                    //          ].name
                    //        : "";
                    return (
                        <Box component="li" {...props}>
                            <CompactUserCard
                                userUUID={option.id}
                                displayName={option.displayName}
                                responsibility={
                                    option.riderResponsibility || ""
                                }
                                profilePictureThumbnail={option.profilePicture}
                            />
                        </Box>
                    );
                }}
            />
        </>
    );
};

export default RiderPicker;
