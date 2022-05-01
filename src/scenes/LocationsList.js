import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import LocationCard from "../components/LocationCard";
import { PaddedPaper } from "../styles/common";
import { dataStoreReadyStatusSelector, getWhoami } from "../redux/Selectors";
import { DataStore } from "aws-amplify";
import * as models from "../models/index";
import { displayErrorNotification } from "../redux/notifications/NotificationsActions";
import { Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { matchSorter } from "match-sorter";
import makeStyles from "@mui/styles/makeStyles";
import { TextFieldControlled } from "../components/TextFields";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";

const useStyles = makeStyles((theme) => {
    return {
        root: {
            [theme.breakpoints.down("md")]: {
                width: "100%",
            },
        },
        searchIcon: {
            [theme.breakpoints.down("md")]: {
                display: "none",
            },
        },
    };
});

function sortByName(a, b) {
    return a.name.localeCompare(b.name);
}

export default function LocationsList() {
    const locationsRef = useRef([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const whoami = useSelector(getWhoami);
    const dispatch = useDispatch();
    const classes = useStyles();
    const observer = useRef({ unsubscribe: () => {} });

    function onChangeFilterText(e) {
        setFilteredLocations(
            matchSorter(locationsRef.current, e.target.value, {
                keys: ["name"],
            })
        );
    }

    async function getLocations() {
        try {
            observer.current = DataStore.observeQuery(models.Location, (loc) =>
                loc.listed("eq", 1)
            ).subscribe((result) => {
                const sorted = result.items.sort(sortByName);
                locationsRef.current = sorted;
                setFilteredLocations(sorted);
            });
        } catch (error) {
            console.log("Request failed", error);
            if (error && error.message)
                dispatch(displayErrorNotification(error.message));
        }
    }
    useEffect(() => getLocations(), []);

    const addButton = whoami.roles.includes("ADMIN") ? (
        <Button component={Link} to={`/admin/add-location`}>
            Add location
        </Button>
    ) : (
        <></>
    );

    return (
        <Stack
            direction={"column"}
            spacing={2}
            alignItems={"flex-start"}
            justifyContent={"center"}
        >
            {addButton}
            <TextFieldControlled
                variant={"standard"}
                placeholder={"Filter locations"}
                onChange={onChangeFilterText}
                color={"secondary"}
                className={classes.root}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon className={classes.searchIcon} />
                        </InputAdornment>
                    ),
                }}
            />
            <PaddedPaper maxWidth={"800px"}>
                <Stack direction={"column"} spacing={1}>
                    {Object.values(filteredLocations).map((loc) => {
                        return (
                            <LocationCard
                                key={loc.id}
                                uuid={loc.id}
                                name={loc.name}
                            />
                        );
                    })}
                </Stack>
            </PaddedPaper>
        </Stack>
    );
}
