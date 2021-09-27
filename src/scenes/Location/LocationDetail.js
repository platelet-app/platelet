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
import { dataStoreReadyStatusSelector } from "../../redux/Selectors";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { Grid } from "@material-ui/core";
import { TextFieldUncontrolled } from "../../components/TextFields";

const initialLocationState = {
    name: null,
    contact: null,
    telephoneNumber: null,
    emailAddress: null,
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

const fields = {
    name: "Name",
    ward: "Ward",
    line1: "Line 1",
    line2: "Line 2",
    line3: "Line 3",
    town: "Town",
    county: "County",
    country: "Country",
    state: "State",
    postcode: "Postcode",
    what3words: "What 3 Words",
    contact: "Contact name",
    emailAddress: "Contact email",
    telephoneNumber: "Contact telephone",
};

export default function LocationDetail(props) {
    const locationUUID = decodeUUID(props.match.params.location_uuid_b62);
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [notFound, setNotFound] = useState(false);
    const [location, setLocation] = useState(initialLocationState);

    async function newLocationProfile() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const location = await DataStore.query(
                    models.Location,
                    locationUUID
                );
                setIsFetching(false);
                if (location) setLocation(location);
                else setNotFound(true);
            } catch (error) {
                setIsFetching(false);
                dispatch(
                    displayErrorNotification(
                        `Failed to get user: ${error.message}`
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

    if (isFetching) {
        return <FormSkeleton />;
    } else if (notFound) {
        return <NotFound>Location {locationUUID} could not be found.</NotFound>;
    } else {
        return (
            <React.Fragment>
                <PaddedPaper>
                    <Grid
                        container
                        direction={"column"}
                        justify={"flex-start"}
                        alignItems={"flex-start"}
                        spacing={1}
                    >
                        {Object.keys(fields).map((key) => {
                            return (
                                <Grid key={key} item>
                                    <TextFieldUncontrolled
                                        value={location[key]}
                                        fullWidth
                                        label={fields[key]}
                                        id={key}
                                        onChange={(e) => {
                                            setLocation({
                                                ...location,
                                                [key]: e.target.value,
                                            });
                                        }}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                </PaddedPaper>
                <CommentsSection parentUUID={locationUUID} />
            </React.Fragment>
        );
    }
}
