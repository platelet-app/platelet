import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {Typography} from "@material-ui/core";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createLoadingSelector} from "../redux/selectors";
import FormSkeleton from "../loadingComponents/FormSkeleton";
import UserProfile from "../components/UserProfile"

export default function MyUserProfile() {
    const loadingSelector = createLoadingSelector(['GET_WHOAMI']);
    const isFetching = useSelector(state => loadingSelector(state));
    const whoami = useSelector(state => state.whoami);
    if (isFetching) {
        return (
            <FormSkeleton/>
        )
    } else {

        return (
            <UserProfile user={whoami}/>
        )
    }
}
