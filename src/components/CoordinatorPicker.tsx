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

type CoordinatorPickerProps = {
    onSelect: (selectedItem: models.User) => void;
    label?: string;
    exclude?: string[];
    size?: "small" | "medium";
};

const CoordinatorPicker: React.FC<CoordinatorPickerProps> = ({
    onSelect,
    label = "Search...",
    exclude = [],
    size = "small",
}) => {
    const [availableUsers, setAvailableUsers] = useState<models.User[]>([]);
    const [filteredCoordinatorSuggestions, setFilteredCoordinatorSuggestions] =
        useState<models.User[]>([]);
    const [reset, setReset] = useState(false);

    const onSelectUser = (event: any, selectedItem: models.User | null) => {
        if (selectedItem) onSelect(selectedItem);
        // toggle reset so that the key changes and the coordinator select re-renders
        setReset((prevState) => !prevState);
    };

    async function getCoordinators() {
        try {
            const coords = await DataStore.query(models.User, (u) =>
                u.roles.contains(models.Role.COORDINATOR)
            );
            setAvailableUsers(coords);
        } catch (e) {
            setAvailableUsers([]);
            console.log(e);
        }
    }

    useEffect(() => {
        getCoordinators();
    }, []);

    useEffect(() => {
        const filteredSuggestions = availableUsers.filter(
            (u) => !exclude.includes(u.id)
        );
        setFilteredCoordinatorSuggestions(filteredSuggestions);
    }, [state, JSON.stringify(exclude)]);

    return (
        <div>
            <Autocomplete
                fullWidth
                key={reset ? "reset" : "not reset"}
                filterOptions={filterOptions}
                data-cy="combo-box-coordinators"
                options={filteredCoordinatorSuggestions}
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
                    return (
                        <Box component="li" {...props}>
                            <CompactUserCard
                                userUUID={option.id}
                                displayName={option.displayName}
                                profilePictureThumbnail={option.profilePicture}
                            />
                        </Box>
                    );
                }}
            />
        </div>
    );
};

export default CoordinatorPicker;
