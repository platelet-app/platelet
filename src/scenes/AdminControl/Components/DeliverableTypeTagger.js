import React, { useEffect, useRef, useState } from "react";
import { Autocomplete, Chip, Grid, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";
import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import GetError from "../../../ErrorComponents/GetError";
import useFocus from "../../../hooks/useFocus";

const tagsReducer = (previousValue, currentValue = []) => {
    if (!currentValue) {
        return previousValue;
    }
    const filtered = currentValue.filter((t) => !previousValue.includes(t));
    return [...previousValue, ...filtered];
};

function DeliverableTypeTagger(props) {
    const [inputValue, setInputValue] = useState("");
    const [errorState, setErrorState] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [forceRerender, setForceRerender] = useState(null);
    const deliverableObserver = useRef({ unsubscribe: () => {} });
    const [allSuggestions, setAllSuggestions] = useState([]);

    const [inputRef, setInputFocus] = useFocus();

    async function calculateSuggestions() {
        try {
            deliverableObserver.current.unsubscribe();
            deliverableObserver.current = DataStore.observeQuery(
                models.DeliverableType
            ).subscribe(({ items }) => {
                const existingTags = items.map(
                    (deliverableType) => deliverableType.tags
                );
                const suggestions = existingTags.reduce(tagsReducer, []);
                setAllSuggestions(suggestions);
            });
        } catch (e) {
            console.log(e);
            setErrorState(e);
        }
    }
    useEffect(() => calculateSuggestions(), []);

    function observeChangesUnsubscribe() {
        return () => deliverableObserver.current.unsubscribe();
    }
    useEffect(observeChangesUnsubscribe, []);

    useEffect(() => {
        setSuggestions(allSuggestions.filter((s) => !props.value.includes(s)));
    }, [props.value, allSuggestions]);

    const handleAddition = (value) => {
        props.onAdd(value);
        setForceRerender((prevState) => !prevState);
        setInputValue("");
    };

    useEffect(() => {
        if (forceRerender !== null) {
            setInputFocus();
        }
    }, [forceRerender, setInputFocus]);

    if (errorState) {
        return <GetError />;
    } else {
        return (
            <Grid container alignItems="center" spacing={1} direction="row">
                {props.value.map((tag) => (
                    <Grid key={tag} item>
                        <Chip
                            onDelete={() => props.onDelete(tag)}
                            label={tag}
                        />
                    </Grid>
                ))}
                <Grid item>
                    <Typography
                        sx={{
                            color: "gray",
                            fontStyle: "italic",
                            marginBottom: 1,
                        }}
                    >
                        Press enter or comma to add another tag
                    </Typography>
                </Grid>
                <Grid sx={{ width: "100%", maxWidth: 250 }} item>
                    <Autocomplete
                        key={forceRerender}
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
                                e.target.value[e.target.value.length - 1] !==
                                    ","
                            )
                                setInputValue(e.target.value);
                        }}
                        id="deliverable-type-tags"
                        disableClearable
                        aria-label="add deliverable type tag"
                        fullWidth
                        options={suggestions}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    type: "search",
                                }}
                                inputRef={inputRef}
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
}

DeliverableTypeTagger.propTypes = {
    value: PropTypes.arrayOf(PropTypes.string),
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
};

DeliverableTypeTagger.defaultProps = {
    value: [],
    onAdd: () => {},
    onDelete: () => {},
};

export default DeliverableTypeTagger;
