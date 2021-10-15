import React, { useEffect, useState } from "react";
import "../App.css";
import "typeface-roboto";
import { contextDots, PaddedPaper } from "../styles/common";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { addVehicleRequest } from "../redux/vehicles/VehiclesActions";
import { encodeUUID, sortByCreatedTime } from "../utilities";
import { useDispatch, useSelector } from "react-redux";
import CardsGridSkeleton from "../SharedLoadingSkeletons/CardsGridSkeleton";
import VehicleContextMenu from "../components/ContextMenus/VehicleContextMenu";
import VehicleCard from "../components/VehicleCard";
import { DataStore } from "aws-amplify";
import * as models from "../models/index";
import { displayErrorNotification } from "../redux/notifications/NotificationsActions";
import { dataStoreReadyStatusSelector, getWhoami } from "../redux/Selectors";

function VehicleList() {
    const contextClass = contextDots();
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
            <Grid
                container
                spacing={2}
                direction={"column"}
                justifyContent={"flex-start"}
                alignItems={"flex-start"}
            >
                <Grid item>{addButton}</Grid>
                <Grid item>
                    <PaddedPaper width={"800px"}>
                        <Grid
                            container
                            spacing={1}
                            direction={"row"}
                            justifyContent={"flex-start"}
                            alignItems={"center"}
                        >
                            <Grid item>
                                <Grid
                                    container
                                    spacing={3}
                                    direction={"row"}
                                    justifyContent={"flex-start"}
                                    alignItems={"center"}
                                >
                                    {sortByCreatedTime(
                                        Object.values(vehicles),
                                        "newest"
                                    ).map((vehicle) => (
                                        <Grid item key={vehicle.id}>
                                            <div
                                                style={{
                                                    cursor: "context-menu",
                                                    position: "relative",
                                                }}
                                            >
                                                <Link
                                                    to={
                                                        "/vehicle/" +
                                                        encodeUUID(vehicle.id)
                                                    }
                                                    style={{
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    <VehicleCard
                                                        vehicle={vehicle}
                                                    />
                                                </Link>
                                                <div
                                                    className={
                                                        contextClass.root
                                                    }
                                                >
                                                    <VehicleContextMenu
                                                        vehicleUUID={vehicle.id}
                                                    />
                                                </div>
                                            </div>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </PaddedPaper>
                </Grid>
            </Grid>
        );
    }
}

export default VehicleList;
