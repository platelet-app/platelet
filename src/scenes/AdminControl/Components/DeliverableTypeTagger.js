import React, { useEffect, useRef, useState } from "react";
import { Autocomplete, Chip, Grid, TextField } from "@mui/material";
import * as models from "../../../models";
import { DataStore } from "aws-amplify";

const tagsReducer = (previousValue, currentValue = []) => {
    if (!currentValue) {
        return previousValue;
    }
    const filtered = currentValue.filter((t) => !previousValue.includes(t));
    return [...previousValue, ...filtered];
};

export default function DeliverableTypeTagger(props) {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const deliverableObserver = useRef({ unsubscribe: () => {} });
    const allSuggestions = useRef([]);

    async function calculateSuggestions() {
        const existingDeliverableTypes = await DataStore.query(
            models.DeliverableType
        );
        const existingTags = existingDeliverableTypes.map(
            (deliverableType) => deliverableType.tags
        );
        const suggestions = existingTags.reduce(tagsReducer, []);
        setSuggestions(suggestions);
        allSuggestions.current = suggestions;
    }

    function observeChanges() {
        deliverableObserver.current = DataStore.observe(
            models.DeliverableType
        ).subscribe(() => {
            calculateSuggestions();
        });
        return () => deliverableObserver.current.unsubscribe();
    }

    useEffect(() => calculateSuggestions(), []);
    useEffect(observeChanges, []);
    useEffect(() => {
        setSuggestions(
            allSuggestions.current.filter((s) => !props.value.includes(s))
        );
    }, [props.value]);

    const handleAddition = (value) => {
        props.onAdd(value);
        setInputValue("");
    };

    return (
        <Grid container alignItems="center" spacing={1} direction="row">
            {props.value.map((tag) => (
                <Grid key={tag} item>
                    <Chip onDelete={() => props.onDelete(tag)} label={tag} />
                </Grid>
            ))}
            <Grid sx={{ width: "100%", maxWidth: 250 }} item>
                <Autocomplete
                    freeSolo
                    onChange={(event, newValue) => {
                        handleAddition(newValue);
                    }}
                    inputValue={inputValue}
                    onInputChange={(e) => {
                        if (!e) {
                            setInputValue("");
                        } else if (
                            e &&
                            e.target.value[e.target.value.length - 1] !== ","
                        )
                            setInputValue(e.target.value);
                    }}
                    id="deliverable-type-tags"
                    disableClearable
                    fullWidth
                    options={suggestions}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            InputProps={{
                                ...params.InputProps,
                                type: "search",
                            }}
                            fullWidth
                            size="small"
                            onKeyUp={(ev) => {
                                switch (ev.key) {
                                    case ",": {
                                        handleAddition(inputValue);
                                        ev.preventDefault();
                                        break;
                                    }
                                    case "Escape": {
                                        setInputValue("");
                                        ev.preventDefault();
                                        break;
                                    }
                                    default:
                                        break;
                                }
                            }}
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
}
