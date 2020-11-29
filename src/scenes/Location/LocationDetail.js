import React, {useEffect} from "react";
import CommentsSection from "../Comments/CommentsSection";
import {decodeUUID} from "../../utilities";
import {PaddedPaper} from "../../styles/common";
import {useDispatch, useSelector} from "react-redux";
import {getLocationRequest} from "../../redux/locations/LocationsActions";
import {createLoadingSelector, createNotFoundSelector} from "../../redux/selectors";
import NotFound from "../../ErrorComponents/NotFound";
import FormSkeleton from "../../SharedLoadingSkeletons/FormSkeleton";

export default function LocationDetail(props) {
    const locationUUID = decodeUUID(props.match.params.location_uuid_b62);
    const dispatch = useDispatch();
    const location = useSelector(state => state.location.location)
    const notFoundSelector = createNotFoundSelector(["GET_LOCATION"]);
    const notFound = useSelector(state => notFoundSelector(state));
    const loadingSelector = createLoadingSelector(["GET_LOCATION"]);
    const isFetching = useSelector(state => loadingSelector(state));

    function componentDidMount() {
        if (locationUUID) {
            dispatch(getLocationRequest(locationUUID))
        }
    }

    useEffect(componentDidMount, [props.location.key]);

    if (isFetching) {
        return (
            <FormSkeleton/>
        )
    } else if (notFound) {
        return (
            <NotFound>Location {locationUUID} could not be found.</NotFound>
        )
    } else {
        return (
            <React.Fragment>
                <PaddedPaper>
                    {location.address ? location.address.line1 : ""}
                </PaddedPaper>
                <CommentsSection parentUUID={locationUUID}/>
            </React.Fragment>

        )
    }
}
