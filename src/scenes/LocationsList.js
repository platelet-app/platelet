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
import Skeleton from '@mui/material/Skeleton';
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


export default function LocationsList() {
    const locationsRef = useRef([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const whoami = useSelector(getWhoami);
    const dispatch = useDispatch();
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const classes = useStyles();

    function onChangeFilterText(e) {
        setFilteredLocations(matchSorter(locationsRef.current, e.target.value, {keys: ['name']}))
    }

    async function getLocations() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const locations = await DataStore.query(
                    models.Location,
                    (loc) => loc.listed("eq", 1)
                );
                setIsFetching(false);
                locationsRef.current = locations;
                setFilteredLocations(locations);
            } catch (error) {
                console.log("Request failed", error);
                if (error && error.message)
                    dispatch(displayErrorNotification(error.message));
                setIsFetching(false);
            }
        }
    }
    useEffect(() => getLocations(), [dataStoreReadyStatus]);

    const addButton = whoami.roles.includes("ADMIN") ? (
        <Button component={Link} to={`/admin/add-location`}>
            Add location
        </Button>
    ) : (
        <></>
    );

    if (isFetching) {
        return (
            <Stack
                direction={"column"}
                spacing={3}
                alignItems={"flex-start"}
                justifyContent={"center"}
            >
                <PaddedPaper maxWidth={"800px"}>
                    <Stack direction={"column"}>
                        <Skeleton variant="text" width={500} height={50}/>
                        <Skeleton variant="text" width={500} height={50}/>
                        <Skeleton variant="text" width={500} height={50}/>
                        <Skeleton variant="text" width={500} height={50}/>
                    </Stack>
                </PaddedPaper>
            </Stack>
        )
    } else {
        return (
          <Stack
                direction={"column"}
                spacing={3}
                alignItems={"flex-start"}
                justifyContent={"center"}
            >
                <TextFieldControlled
                    id="tasks-filter-input"
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
                {addButton}
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
}
