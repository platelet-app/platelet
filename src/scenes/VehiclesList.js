import React, { useEffect, useState, useRef } from "react";
import "../App.css";
import { PaddedPaper, ThemedLink } from "../styles/common";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { encodeUUID, sortByCreatedTime } from "../utilities";
import { useDispatch, useSelector } from "react-redux";
import VehicleCard from "../components/VehicleCard";
import { DataStore } from "aws-amplify";
import * as models from "../models/index";
import { displayErrorNotification } from "../redux/notifications/NotificationsActions";
import { getWhoami } from "../redux/Selectors";
import { Stack } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { TextFieldControlled } from "../components/TextFields";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { matchSorter } from "match-sorter";
import makeStyles from "@mui/styles/makeStyles";

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

function VehicleList() {
    const whoami = useSelector(getWhoami);
    const vehiclesRef = useRef([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const classes = useStyles();
    const vehiclesObserver = useRef({ unsubscribe: () => {} });

    function onChangeFilterText(e) {
        setFilteredVehicles(
            matchSorter(vehiclesRef.current, e.target.value, {
                keys: ["name", "manufacturer", "model", "registrationNumber"],
            })
        );
    }

    const addButton = whoami.roles.includes("ADMIN") ? (
        <Button component={Link} to={`/admin/add-vehicle`}>
            Add vehicle
        </Button>
    ) : (
        <></>
    );
    async function getVehicles() {
        vehiclesObserver.current = DataStore.observeQuery(
            models.Vehicle
        ).subscribe(({ items }) => {
            vehiclesRef.current = items;
            setFilteredVehicles(items);
        });
        return () => vehiclesObserver.current.unsubscribe();
    }

    useEffect(() => getVehicles(), []);

    return (
        <Stack
            spacing={2}
            direction={"column"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
        >
            {addButton}
            <TextFieldControlled
                variant={"standard"}
                placeholder={"Filter vehicles"}
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
            <PaddedPaper width={"800px"}>
                <Stack
                    spacing={1}
                    direction={"column"}
                    justifyContent={"flex-start"}
                >
                    {sortByCreatedTime(
                        Object.values(filteredVehicles),
                        "newest"
                    ).map((vehicle) => (
                        <ThemedLink
                            to={"/vehicle/" + encodeUUID(vehicle.id)}
                            style={{
                                textDecoration: "none",
                            }}
                        >
                            <VehicleCard vehicle={vehicle} />
                        </ThemedLink>
                    ))}
                </Stack>
            </PaddedPaper>
        </Stack>
    );
}

export default VehicleList;
