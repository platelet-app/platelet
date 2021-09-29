import React, { useEffect, useState } from "react";
import CommentsSection from "../Comments/CommentsSection";
import { decodeUUID } from "../../utilities";
import { PaddedPaper } from "../../styles/common";
import { useDispatch, useSelector } from "react-redux";
import { getLocationRequest } from "../../redux/locations/LocationsActions";
import {
    createLoadingSelector,
    createNotFoundSelector,
} from "../../redux/LoadingSelectors";
import NotFound from "../../ErrorComponents/NotFound";
import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";
import { DataStore } from "aws-amplify";
import * as models from "../../models/index";
import { dataStoreReadyStatusSelector, getWhoami } from "../../redux/Selectors";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { Divider, Grid, makeStyles, Typography } from "@material-ui/core";
import { TextFieldUncontrolled } from "../../components/TextFields";
import { EditModeToggleButton } from "../../components/EditModeToggleButton";
import SaveCancelButtons from "../../components/SaveCancelButtons";
import LocationProfile from "./components/LocationProfile";

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

export default function LocationDetail(props) {
    const locationUUID = decodeUUID(props.match.params.location_uuid_b62);
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const [location, setLocation] = useState(initialLocationState);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [notFound, setNotFound] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    console.log(location);

    async function newLocationProfile() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const locationResult = await DataStore.query(
                    models.Location,
                    locationUUID
                );
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
        }
    }
    useEffect(
        () => newLocationProfile(),
        [props.location.key, dataStoreReadyStatus]
    );

    async function onUpdate(value) {
        const { contact, ...rest } = value;
        try {
            await DataStore.save(
                models.Location.copyOf(rest, (updated) => {
                    for (const [key, newValue] of Object.entries(rest)) {
                        if (key !== "id") updated[key] = newValue;
                    }
                })
            );
            await DataStore.save(
                models.AddressAndContactDetails.copyOf(contact, (updated) => {
                    for (const [key, newValue] of Object.entries(contact)) {
                        if (key !== "id") updated[key] = newValue;
                    }
                })
            );
            setIsPosting(false);
        } catch (error) {
            throw error;
            console.log("Update request failed", error);
            dispatch(displayErrorNotification(error.message));
            setIsPosting(false);
        }
    }

    if (isFetching) {
        return <FormSkeleton />;
    } else if (notFound) {
        return <NotFound>Location {locationUUID} could not be found.</NotFound>;
    } else {
        return (
            <React.Fragment>
                <PaddedPaper>
                    <LocationProfile onUpdate={onUpdate} location={location} />
                </PaddedPaper>
                <CommentsSection parentUUID={locationUUID} />
            </React.Fragment>
        );
    }
}
