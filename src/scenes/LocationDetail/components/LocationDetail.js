import React, { useEffect, useRef, useState } from "react";
import CommentsSection from "../../Comments/CommentsSection";
import { PaddedPaper } from "../../../styles/common";
import { useDispatch, useSelector } from "react-redux";
import NotFound from "../../../ErrorComponents/NotFound";
import Skeleton from "@mui/material/Skeleton";
import { DataStore } from "aws-amplify";
import * as models from "../../../models/index";
import { dataStoreModelSyncedStatusSelector } from "../../../redux/Selectors";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import LocationProfile from "./LocationProfile";
import { protectedFields } from "../../../apiConsts";
import { Divider, Stack } from "@mui/material";
import EnableDisableLocation from "./EnableDisableLocation";

const initialLocationState = {
    name: null,
    contact: { name: null, telephoneNumber: null, emailAddress: null },
    ward: null,
    line1: null,
    line2: null,
    line3: null,
    town: null,
    county: null,
    country: null,
    state: null,
    postcode: null,
    what3words: null,
};

export default function LocationDetail({ locationId }) {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const [location, setLocation] = useState(initialLocationState);
    const [notFound, setNotFound] = useState(false);
    const locationModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Location;
    const observer = useRef({ unsubscribe: () => {} });

    const newLocationProfile = React.useCallback(async () => {
        try {
            const locationResult = await DataStore.query(
                models.Location,
                locationId
            );
            observer.current.unsubscribe();
            observer.current = DataStore.observe(
                models.Location,
                locationId
            ).subscribe(({ element }) => {
                setLocation(element);
            });
            setIsFetching(false);
            if (locationResult) {
                setLocation(locationResult);
            } else {
                setNotFound(true);
            }
        } catch (error) {
            setIsFetching(false);
            dispatch(
                displayErrorNotification(
                    `Failed to get location: ${error.message}`
                )
            );
            console.log("Request failed", error);
        }
    }, [dispatch, locationId]);
    useEffect(
        () => newLocationProfile(),
        [locationId, locationModelSynced, newLocationProfile]
    );

    useEffect(() => () => observer.current.unsubscribe(), []);

    async function onUpdate(value) {
        const { contact, ...rest } = value;
        try {
            const existingLocation = await DataStore.query(
                models.Location,
                locationId
            );
            await DataStore.save(
                models.Location.copyOf(existingLocation, (updated) => {
                    for (const [key, newValue] of Object.entries(rest)) {
                        if (!protectedFields.includes(key))
                            updated[key] = newValue;
                    }
                })
            );
            if (contact) {
                await DataStore.save(
                    models.Location.copyOf(existingLocation, (updated) => {
                        for (const [key, newValue] of Object.entries(contact)) {
                            if (!protectedFields.includes(key))
                                updated.contact[key] = newValue;
                        }
                    })
                );
            }
        } catch (error) {
            console.log("Update request failed", error);
            dispatch(displayErrorNotification(error.message));
        }
    }

    if (isFetching) {
        return (
            <React.Fragment>
                <PaddedPaper maxWidth={700}>
                    <Stack direction={"column"} spacing={3}>
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            alignItems={"top"}
                        >
                            <Skeleton variant="text" width={300} height={50} />
                        </Stack>
                        <Divider />
                        <Stack
                            direction={"column"}
                            justifyContent={"space-between"}
                            alignItems={"top"}
                            maxWidth={700}
                        >
                            {Array(4)
                                .fill(1)
                                .map((ele) => (
                                    <Skeleton
                                        variant="text"
                                        maxWidth={700}
                                        height={50}
                                    />
                                ))}
                        </Stack>
                        <Divider />
                        <Stack
                            direction={"column"}
                            justifyContent={"space-between"}
                            alignItems={"top"}
                        >
                            {Array(3)
                                .fill(1)
                                .map((ele) => (
                                    <Skeleton
                                        variant="text"
                                        maxWidth={700}
                                        height={50}
                                    />
                                ))}
                        </Stack>
                    </Stack>
                </PaddedPaper>
                <Stack height={10}></Stack>
                <PaddedPaper maxWidth={850}>
                    <Stack direction={"row"} spacing={3}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text" width={200} height={50} />
                    </Stack>
                    <Stack direction={"column"} spacing={3}>
                        <Skeleton variant="text" MaxWidth={700} height={50} />
                    </Stack>
                </PaddedPaper>
            </React.Fragment>
        );
    } else if (notFound) {
        return <NotFound>Location {locationId} could not be found.</NotFound>;
    } else {
        return (
            <React.Fragment>
                <PaddedPaper maxWidth={700}>
                    <Stack direction="column" spacing={3}>
                        <LocationProfile
                            onUpdate={onUpdate}
                            location={location}
                        />
                        {location && (
                            <EnableDisableLocation location={location} />
                        )}
                    </Stack>
                </PaddedPaper>
                <CommentsSection parentId={locationId} />
            </React.Fragment>
        );
    }
}
