import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createLoadingSelector } from "../redux/LoadingSelectors";
import CardsGridSkeleton from "../SharedLoadingSkeletons/CardsGridSkeleton";
import Grid from "@material-ui/core/Grid";
import LocationCard from "../components/LocationCard";
import { PaddedPaper } from "../styles/common";
import { dataStoreReadyStatusSelector, getWhoami } from "../redux/Selectors";
import { DataStore } from "aws-amplify";
import * as models from "../models/index";
import { displayErrorNotification } from "../redux/notifications/NotificationsActions";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function LocationsList() {
    const [locations, setLocations] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const whoami = useSelector(getWhoami);
    const dispatch = useDispatch();
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);

    async function getLocations() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const locations = await DataStore.query(models.Location);
                setIsFetching(false);
                setLocations(locations);
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
        return <CardsGridSkeleton />;
    } else {
        return (
            <Grid
                container
                direction={"column"}
                spacing={3}
                alignItems={"flex-start"}
                justify={"center"}
            >
                <Grid item>{addButton}</Grid>
                <Grid item>
                    <PaddedPaper>
                        <Grid container direction={"row"} spacing={3}>
                            {Object.values(locations).map((loc) => {
                                return (
                                    <Grid item key={loc.id}>
                                        <LocationCard
                                            uuid={loc.id}
                                            name={loc.name}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </PaddedPaper>
                </Grid>
            </Grid>
        );
    }
}
