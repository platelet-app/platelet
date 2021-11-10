import React, { useEffect, useState } from "react";
import "../App.css";
import { PaddedPaper, ThemedLink } from "../styles/common";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { encodeUUID, sortByCreatedTime } from "../utilities";
import { useDispatch, useSelector } from "react-redux";
import CardsGridSkeleton from "../SharedLoadingSkeletons/CardsGridSkeleton";
import VehicleCard from "../components/VehicleCard";
import { DataStore } from "aws-amplify";
import * as models from "../models/index";
import { displayErrorNotification } from "../redux/notifications/NotificationsActions";
import { dataStoreReadyStatusSelector, getWhoami } from "../redux/Selectors";
import { Stack } from "@mui/material";

function VehicleList() {
    const whoami = useSelector(getWhoami);
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);

    const addButton = whoami.roles.includes("ADMIN") ? (
        <Button component={Link} to={`/admin/add-vehicle`}>
            Add vehicle
        </Button>
    ) : (
        <></>
    );
    async function getVehicles() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const vehicles = await DataStore.query(models.Vehicle);
                setIsFetching(false);
                setVehicles(vehicles);
            } catch (error) {
                console.log("Request failed", error);
                if (error && error.message)
                    dispatch(displayErrorNotification(error.message));
                setIsFetching(false);
            }
        }
    }

    useEffect(() => getVehicles(), [dataStoreReadyStatus]);

    if (isFetching) {
        return <CardsGridSkeleton />;
    } else {
        return (
            <Stack
                spacing={2}
                direction={"column"}
                justifyContent={"flex-start"}
                alignItems={"flex-start"}
            >
                {addButton}
                <PaddedPaper width={"800px"}>
                    <Stack
                        spacing={3}
                        direction={"column"}
                        justifyContent={"flex-start"}
                    >
                        {sortByCreatedTime(
                            Object.values(vehicles),
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
}

export default VehicleList;
